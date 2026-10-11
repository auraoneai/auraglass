import { useReducedMotion } from 'aura-glass';
export const G = () => { const r = useReducedMotion(); return r ? null : <div/>; };
