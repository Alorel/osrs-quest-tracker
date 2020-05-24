export interface Req {
  headers: { [k: string]: string };

  queryStringParameters: { [k: string]: string };
}
