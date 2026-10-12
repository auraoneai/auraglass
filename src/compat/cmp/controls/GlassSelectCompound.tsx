/* CMP-330 compat: GlassSelectCompound (4.x) -> Select (compound parts) (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per the target meta. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Select } from '../../../components/select';

const DEP = 'DEP-C0036';
const drop = (p: string) => warnDeprecated(`${DEP}.prop.${p}`);

/* 1:1 part map per §10.2 — ScrollUp/ScrollDown are internal to Select.Content
   in 5.0 and render nothing (warn once). */

/** 4.x onChange -> 5.0 onValueChange; shared by GlassSelectRoot and the
 *  GlassSelectCompound root, each of which warns with its own id. */
function SelectRootMapped(props: Parameters<typeof Select.Root>[0]) {
  const { onChange, ...rest } = props as Record<string, unknown>;
  return (
    <Select.Root
      {...(rest as object)}
      {...(onChange !== undefined ? { onValueChange: onChange as never } : {})}
    />
  );
}
export function GlassSelectRoot(props: Parameters<typeof Select.Root>[0]) {
  warnDeprecated('DEP-C0311'); // own symbol id (REQ-PLAT-30: once per symbol)
  return <SelectRootMapped {...props} />;
}
/** @deprecated since 4.3.0, removed in 6.0.0. Use {@link Select.Trigger}. */
export function GlassSelectTrigger(props: Parameters<typeof Select.Trigger>[0]) {
  warnDeprecated('DEP-C0298'); // own symbol id (REQ-PLAT-30: once per symbol)
  /* 4.x <Trigger><Value placeholder="…" /></Trigger> is 5.0
     <Select.Trigger placeholder="…" />: the default trigger body renders the
     selected item's label, or the placeholder while nothing is selected. */
  // A text child is valid 4.x usage; React.Children.only would throw on it.
  const kids = React.Children.toArray(props.children);
  const only = kids.length === 1 ? kids[0] : null;
  if (React.isValidElement(only) && only.type === GlassSelectValue) {
    const v = only.props as { placeholder?: React.ReactNode; children?: React.ReactNode };
    if (v.children === undefined) {
      const { children: _c, ...rest } = props;
      const placeholder = v.placeholder ?? props.placeholder;
      return <Select.Trigger {...rest} {...(placeholder !== undefined ? { placeholder } : {})} />;
    }
  }
  return <Select.Trigger {...props} />;
}
/** @deprecated since 4.3.0, removed in 6.0.0. Use {@link Select.Popup}. */
export function GlassSelectContent(props: Parameters<typeof Select.Content>[0]) {
  warnDeprecated('DEP-C0300'); // own symbol id (REQ-PLAT-30: once per symbol)
  return <Select.Content {...props} />;
}
/** @deprecated since 4.3.0, removed in 6.0.0. Use {@link Select.Item}. */
export function GlassSelectItem(props: Parameters<typeof Select.Item>[0]) {
  warnDeprecated('DEP-C0301'); // own symbol id (REQ-PLAT-30: once per symbol)
  return <Select.Item {...props} />;
}
/** @deprecated since 4.3.0, removed in 6.0.0. Use {@link Select.Value}. */
export function GlassSelectValue({ placeholder, ...props }: Parameters<typeof Select.Value>[0] & { placeholder?: React.ReactNode }) {
  warnDeprecated('DEP-C0299'); // own symbol id (REQ-PLAT-30: once per symbol)
  /* Inside GlassSelectTrigger the placeholder is lifted onto Select.Trigger
     (above). Anywhere else 5.0 has no empty-state slot for it: drop it with a
     warning rather than render it next to the selected value. */
  if (placeholder !== undefined) drop('placeholder');
  return <Select.Value {...props} />;
}
/** @deprecated since 4.3.0, removed in 6.0.0. Use {@link Select.GroupLabel}. */
export function GlassSelectLabel(props: { children?: React.ReactNode }) {
  warnDeprecated('DEP-C0302'); // own symbol id (REQ-PLAT-30: once per symbol)
  return <Select.GroupLabel {...props} />;
}
/** @deprecated since 4.3.0, removed in 6.0.0. Use {@link Select.Group}. */
export function GlassSelectGroup(props: Parameters<typeof Select.Group>[0]) {
  warnDeprecated('DEP-C0303'); // own symbol id (REQ-PLAT-30: once per symbol)
  return <Select.Group {...props} />;
}
/** @deprecated since 4.3.0, removed in 6.0.0. Use {@link Select.Separator}. */
export function GlassSelectSeparator(props: Parameters<typeof Select.Separator>[0]) {
  warnDeprecated('DEP-C0304'); // own symbol id (REQ-PLAT-30: once per symbol)
  return <Select.Separator {...props} />;
}
export function GlassSelectScrollUp() {
  warnDeprecated(`${DEP}.part.ScrollUp`);
  return null;
}
export function GlassSelectScrollDown() {
  warnDeprecated(`${DEP}.part.ScrollDown`);
  return null;
}

/* 4.x consumers render <GlassSelectCompound> itself as the root (see
   tests/fixtures/consumer-4x/cases/cmp/settings-form.tsx) as well as its
   dotted parts, so the export is the Root component carrying the parts. */
function GlassSelectCompoundRoot(props: Parameters<typeof Select.Root>[0]) {
  warnDeprecated(DEP);
  return <SelectRootMapped {...props} />;
}

/** @deprecated since 4.3.0, removed in 6.0.0. Use {@link Select}. */
export const GlassSelectCompound = /*#__PURE__*/ Object.assign(GlassSelectCompoundRoot, {
  Root: GlassSelectRoot,
  Trigger: GlassSelectTrigger,
  Content: GlassSelectContent,
  Item: GlassSelectItem,
  Value: GlassSelectValue,
  Label: GlassSelectLabel,
  Group: GlassSelectGroup,
  Separator: GlassSelectSeparator,
  ScrollUp: GlassSelectScrollUp,
  ScrollDown: GlassSelectScrollDown,
});
export default GlassSelectCompound;
