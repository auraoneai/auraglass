// @ts-nocheck — negative fixture: intentionally-invalid input read as text by the gate under test.
// Promoted in labs 0.1.0; labs is 0.3.0, so the one-minor re-export window is over.
import { warnLabsPromoted } from '../../_internal/warn-once';
warnLabsPromoted('Promo');
export { Promo } from 'aura-glass';
