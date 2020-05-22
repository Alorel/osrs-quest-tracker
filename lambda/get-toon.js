const http = require('https');
const zlib = require('zlib');

function compressBrotli(rspObject, rsp) {
  return new Promise((resolve, reject) => {
    zlib.brotliCompress(rsp, (error, buf) => {
      if (error) {
        reject(error);
      } else {
        resolve({
          ...rspObject,
          body: buf.toString('base64'),
          isBase64Encoded: true,
          headers: {
            ...(rsp.headers || {}),
            'content-encoding': 'br'
          }
        });
      }
    })
  })
}

function compressGzip(rspObject, rsp) {
  return new Promise((resolve, reject) => {
    zlib.gzip(rsp, (error, buf) => {
      if (error) {
        reject(error);
      } else {
        resolve({
          ...rspObject,
          body: buf.toString('base64'),
          isBase64Encoded: true,
          headers: {
            ...(rsp.headers || {}),
            'content-encoding': 'gzip'
          }
        });
      }
    })
  })
}

function dontCompress(rspObject, rsp) {
  return {
    ...rspObject,
    body: rsp.toString()
  }
}

function fetchToon(basepath, toon) {
  console.log(`Fetching ${toon} on ${basepath}`);

  return new Promise((resolve, reject) => {
    const encPath = encodeURIComponent(basepath);
    const encToon = encodeURIComponent(toon);
    const url = `https://secure.runescape.com/m=${encPath}/index_lite.ws?player=${encToon}`;

    http
      .request(url, res => {
        const chunks = [];

        res
          .on('data', chunk => {
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

exports.handler = ({queryStringParameters: {basepath, toon}, headers}) => {
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
        return compressBrotli(out, body);
      } else if (accept.includes('gzip')) {
        return compressGzip(out, body);
      } else {
        return dontCompress(out, body);
      }
    })
    .catch(e => ({
      statusCode: 500,
      body: e.message
    }));
};
