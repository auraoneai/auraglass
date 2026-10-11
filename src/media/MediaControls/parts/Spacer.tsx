import * as React from 'react';

export function Spacer({ className, ref }: { className?: string | undefined; ref?: React.Ref<HTMLSpanElement> | undefined }) {
  return <span ref={ref} data-ag-part="media-spacer" aria-hidden="true" className={['ag-media-spacer', className].filter(Boolean).join(' ')} />;
}
