/** Control family registry (PRD §FND-139): every flagship control family registers its canonical fixture here. */
import * as React from 'react';
import { ButtonFixture } from './fixtures/button';

export interface FamilyRegistration {
  family: string;
  fixture: React.ComponentType;
}

export const CONTROL_FAMILIES: readonly FamilyRegistration[] = [
  { family: 'button', fixture: ButtonFixture },
];
