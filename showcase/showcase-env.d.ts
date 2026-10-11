/* Ambient module declarations for showcase sources (REQ-QUAL-58). CSS modules and
   AVIF assets are resolved by Vite in Storybook and in verify-showcase-imports. */
declare module '*.module.css' {
  const classes: Readonly<Record<string, string>>;
  export default classes;
}

declare module '*.avif' {
  const url: string;
  export default url;
}
