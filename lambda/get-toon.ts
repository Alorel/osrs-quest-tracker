import * as compress from './inc/compress';
import {fetchToon} from './inc/fetchToon';
import {Req} from './types/Request';
import {RspObj} from './types/Response';

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
