/* S-40 (QUAL). Jest setup: @testing-library/jest-dom + jest-axe matchers. */
import '@testing-library/jest-dom/jest-globals';
import { expect } from '@jest/globals';
import { toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations as Parameters<typeof expect.extend>[0]);
