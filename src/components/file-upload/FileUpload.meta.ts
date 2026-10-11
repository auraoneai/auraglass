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
  material: { layer: 'content' },
  apg: 'button',
  budgetKb: 15,
  migration: [{ from: 'GlassFileUpload', props: {}, selectors: { '.glass-file-upload': '.ag-file-upload' },  automation: 'mostly', compat: true }],
});
