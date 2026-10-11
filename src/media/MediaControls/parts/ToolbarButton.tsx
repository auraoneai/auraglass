/* REQ-SURF-135/138 — one toolbar item = Base UI Toolbar.Button (the roving
 * tabindex item CMP Toolbar.Button is built on) rendering the CMP IconButton.
 * CMP Toolbar.Button pins data-ag-part="button" on its render element, which
 * would erase the media-<part> markers (selectors, meta, specs), so the same
 * composition is done here with the part name passed through. The CMP seam
 * request to let Toolbar.Button forward a part name is recorded in the PR. */
import * as React from 'react';
import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import { IconButton } from '../../../components/icon-button';

export interface MediaToolbarButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color' | 'prefix' | 'onChange'> {
  'data-ag-part': string;
  label: string;
  icon: React.ReactNode;
  className?: string | undefined;
  ref?: React.Ref<HTMLButtonElement> | undefined;
}

export function MediaToolbarButton(props: MediaToolbarButtonProps): React.ReactElement {
  const { 'data-ag-part': part, label, icon, className, ref, ...rest } = props;
  return (
    <BaseToolbar.Button
      {...(rest as React.ComponentProps<typeof BaseToolbar.Button>)}
      ref={ref}
      render={
        <IconButton
          label={label}
          icon={icon}
          data-ag-part={part}
          suppressInnerParts
          className={['ag-media-btn', className].filter(Boolean).join(' ')}
        />
      }
    />
  );
}
