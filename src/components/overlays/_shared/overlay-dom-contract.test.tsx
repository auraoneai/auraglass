/* CMP-202 (REQ-CMP-14/-06/-07): attribute-NAME snapshots per subject part —
   data-ag-part, data-open, data-state open|closed; no 4.x glass-* classes and
   no role on wrapper nodes. Snapshots are name-sets, not markup (BU-owned DOM). */
import { describe, expect, it, beforeEach } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, act } from '@testing-library/react';
import * as React from 'react';
import { MOUNTED_SUBJECTS, SEAM_SUBJECTS } from './__tests__/subjects';

const attrNames = (el: Element) => [...el.attributes].map((a) => a.name).sort();

describe('overlay dom contract (CMP-202)', () => {
  beforeEach(() => {
    if (window.PointerEvent === undefined) {
      (window as unknown as Record<string, unknown>).PointerEvent = window.MouseEvent;
    }
  });

  it.each(MOUNTED_SUBJECTS.map((s) => [s.name, s] as const))(
    '%s: popup attribute-name set is stable and contract-shaped',
    async (_name, subject) => {
      render(subject.mount!());
      await act(async () => { await new Promise((r) => setTimeout(r, 20)); });
      const popup = document.querySelector(subject.popupSelector)!;
      const names = attrNames(popup);
      expect(names).toContain('data-ag-part');
      expect(names).toContain('data-ag-layer');
      expect(names).toContain('data-ag-thickness');
      expect(names).toContain('data-ag-overlay');
      expect(names).toContain('data-state');
      expect(popup.getAttribute('data-state')).toBe('open');
      expect(names).toContain('role');
      expect(popup.getAttribute('class')).not.toMatch(/glass-/);
      expect(names.some((n) => n.startsWith('data-glass'))).toBe(false);
      expect(names).toMatchSnapshot();
    },
  );

  it.each(MOUNTED_SUBJECTS.map((s) => [s.name, s] as const))(
    '%s: scrim count follows modality; parts carry data-ag-part',
    async (_name, subject) => {
      render(subject.mount!());
      await act(async () => { await new Promise((r) => setTimeout(r, 20)); });
      const scrims = document.querySelectorAll('[data-ag-part="backdrop"].ag-scrim');
      expect(scrims.length).toBe(subject.modal ? 1 : 0);
      const surface = document.querySelector(subject.popupSelector);
      expect(surface).not.toBeNull();
      const part = subject.popupSelector.match(/\[data-ag-part="(.+?)"\]/)![1];
      expect(surface!.getAttribute('data-ag-part')).toBe(part);
    },
  );

  it('PENDING: seam subjects covered once 3f/3i components land', () => {
    if (SEAM_SUBJECTS.length > 0) {
      throw new Error(`PENDING: dom-contract rows for ${SEAM_SUBJECTS.map((s) => s.name).join(', ')} — components land in lanes 3f/3i`);
    }
  });
});
