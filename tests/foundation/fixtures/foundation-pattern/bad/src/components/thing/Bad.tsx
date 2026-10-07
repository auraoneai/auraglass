// @ts-nocheck — intentionally-invalid verify-foundation-pattern fixture
import { Accordion } from '@base-ui/react/accordion';
export interface BadProps { asChild?: boolean }
export const Bad = () => <div asChild />;
