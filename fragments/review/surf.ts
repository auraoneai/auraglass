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
const w4 = [
  { id: 'RV-SURF-W4-01', subject: 'scenes/clear-over-media', criterion: 'specular-quality', note: 'clear controls keep legibility over sampled tones, light and dark' },
  { id: 'RV-SURF-W4-02', subject: 'surf/media-controls--default', criterion: 'optical-hierarchy', note: 'play + scrubber lead; rate/pip/fullscreen recede' },
  { id: 'RV-SURF-W4-03', subject: 'surf/now-playing--default', criterion: 'optical-hierarchy', note: 'title/artwork read first; progress is a hairline' },
  { id: 'RV-SURF-W4-04', subject: 'surf/image-viewer--open', criterion: 'specular-quality', note: 'scrim dims chrome behind; inspector floats once' },
  { id: 'RV-SURF-W4-05', subject: 'surf/backdrop--aurora', criterion: 'optical-hierarchy', note: 'backdrop stays ambient; content contrast never dips' },
  { id: 'RV-SURF-W4-06', subject: 'surf/media-controls--default', criterion: 'one-hand', note: 'primary transport targets >=44px at coarse pointers' },
] as const;
// --- lane W4 end ---

// --- lane W5 begin ---
// REQ-SURF-194 (REQ-FIN-90): L14 design-review items for the six product-surface
// blocks, subject `blocks/<id>--default`. Definitions only — L14 scores are human
// work (FIN-H, REQ-FIN-111); nothing here records a result.
const w5 = [
  { id: 'RV-SURF-W5-01', subject: 'blocks/app-frame--default', criterion: 'optical-hierarchy', note: 'main column reads first; sidebar, inspector, top bar and status bar recede' },
  { id: 'RV-SURF-W5-02', subject: 'blocks/app-frame--default', criterion: 'specular-quality', note: 'glass sheen only on sidebar/inspector/top-bar chrome; content area stays flat' },
  { id: 'RV-SURF-W5-03', subject: 'blocks/app-frame--default', criterion: 'radius-rhythm', note: 'rail, inspector and content corners follow one --ag-radius ladder' },
  { id: 'RV-SURF-W5-04', subject: 'blocks/data-workspace--default', criterion: 'optical-hierarchy', note: 'table rows lead; filter bar, tree and pagination recede; stat cards scan in one row' },
  { id: 'RV-SURF-W5-05', subject: 'blocks/data-workspace--default', criterion: 'radius-rhythm', note: 'stat cards, filter chips and table frame share the --ag-radius ladder' },
  { id: 'RV-SURF-W5-06', subject: 'blocks/analytics-dashboard--default', criterion: 'optical-hierarchy', note: 'chart marks lead; axes, gridlines and timeline meta dim' },
  { id: 'RV-SURF-W5-07', subject: 'blocks/analytics-dashboard--default', criterion: 'specular-quality', note: 'chart frame and stat cards stay flat; no sheen over data marks' },
  { id: 'RV-SURF-W5-08', subject: 'blocks/media-viewer--default', criterion: 'specular-quality', note: 'clear transport controls over video keep legibility; scrim only when the viewer opens' },
  { id: 'RV-SURF-W5-09', subject: 'blocks/media-viewer--default', criterion: 'one-hand', note: 'play, scrubber and fullscreen reachable at coarse pointers (>=44px targets)' },
  { id: 'RV-SURF-W5-10', subject: 'blocks/ai-workspace--default', criterion: 'radius-rhythm', note: 'message bubbles, composer and tool cards follow the --ag-radius ladder' },
  { id: 'RV-SURF-W5-11', subject: 'blocks/support-inbox--default', criterion: 'optical-hierarchy', note: 'selected ticket leads; queue table and filters recede' },
  { id: 'RV-SURF-W5-12', subject: 'blocks/support-inbox--default', criterion: 'one-hand', note: 'ticket actions and filter chips reachable at coarse pointers' },
] as const;
// --- lane W5 end ---

export default [...w1, ...w2, ...w3, ...w4, ...w5] satisfies readonly ReviewItem[];
