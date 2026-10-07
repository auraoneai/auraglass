// review fragment for SURF (contract S-38..S-45). Lane blocks are owned by SURF lanes W1..W5; edit only your own block.
import type { ReviewItem } from '../../src/contracts/fragments';

// --- lane W1 begin ---
const w1 = [
  { id: 'RV-SURF-W1-01', subject: 'surf/appshell--default', criterion: 'specular-quality', note: 'glass sheen sits on rails/inspector only; content area is flat' },
  { id: 'RV-SURF-W1-02', subject: 'surf/appshell--default', criterion: 'optical-hierarchy', note: 'sidebar/tab-bar recede; main column reads first' },
  { id: 'RV-SURF-W1-03', subject: 'surf/appshell--default', criterion: 'radius-rhythm', note: 'rail corners follow --ag-radius ladder' },
  { id: 'RV-SURF-W1-04', subject: 'surf/mobileshell--default', criterion: 'one-hand', note: 'tab bar + accessory within thumb arc at 390px' },
  { id: 'RV-SURF-W1-05', subject: 'surf/mobileshell--default', criterion: 'optical-hierarchy', note: 'top bar detaches visually over content' },
  { id: 'RV-SURF-W1-06', subject: 'surf/inspector--default', criterion: 'optical-hierarchy', note: 'docked inspector dims under overlay top bar' },
  { id: 'RV-SURF-W1-07', subject: 'surf/resizablepanels--default', criterion: 'specular-quality', note: 'splitter handle visible but low-glare' },
  { id: 'RV-SURF-W1-08', subject: 'surf/statusbar--default', criterion: 'optical-hierarchy', note: 'status bar stays subordinate; live region does not flash' },
  { id: 'RV-SURF-W1-09', subject: 'surf/tabbar--default', criterion: 'one-hand', note: 'primary tab targets >=44px at coarse pointers' },
  { id: 'RV-SURF-W1-10', subject: 'scenes/clear-over-media', criterion: 'specular-quality', note: 'clear material over media scene keeps text legible' },
] as const;
// --- lane W1 end ---

// --- lane W2 begin ---
const w2 = [
  { id: 'RV-SURF-W2-01', subject: 'surf/table--default', criterion: 'optical-hierarchy', note: 'header recedes; row data leads; resize/pin affordances appear on intent' },
  { id: 'RV-SURF-W2-02', subject: 'surf/tree-view--default', criterion: 'optical-hierarchy', note: 'chevrons and indent guide depth without chrome' },
  { id: 'RV-SURF-W2-03', subject: 'surf/date-picker--default', criterion: 'specular-quality', note: 'popover card floats once; field stays flat' },
  { id: 'RV-SURF-W2-04', subject: 'surf/stat-card--default', criterion: 'radius-rhythm', note: 'card corners follow --ag-radius ladder at all sizes' },
  { id: 'RV-SURF-W2-05', subject: 'surf/activity-feed--default', criterion: 'optical-hierarchy', note: 'day headings anchor; meta dims' },
] as const;
// --- lane W2 end ---

// --- lane W3 begin ---
const w3 = [
  { id: 'RV-SURF-W3-01', subject: 'blocks/ai-workspace--default', criterion: 'specular-quality', note: 'composer and jump pill float once; message text stays flat' },
  { id: 'RV-SURF-W3-02', subject: 'surf/thread--default', criterion: 'optical-hierarchy', note: 'assistant text leads; timestamps and actions recede until intent' },
  { id: 'RV-SURF-W3-03', subject: 'surf/tool-call--default', criterion: 'optical-hierarchy', note: 'tool state reads before the payload' },
  { id: 'RV-SURF-W3-04', subject: 'surf/citation--default', criterion: 'radius-rhythm', note: 'preview card follows the --ag-radius ladder' },
  { id: 'RV-SURF-W3-05', subject: 'blocks/ai-workspace--default', criterion: 'one-hand', note: 'submit/stop and jump pill reachable at coarse pointers' },
] as const;
// --- lane W3 end ---

// --- lane W4 begin ---
const w4 = [] as const;
// --- lane W4 end ---

// --- lane W5 begin ---
const w5 = [] as const;
// --- lane W5 end ---

export default [...w1, ...w2, ...w3, ...w4, ...w5] satisfies readonly ReviewItem[];
