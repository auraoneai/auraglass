/* Server Inspector (SURF-055): <aside aria-label> (required — dev-warned when
   missing), data-ag-slot=inspector, mode auto|docked|floating|sheet. Field is
   a labelled value grid row; Inspector.Section (client) collapses regions.
   Container modes are CSS-owned (SURF-057). */

import * as React from 'react';
import { LandmarkBeacon } from './_internal/LandmarkBeacon';
import type { PartProps } from '../contracts/components';
import { partElement } from './_internal/partElement';
import { Surface } from '../material';
import { InspectorSection } from './Inspector.Section';
import { InspectorCloseButton } from './Inspector.CloseButton';

export type InspectorRootProps = Omit<PartProps<'aside'>, 'aria-label'> & {
  'aria-label': string;
  /** auto = CSS decides by container; docked/floating/sheet pin a mode. */
  mode?: 'auto' | 'docked' | 'floating' | 'sheet' | undefined;
};

function InspectorRoot({ mode = 'auto', children, render, ...rest }: InspectorRootProps) {
  if (process.env['NODE_ENV'] === 'development' && rest['aria-label'] === undefined) {
    console.warn('[auraglass] Inspector.Root: aria-label is required — complementary landmarks must be labelled.');
  }
  return (
    <Surface
      layer="chrome"
      variant="regular"
      render={partElement('aside', {
        render,
        'data-ag-slot': 'inspector',
        'data-ag-part': 'inspector',
        'data-ag-inspector-mode': mode,
        className: 'ag-inspector',
        ...rest,
        children: (
          <>
            <LandmarkBeacon role="complementary" name={rest['aria-label'] as string | undefined} />
            {children}
          </>
        ),
      })}
    />
  );
}
InspectorRoot.displayName = 'Inspector.Root';

export type InspectorHeaderProps = PartProps<'div'> & { title?: React.ReactNode };

function InspectorHeader({ title, children, render, ...rest }: InspectorHeaderProps) {
  void render;
  return (
    <div data-ag-part="inspector-header" className="ag-inspector__header" {...(rest as Record<string, unknown>)}>
      {title !== undefined ? <h2 data-ag-part="inspector-title">{title}</h2> : null}
      {children}
      <InspectorCloseButton />
    </div>
  );
}
InspectorHeader.displayName = 'Inspector.Header';

function InspectorContent({ children, render, ...rest }: PartProps<'div'>) {
  return partElement('div', {
    render,
    'data-ag-part': 'inspector-content',
    className: 'ag-inspector__content',
    ...rest,
    children,
  });
}
InspectorContent.displayName = 'Inspector.Content';

export type InspectorFieldProps = PartProps<'div'> & {
  label: React.ReactNode;
  /** htmlFor target id of the value control. */
  htmlFor?: string | undefined;
  value?: React.ReactNode;
};

function InspectorField({ label, htmlFor, value, children, render, ...rest }: InspectorFieldProps) {
  return partElement('div', {
    render,
    'data-ag-part': 'inspector-field',
    className: 'ag-inspector__field',
    ...rest,
    children: (
      <>
        <label data-ag-part="inspector-field-label" {...(htmlFor ? { htmlFor } : {})}>
          {label}
        </label>
        <div data-ag-part="inspector-field-value">{value ?? children}</div>
      </>
    ),
  });
}
InspectorField.displayName = 'Inspector.Field';

export const Inspector = {
  Root: InspectorRoot,
  Header: InspectorHeader,
  Content: InspectorContent,
  Field: InspectorField,
  Section: InspectorSection,
};
