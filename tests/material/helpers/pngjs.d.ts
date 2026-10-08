/* Minimal local typing for pngjs 7 (dev-only transitive dep of pixelmatch —
   no published @types/pngjs for v7). Enough for PNG.sync.read/write in the
   MAT pixel helpers. */
declare module 'pngjs' {
  export interface PNGOptions {
    width?: number;
    height?: number;
  }
  export interface PNGData extends Buffer { }
  export class PNG {
    constructor(options?: PNGOptions);
    width: number;
    height: number;
    data: Buffer;
    static sync: {
      read(buf: Buffer): PNG;
      write(png: PNG, options?: { colorType?: number }): Buffer;
    };
  }
}
