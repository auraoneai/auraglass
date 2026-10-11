'use client';
import { useLayoutEffect } from 'react';
import { useImageViewer } from '../ivContext';
import { chromeClass, chromeMaterial } from '../chrome';

/** Caption — chrome material (clear). While mounted with text, its id is the
 * popup's aria-labelledby target (REQ-SURF-142). */
export function Caption() {
  const c = useImageViewer('Caption');
  const id = `${c.popupId}-caption`;
  const text = c.current?.caption;
  const { setCaptionId } = c;
  useLayoutEffect(() => {
    if (!text) return undefined;
    setCaptionId(id);
    return () => setCaptionId(null);
  }, [id, text, setCaptionId]);
  if (!text) return null;
  return (
    <div {...chromeMaterial} id={id} data-ag-part="image-viewer-caption" className={chromeClass('ag-image-viewer-caption')}>
      {text}
    </div>
  );
}
