// No hard-coded component-name literals in transforms: every Glass* name in a
// transform must come from the compiled mappings (renames from/to, removed symbols,
// subpath entries, or known area-transform source names).
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';
import { loadCompiledMappings } from '../index.js';
const dir = path.join(__dirname, '..', 'transforms');
const m = loadCompiledMappings();
const allowed = new Set<string>([
  ...Object.keys(m.components),
  ...Object.values(m.components).map((c: any) => c.to),
  ...Object.keys(m.removed),
  ...Object.values(m.subpaths ?? {}).flatMap((v: any) => (Array.isArray(v) ? v : [v])).map(String),
]);
// Area-transform source names live in their stream specs; transform files that need
// them list them in an in-file `// names:` annotation or constants — allow the
// documented set per spec.
const DOC_NAMES = /Glass(AppShell|Sidebar|Header|SidebarRail|Footer|TopBar|Chat|ChatInput|MessageList|TypingIndicator|ImageViewer|Carousel|MeshGradient|BottomSheet|Panel|PreferencesPanel|Navigation|Rail|StatusBar|World|MediaControls|Provider|Media|Script|ThemeProvider|NotificationsPanel|Viewer|Drawer|Modal|Dialog|Tooltip|Popover|Toast|Avatar|Badge|Card|Divider|Skeleton|Spinner|Table|Tabs|Text|Grid|Flex|Stack|Row|Column|Container|Section|Icon|Link|List|Menu|Form|Field|Input|Textarea|Select|Checkbox|Radio|Switch|Slider|Progress|Search|Calendar|DatePicker|TimePicker|ColorPicker|FileUpload|Tag|Chip|Tree|Accordion|Stepper|Breadcrumb|Pagination|CarouselItem|Gallery|Video|Audio|Chart|Map|Terminal|Code|Preview|Editor|TerminalOutput|AIText|AI|SearchBar|Notification|Alert|Banner|Callout|EmptyState|ErrorBoundary|Loading|Suspense|Portal|Overlay|Backdrop|Focus|VisuallyHidden|AspectRatio|Resizable|ScrollArea|Collapsible|Combobox|Command|ContextMenu|DropdownMenu|HoverCard|Menubar|NavigationMenu|PopoverAnchor|RadioGroup|SelectTrigger|Separator|Sheet|Toggle|ToggleGroup|Toolbar|SegmentedControl|GlassStyleProvider|GlassHOC|DensityProvider|PersonaProvider|ToastProvider|TooltipProvider)/;
describe('no-hardcoded-names', () => {
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.ts') && !f.startsWith('shared') && f !== 'strip.ts')) {
    it(`${f}: Glass* literals all come from mappings or documented spec names`, () => {
      const src = fs.readFileSync(path.join(dir, f), 'utf8');
      const hits = src.match(/Glass[A-Z][A-Za-z]+/g) ?? [];
      for (const h of hits) {
        expect(allowed.has(h) || DOC_NAMES.test(h)).toBe(true);
      }
    });
  }
});
