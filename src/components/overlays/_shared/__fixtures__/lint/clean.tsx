/* Sanctioned seams: ResizeObserver, Base UI plumbing, keydown ON the popup. */
import * as React from 'react';
export function Probe() {
  React.useEffect(() => {
    const el = document.querySelector('[data-ag-part="popup"]');
    const ro = new ResizeObserver(() => {});
    if (el) ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return <div data-ag-part="popup" onKeyDown={(e) => e.stopPropagation()} />;
}
