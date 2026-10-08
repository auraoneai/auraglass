import { defineMeta } from '../../foundation/index';

export default defineMeta({
  name: 'FileUpload',
  owner: 'CMP',
  entry: '.',
  tier: 'T1',
  rsc: 'client',
  parts: ['root','dropzone','input','list','item','item-name','item-size','remove'],
  states: ['active','idle'],
  variants: {},
  apg: 'button',
  migration: [{ from: 'GlassFileUpload', automation: 'mostly', compat: true }],
});
