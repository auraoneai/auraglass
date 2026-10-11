/* CMP-303/CMP-423: Kbd — renders <kbd> content-sunken. `keys` renders a nested
   <kbd> per key joined by '+' separators; plain children render a single <kbd>.
   parts [root, item, separator]; server. */
import * as React from 'react';
import { cn } from '../../internal/index';
import { materialProps } from '../../material/index';

const SUNKEN = materialProps({ layer: 'content', content: 'content-sunken' });

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  /** Key sequence — each entry becomes its own nested <kbd>. */
  keys?: readonly string[];
}

export function Kbd({
  keys,
  children,
  className,
  ref,
  ...rest
}: KbdProps & { ref?: React.Ref<HTMLElement> | undefined }) {
  return (
    <kbd {...rest} {...SUNKEN} ref={ref} data-ag-part="root" className={cn('ag-kbd', SUNKEN.className, className)}>
      {keys && keys.length > 0
        ? keys.map((key, i) => (
            <React.Fragment key={`${key}-${i}`}>
              {i > 0 ? (
                <span data-ag-part="separator" className="ag-kbd-separator" aria-hidden="true">
                  +
                </span>
              ) : null}
              <kbd data-ag-part="item" className="ag-kbd-item">
                {key}
              </kbd>
            </React.Fragment>
          ))
        : children}
    </kbd>
  );
}
