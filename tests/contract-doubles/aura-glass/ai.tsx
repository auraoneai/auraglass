import { comp, compound } from './_factory';
export const ProviderErrorState = comp('ProviderErrorState');
export const Thread = comp('Thread');
export const UsageMeter = comp('UsageMeter');
export const AgentSteps = compound('AgentSteps');
export const Composer = compound('Composer');
export type AgMessage = { id: string; role?: string; content?: string };
export type AgStep = { id: string; label?: string };
export type AgUsage = { used?: number; limit?: number };
