declare module 'pngjs' {
  export class PNG {
    width: number; height: number; data: Buffer;
    constructor(opts?: { width?: number; height?: number });
    static sync: {
      read(buf: Buffer): PNG;
      write(png: PNG): Buffer;
    };
    static bitblt(src: PNG, dst: PNG, sx: number, sy: number, w: number, h: number, dx: number, dy: number): void;
  }
}
