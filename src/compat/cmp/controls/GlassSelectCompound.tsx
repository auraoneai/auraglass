/* CMP-330 compat: GlassSelectCompound (4.x) -> Select (compound parts) (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per the target meta. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Select } from '../../../components/select';

const DEP = 'DEP-C0036';
const warn = () => warnDeprecated(DEP);
const drop = (p: string) => warnDeprecated(`${DEP}.prop.${p}`);

/* 1:1 part map per §10.2 — ScrollUp/ScrollDown are internal to Select.Content
   in 5.0 and render nothing (warn once). */

export function GlassSelectRoot(props: Parameters<typeof Select.Root>[0]) {
  warn();
  const { onChange, ...rest } = props as Record<string, unknown>;
  return (
    <Select.Root
      {...(rest as object)}
      {...(onChange !== undefined ? { onValueChange: onChange as never } : {})}
    />
  );
}
export function GlassSelectTrigger(props: Parameters<typeof Select.Trigger>[0]) {
  warn();
  return <Select.Trigger {...props} />;
}
export function GlassSelectContent(props: Parameters<typeof Select.Content>[0]) {
  warn();
  return <Select.Content {...props} />;
}
export function GlassSelectItem(props: Parameters<typeof Select.Item>[0]) {
  warn();
  return <Select.Item {...props} />;
}
export function GlassSelectValue({ placeholder, ...props }: Parameters<typeof Select.Value>[0] & { placeholder?: React.ReactNode }) {
  warn();
  // 5.x Select.Value renders its children as the empty-state placeholder.
  return <Select.Value {...(props as object)}>{placeholder ?? (props as { children?: React.ReactNode }).children}</Select.Value>;
}
export function GlassSelectLabel(props: { children?: React.ReactNode }) {
  warn();
  return <Select.GroupLabel {...props} />;
}
export function GlassSelectGroup(props: Parameters<typeof Select.Group>[0]) {
  warn();
  return <Select.Group {...props} />;
}
export function GlassSelectSeparator(props: Parameters<typeof Select.Separator>[0]) {
  warn();
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

export const GlassSelectCompound = {
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
};
export default GlassSelectCompound;
