declare module 'picomatch' {
  export default function picomatch(glob: string, options?: { dot?: boolean }): (path: string) => boolean;
}
