import * as http from 'https';

export function fetchToon(basepath: string, toon: string): Promise<Buffer> {
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
