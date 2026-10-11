import { GlassAppShell, GlassHeader } from 'aura-glass';
const navItems = [{ id: 'home', label: 'Home', onClick: () => go() }];
export const p = <GlassAppShell header={<GlassHeader/>} sidebar={<GlassSidebar items={navItems}/>}>
  <h1>T</h1>
</GlassAppShell>;
