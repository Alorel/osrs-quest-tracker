export function buildCorsUrl(url: string): string {
  return `https://cors-anywhere.herokuapp.com/${encodeURI(url)}`;
}
