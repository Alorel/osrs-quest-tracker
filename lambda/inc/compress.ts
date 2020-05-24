import {brotliCompress, constants, gzip as gzipCompress} from 'zlib';
import {RspObj, RspObjPartial} from '../types/Response';

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
        },
        isBase64Encoded: true
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
