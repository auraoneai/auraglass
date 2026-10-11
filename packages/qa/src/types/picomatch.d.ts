/* picomatch 4 ships no types and @types/picomatch is not a dependency; this is the subset QUAL uses. */
declare module 'picomatch' {
  interface PicomatchOptions { dot?: boolean }
  function picomatch(glob: string | readonly string[], options?: PicomatchOptions): (path: string) => boolean;
  export default picomatch;
}
