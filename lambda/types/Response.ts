export interface RspObjPartial {
  headers?: { [k: string]: string };

  statusCode: number;
}

export interface RspObj extends RspObjPartial {
  body: string;

  isBase64Encoded?: boolean;
}
