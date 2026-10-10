/* AuraGlass 5.0 contract-v1.0. CONTRACT-owned. Grammar implemented by CMP; obeyed by CMP and SURF. */
import type * as React from 'react';
import type { MaterialVariant, Thickness } from './material';

// ---- S-30 prop grammar (was SC-24) ----
export type Intent = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type Size = 'sm' | 'md' | 'lg';                   // components may accept a subset; emitted as data-ag-size
export interface MaterialBearingProps { variant?: MaterialVariant; thickness?: Thickness; prominent?: boolean; refraction?: boolean }
export interface IntentProps<I extends Intent = Intent> { intent?: I }       // tints text/rim/specular; never selects material
export interface SizeProps<S extends Size = Size> { size?: S }
export interface ChangeDetails { event: Event | undefined; reason: string }  // never a Base UI or RA type
export type RenderProp<P = Record<string, unknown>, S = Record<string, unknown>> =
  React.ReactElement | ((props: P, state: S) => React.ReactElement);
export interface RenderProps<P = Record<string, unknown>, S = Record<string, unknown>> { render?: RenderProp<P, S> }
export interface ValueProps<T> { value?: T; defaultValue?: T; onValueChange?: (value: T, details: ChangeDetails) => void }
export interface CheckedProps { checked?: boolean; defaultChecked?: boolean; onCheckedChange?: (checked: boolean, details: ChangeDetails) => void }
export interface OpenProps { open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean, details: ChangeDetails) => void }
/** Banned prop names on every 5.0 component (type test + lint auraglass/prop-grammar): */
export const BANNED_PROPS = ['material', 'elevation', 'as', 'tone', 'asChild', 'onChange' /* value callbacks */] as const;
/** Non-material visual choice uses `appearance` (emitted as data-ag-appearance), never `variant`. */
export type PartProps<E extends keyof React.JSX.IntrinsicElements = 'div'> =
  Omit<React.ComponentPropsWithoutRef<E>, 'onChange'> & RenderProps & { ref?: React.Ref<HTMLElement> };

// 4.x Button mapping used by compat and the prop-grammar codemod
export const BUTTON_VARIANT_MAP = {
  primary: { prominent: true }, secondary: { variant: 'regular' }, ghost: { variant: 'identity' }, danger: { intent: 'danger' },
} as const;

// ---- S-33 part grammar ----
export type AgPart = string & { readonly __kebab?: never };   // kebab-case; validated by PART_NAME_RE
export const PART_NAME_RE = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
export const COMMON_PARTS = ['root', 'trigger', 'content', 'popup', 'positioner', 'backdrop', 'item', 'item-indicator',
  'indicator', 'thumb', 'track', 'range', 'label', 'description', 'error', 'icon', 'close', 'title', 'header', 'footer',
  'body', 'list', 'group', 'group-label', 'separator', 'viewport', 'arrow', 'value', 'input', 'clear', 'hit-area'] as const;
/** Compound naming: Name.Root, Name.Trigger, Name.Content, Name.Item ...; flat export for single-part components. */

// ---- S-31 typed metadata (<Name>.meta.ts, one per exported component) ----
export interface MigrationRow {
  from: string;                                  // 4.x export name, e.g. 'GlassButton'
  props?: Record<string, string | { to: string; values?: Record<string, string> } | null>; // null = removed prop
  selectors?: Record<string, string>;            // 4.x CSS selector -> 5.0 data-ag-part/data-state selector
  automation: 'full' | 'mostly' | 'partial' | 'manual' | 'none';
  compat: boolean;                               // ships an adapter in aura-glass/compat
}
export interface ComponentMeta {
  name: string;                                  // 5.0 export name
  owner: 'CMP' | 'SURF' | 'MAT';
  entry: string;                                 // subpath from S-35, e.g. '.', './data'
  tier: 'T0' | 'T1' | 'T2' | 'preview';
  flagship?: number;                             // 1..44 (architecture §11.2)
  rsc: 'server' | 'client' | 'mixed';
  parts: readonly AgPart[];
  states: readonly string[];                     // data-state / Base UI data-* values
  variants: Readonly<Record<string, readonly string[]>>; // e.g. { variant: [...], size: [...], intent: [...], appearance: [...] }
  material?: { layer: 'chrome' | 'overlay' | 'transient' | 'content'; refractionEligible?: boolean };
  apg?: string;                                  // APG pattern URL when interactive
  budgetKb?: number;                             // must match the stream's size-budgets fragment row
  migration: readonly MigrationRow[];
}
export type DefineMeta = <const M extends ComponentMeta>(meta: M) => M;     // runtime: src/foundation/index.ts (seed)

// ---- S-32 Base UI wrapping helpers (runtime in src/foundation/index.ts, CMP) ----
export type ToChangeDetails = (eventDetails: unknown) => ChangeDetails;
export type RenderElement = <P extends object>(render: RenderProp<P> | undefined, fallback: React.ReactElement, props: P, state?: object) => React.ReactElement;

// ---- S-30 component contracts that other streams compose (exports of CMP modules) ----
export type ButtonContract = React.FC<MaterialBearingProps & IntentProps & SizeProps & RenderProps
  & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'>
  & { pressed?: boolean; defaultPressed?: boolean; onPressedChange?: (p: boolean, d: ChangeDetails) => void; loading?: boolean; ref?: React.Ref<HTMLButtonElement> }>;
export type IconButtonContract = React.FC<React.ComponentProps<ButtonContract> & { label: string; icon: React.ReactNode }>;
export type CompoundContract<Parts extends string, RootProps> =
  { [P in Parts]: React.FC<(P extends 'Root' ? RootProps : unknown) & PartProps & { children?: React.ReactNode }> };
export const COMPOUND_PARTS = {
  Dialog: ['Root', 'Trigger', 'Content', 'Title', 'Description', 'Close'],
  AlertDialog: ['Root', 'Trigger', 'Content', 'Title', 'Description', 'Cancel', 'Action'],
  Sheet: ['Root', 'Trigger', 'Content', 'Title', 'Description', 'Close', 'Handle'],
  Popover: ['Root', 'Trigger', 'Content', 'Title', 'Description', 'Close', 'Arrow'],
  Tooltip: ['Root', 'Trigger', 'Content', 'Arrow'],
  Menu: ['Root', 'Trigger', 'Content', 'Item', 'CheckboxItem', 'RadioGroup', 'RadioItem', 'Group', 'GroupLabel', 'Separator', 'Submenu', 'SubmenuTrigger'],
  ContextMenu: ['Root', 'Trigger', 'Content', 'Item', 'Group', 'GroupLabel', 'Separator'],
  ColorPicker: ['Root', 'Trigger', 'Content', 'Area', 'Hue'],
  Toast: ['Provider', 'Viewport', 'Root', 'Title', 'Description', 'Action', 'Close'],
  Select: ['Root', 'Trigger', 'Value', 'Content', 'Item', 'ItemIndicator', 'Group', 'GroupLabel', 'Separator'],
  Combobox: ['Root', 'Input', 'Trigger', 'Content', 'Item', 'Empty', 'Chips', 'Chip', 'ChipRemove', 'Clear'],
  Toolbar: ['Root', 'Button', 'Group', 'Separator', 'Link'],
  ToggleGroup: ['Root', 'Item'],
  SegmentedControl: ['Root', 'Item'],
  Slider: ['Root', 'Value'],
  RadioGroup: ['Root', 'Item'],
  Field: ['Root', 'Label', 'Control', 'Description', 'Error'],
  Collapsible: ['Root', 'Trigger', 'Content'],
  Accordion: ['Root', 'Item', 'Header', 'Trigger', 'Content'],
  ScrollArea: ['Root', 'Viewport', 'Scrollbar', 'Thumb'],
  Avatar: ['Root', 'Image', 'Fallback'],
  Card: ['Root', 'Header', 'Title', 'Description', 'Body', 'Footer'],
  Tour: ['Root', 'Step'],
} as const;
export interface CmpRootProps {
  Dialog: OpenProps & { modal?: boolean } & MaterialBearingProps;
  AlertDialog: OpenProps;
  Sheet: OpenProps & { side?: 'start' | 'end' | 'top' | 'bottom'; detents?: number[]; modal?: boolean };
  Popover: OpenProps & { openOnHover?: boolean; delay?: number } & MaterialBearingProps;
  Tooltip: OpenProps & { delay?: number };
  Menu: OpenProps; ContextMenu: OpenProps; Menubar: { orientation?: 'horizontal' | 'vertical' };
  Toast: { limit?: number }; Select: ValueProps<string> & OpenProps & SizeProps; Combobox: ValueProps<string | string[]> & OpenProps & { multiple?: boolean };
  Toolbar: { orientation?: 'horizontal' | 'vertical' } & MaterialBearingProps; ToggleGroup: ValueProps<string[]> & { multiple?: boolean };
  SegmentedControl: ValueProps<string> & SizeProps; Slider: ValueProps<number | number[]> & { min?: number; max?: number; step?: number };
  RadioGroup: ValueProps<string>; Field: { invalid?: boolean; disabled?: boolean; name?: string };
  Collapsible: OpenProps; Accordion: ValueProps<string[]> & { multiple?: boolean }; ScrollArea: Record<string, never>;
  Avatar: SizeProps; Card: MaterialBearingProps & { interactive?: boolean }; Tour: OpenProps & { step?: number };
}
/** Flat CMP components other streams compose (props = PartProps of the root element + the grammar types they list in meta): */
export const FLAT_CMP_COMPONENTS = ['Button', 'IconButton', 'ButtonGroup', 'Switch', 'Checkbox', 'CheckboxGroup', 'TextField',
  'SearchField', 'NumberField', 'Fieldset', 'Form', 'Badge', 'AvatarGroup', 'Alert', 'Progress', 'Meter', 'Skeleton', 'Separator', 'Kbd',
  'Link', 'Rating', 'InlineEdit', 'Menubar', 'FileUpload', 'DescriptionList', 'ImageList', 'EmptyState', 'ErrorState',
  'LoadingState', 'Text', 'Heading', 'Stack', 'Grid', 'Container', 'Icon'] as const;
/** Typed compound contracts, one per COMPOUND_PARTS key (what seeds, doubles and real components all satisfy). */
export type CmpCompounds = { [K in keyof typeof COMPOUND_PARTS]: CompoundContract<(typeof COMPOUND_PARTS)[K][number], CmpRootProps[K]> };
export type CmpExportName = keyof typeof COMPOUND_PARTS | (typeof FLAT_CMP_COMPONENTS)[number] | 'useToast';
/** The one module path that exports each name (consumers import `src/components/<dir>/index.ts`; never a deeper file). */
export const CMP_MODULES: Record<CmpExportName, `src/components/${string}/index.ts`> = {
  Button: 'src/components/button/index.ts', IconButton: 'src/components/icon-button/index.ts', ButtonGroup: 'src/components/button-group/index.ts',
  Toolbar: 'src/components/toolbar/index.ts', ToggleGroup: 'src/components/toggle-group/index.ts', SegmentedControl: 'src/components/segmented-control/index.ts',
  Switch: 'src/components/switch/index.ts', Slider: 'src/components/slider/index.ts', Checkbox: 'src/components/checkbox/index.ts',
  CheckboxGroup: 'src/components/checkbox/index.ts', RadioGroup: 'src/components/radio-group/index.ts', TextField: 'src/components/text-field/index.ts',
  SearchField: 'src/components/search-field/index.ts', Select: 'src/components/select/index.ts', Combobox: 'src/components/combobox/index.ts',
  NumberField: 'src/components/number-field/index.ts', Field: 'src/components/field/index.ts', Fieldset: 'src/components/field/index.ts',
  Form: 'src/components/field/index.ts', Dialog: 'src/components/dialog/index.ts', AlertDialog: 'src/components/alert-dialog/index.ts',
  Sheet: 'src/components/sheet/index.ts', Popover: 'src/components/popover/index.ts', Tooltip: 'src/components/tooltip/index.ts',
  Menu: 'src/components/menu/index.ts', ContextMenu: 'src/components/menu/index.ts', Menubar: 'src/components/menu/index.ts',
  Toast: 'src/components/toast/index.ts', useToast: 'src/components/toast/index.ts', Text: 'src/components/text/index.ts',
  Heading: 'src/components/heading/index.ts', Stack: 'src/components/stack/index.ts', Grid: 'src/components/grid/index.ts',
  Container: 'src/components/container/index.ts', Icon: 'src/components/icon/index.ts', Card: 'src/components/card/index.ts',
  Badge: 'src/components/badge/index.ts', Avatar: 'src/components/avatar/index.ts', AvatarGroup: 'src/components/avatar/index.ts',
  Alert: 'src/components/alert/index.ts', Progress: 'src/components/progress/index.ts', Meter: 'src/components/meter/index.ts',
  Skeleton: 'src/components/skeleton/index.ts', Separator: 'src/components/separator/index.ts', Kbd: 'src/components/kbd/index.ts',
  Accordion: 'src/components/accordion/index.ts', Collapsible: 'src/components/collapsible/index.ts', Link: 'src/components/link/index.ts',
  ScrollArea: 'src/components/scroll-area/index.ts', Rating: 'src/components/rating/index.ts', InlineEdit: 'src/components/inline-edit/index.ts',
  FileUpload: 'src/components/file-upload/index.ts', ColorPicker: 'src/components/color-picker/index.ts', DescriptionList: 'src/components/description-list/index.ts',
  ImageList: 'src/components/image-list/index.ts', Tour: 'src/components/tour/index.ts', EmptyState: 'src/components/state-view/index.ts',
  ErrorState: 'src/components/state-view/index.ts', LoadingState: 'src/components/state-view/index.ts',
};

// ---- S-30 toast API (archived REQ-OVL-61/67; Toast.Provider is mounted by the app, never by AuraGlassProvider, §4.5) ----
export interface ToastOptions { title: React.ReactNode; description?: React.ReactNode; intent?: Intent;
  action?: { label: string; onClick: () => void }; duration?: number; priority?: 'low' | 'high' }
export interface ToastHistoryItem { id: string; title: React.ReactNode; description?: React.ReactNode; intent?: Intent; createdAt: number; read: boolean }
export type UseToast = () => {
  toast(options: ToastOptions): string;
  update(id: string, options: Partial<ToastOptions>): void;
  dismiss(id?: string): void;
  promise<T>(p: Promise<T>, o: { loading: ToastOptions; success: ToastOptions | ((v: T) => ToastOptions); error: ToastOptions | ((e: unknown) => ToastOptions) }): Promise<T>;
  toasts: readonly ({ id: string } & ToastOptions)[];
  history: { items: readonly ToastHistoryItem[]; unread: number; markRead(id: string): void; markAllRead(): void; clear(): void } | null; // null unless Provider history is on
};
