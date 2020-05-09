export function isTruthy(v: boolean): v is true;
export function isTruthy(v: any): boolean;
export function isTruthy(v: any): boolean {
  return !!v;
}
