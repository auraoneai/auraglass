// @ts-nocheck — negative fixture: intentionally-invalid input read as text by the gate under test.
// 9 distinct demand links (one duplicated): REQ-SURF-184 needs 10.
import { warnLabsPromoted } from '../../_internal/warn-once';
warnLabsPromoted('Promo');
export { Promo } from 'aura-glass';
