import { usePreference } from 'aura-glass';
export const G = () => { const r = usePreference('motion') !== 'full'; return r ? null : <div/>; };
