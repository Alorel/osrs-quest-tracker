import * as http from 'https';
import {brotliCompress, constants, gzip as gzipCompress} from 'zlib';

interface RspObjPartial {
  headers?: { [k: string]: string };

  statusCode: number;
}

interface RspObj extends RspObjPartial {
  body: string;

  isBase64Encoded?: boolean;
}

module compress {
  function callback(
    rspObject: RspObjPartial,
    enc: string,
    resolve: (v: RspObj) => void,
    reject: (v: any) => void
  ): (err: any, buf: Buffer) => void {
    return (err: any, buf: Buffer): void => {
      if (err) {
        reject(err);
      } else {
        resolve({
          ...rspObject,
          body: buf.toString('base64'),
          headers: {
            ...(rspObject.headers || {}),
            'content-encoding': enc
          }
        });
      }
    };
  }

  export function brotli(rspObject: RspObjPartial, rsp: Buffer): Promise<RspObj> {
    return new Promise<RspObj>((resolve, reject) => {
      brotliCompress(
        rsp,
        {
          [constants.BROTLI_PARAM_QUALITY]: constants.BROTLI_MAX_QUALITY,
          [constants.BROTLI_PARAM_MODE]: constants.BROTLI_MODE_TEXT
        },
        callback(rspObject, 'br', resolve, reject)
      );
    });
  }

  export function gzip(rspObject: RspObjPartial, rsp: Buffer): Promise<RspObj> {
    return new Promise<RspObj>((resolve, reject) => {
      gzipCompress(
        rsp,
        {
          level: constants.Z_MAX_LEVEL,
          memLevel: constants.Z_MAX_LEVEL
        },
        callback(rspObject, 'gzip', resolve, reject)
      );
    });
  }

  export function none(rspObject: RspObjPartial, rsp: Buffer): Promise<RspObj> {
    return Promise.resolve({
      ...rspObject,
      body: rsp.toString('utf8')
    });
  }
}

function fetchToon(basepath: string, toon: string): Promise<Buffer> {
  console.log(`Fetching ${toon} on ${basepath}`);

  return new Promise<Buffer>((resolve, reject) => {
    const encPath = encodeURIComponent(basepath);
    const encToon = encodeURIComponent(toon);
    const url = `https://secure.runescape.com/m=${encPath}/index_lite.ws?player=${encToon}`;

    http
      .request(url, res => {
        const chunks: Buffer[] = [];

        res
          .on('data', (chunk: Buffer) => {
            chunks.push(chunk);
          })
          .once('end', () => {
            console.log(`Finished fetching ${toon} on ${basepath}`);
            resolve(Buffer.concat(chunks));
          })
          .once('error', reject);
      })
      .once('error', reject)
      .end();
  });
}

interface Req {
  headers: { [k: string]: string };

  queryStringParameters: { [k: string]: string };
}

export function handler({queryStringParameters: {basepath, toon}, headers}: Req): Promise<RspObj> {
  if (!basepath || !toon) {
    return Promise.resolve({
      statusCode: 400,
      body: 'basepath/toon missing'
    });
  }

  return fetchToon(basepath, toon)
    .then(body => {
      const out = {statusCode: 200};
      const accept = headers['accept-encoding'] || '';

      if (accept.includes('br')) {
        return compress.brotli(out, body);
      } else if (accept.includes('gzip')) {
        return compress.gzip(out, body);
      } else {
        return compress.none(out, body);
      }
    })
    .catch((e: Error) => ({
      statusCode: 500,
      body: e.message
    }));
}
