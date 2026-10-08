/* Fixture compile-time declarations for consumer-only modules (installed in
 * the staged consumer at spec runtime, not in this repo's node_modules). */
declare module 'aura-glass/*' {
  export const Sheet: any;
  export const TabBar: any;
  const whatever: any;
  export default whatever;
}
declare module '@vitejs/plugin-react' {
  const react: any;
  export default react;
}
