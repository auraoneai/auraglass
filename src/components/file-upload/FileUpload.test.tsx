/* CMP-318: FileUpload — generated for lane 3g (T0/T2 components). */
import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen, act } from '@testing-library/react';
import * as React from 'react';
import { FileUpload } from './index';
import type { FileUploadChangeDetails, FileUploadItem } from './FileUpload.client';
import { AuraGlassProvider } from '../../theme';

const file = (name: string, size: number, type: string) => new File([new Uint8Array(size)], name, { type });

describe('FileUpload', () => {
  it('renders dropzone + hidden input + list parts', () => {
    const { container } = render(<FileUpload defaultItems={[{ file: file('a.png', 1, 'image/png'), status: 'selected' }]} />);
    for (const p of ['root', 'dropzone', 'input', 'list']) {
      expect(container.querySelector(`[data-ag-part="${p}"]`)).not.toBeNull();
    }
    expect((container.querySelector('[data-ag-part="input"]') as HTMLInputElement).type).toBe('file');
  });
  it('rejects by accept type', () => {
    const rejected: File[] = [];
    const { container } = render(<FileUpload accept="image/*" onFilesRejected={(r) => rejected.push(...r.map((x) => x.file))} />);
    const input = container.querySelector('[data-ag-part="input"]')! as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file('a.txt', 10, 'text/plain')] } });
    expect(rejected.length).toBe(1);
  });
  it('rejects by maxSize', () => {
    const rejected: File[] = [];
    const { container } = render(<FileUpload maxSize={5} onFilesRejected={(r) => rejected.push(...r.map((x) => x.file))} />);
    fireEvent.change(container.querySelector('[data-ag-part="input"]')!, { target: { files: [file('big.bin', 100, 'application/octet-stream')] } });
    expect(rejected.length).toBe(1);
  });
  it('rejects by maxCount', () => {
    const rejected: File[] = [];
    const { container } = render(<FileUpload maxCount={1} onFilesRejected={(r) => rejected.push(...r.map((x) => x.file))} />);
    fireEvent.change(container.querySelector('[data-ag-part="input"]')!, {
      target: { files: [file('a.png', 1, 'image/png'), file('b.png', 1, 'image/png')] },
    });
    expect(rejected.length).toBeGreaterThan(0);
  });
  it('remove aborts the in-flight upload', async () => {
    const aborted: string[] = [];
    const uploader = (f: File, ctx: { signal: AbortSignal }) => new Promise<void>((_res, rej) => {
      ctx.signal.addEventListener('abort', () => { aborted.push(f.name); rej(new DOMException('aborted', 'AbortError')); });
    });
    const { container } = render(<FileUpload onUpload={uploader} />);
    fireEvent.change(container.querySelector('[data-ag-part="input"]')!, {
      target: { files: [file('x.png', 1, 'image/png')] },
    });
    await act(async () => {});
    const btn = screen.getByRole('button', { name: /remove/i });
    fireEvent.click(btn);
    await act(async () => {});
    expect(aborted).toContain('x.png');
  });
  it('without onUpload items never reach a fake-complete state', async () => {
    render(<FileUpload defaultItems={[{ file: file('y.png', 1, 'image/png'), status: 'uploading' }]} />);
    await act(async () => {});
    const item = document.querySelector('[data-ag-part="item"]');
    expect(item?.getAttribute('data-status')).not.toBe('complete');
  });
});

describe('FileUpload REQ-CMP-126', () => {
  it('onValueChange carries reason + rejections; errors render via Field.Error linked by aria-describedby', () => {
    const seen: { reason: string; n?: number | undefined }[] = [];
    const { container } = render(
      <FileUpload accept="image/*" onValueChange={(_items, d) => seen.push({ reason: d.reason, n: d.rejections?.length })} />,
    );
    fireEvent.change(container.querySelector('[data-ag-part="input"]')!, {
      target: { files: [file('a.txt', 10, 'text/plain')] },
    });
    expect(seen.some((s) => s.reason === 'reject' && s.n === 1)).toBe(true);
    const dropzone = container.querySelector('[data-ag-part="dropzone"]')!;
    const errId = dropzone.getAttribute('aria-describedby');
    expect(errId).toBeTruthy();
    expect(container.querySelector(`#${CSS.escape(errId!)}`)).not.toBeNull();
  });

  it('dropzone carries content-sunken material', () => {
    const { container } = render(<FileUpload />);
    expect(container.querySelector('[data-ag-part="dropzone"]')!.getAttribute('data-ag-content')).toBe('content-sunken');
  });

  it('onProgress drives item.progress; completion flips status', async () => {
    let report: ((p: number) => void) | null = null;
    const uploader = (_f: File, ctx: { signal: AbortSignal; onProgress: (p: number) => void }) =>
      new Promise<void>((res) => { report = (p) => { ctx.onProgress(p); if (p >= 1) res(); }; });
    const { container } = render(<FileUpload onUpload={uploader} />);
    fireEvent.change(container.querySelector('[data-ag-part="input"]')!, {
      target: { files: [file('x.png', 1, 'image/png')] },
    });
    await act(async () => { report!(0.5); });
    await act(async () => { report!(1); });
    const item = container.querySelector('[data-ag-part="item"]')!;
    expect(item.getAttribute('data-status')).toBe('complete');
  });

  it('no onUpload → never complete', async () => {
    jest.useFakeTimers();
    try {
      const { container } = render(<FileUpload />);
      fireEvent.change(container.querySelector('[data-ag-part="input"]')!, {
        target: { files: [file('chosen.png', 1, 'image/png')] },
      });
      await act(async () => { jest.advanceTimersByTime(60_000); });
      const items = container.querySelectorAll('[data-ag-part="item"]');
      expect(items).toHaveLength(1);
      expect(items[0]!.getAttribute('data-status')).toBe('selected');
      expect(items[0]!.hasAttribute('data-progress')).toBe(false);
    } finally {
      jest.useRealTimers();
    }
  });

  it('dropped and chosen files fire the same onValueChange(items, details) shape', () => {
    const calls: Array<{ via: string; items: FileUploadItem[]; details: FileUploadChangeDetails }> = [];
    let via = '';
    const { container } = render(
      <FileUpload multiple onValueChange={(items, details) => calls.push({ via, items, details })} />,
    );
    const chosen = file('chosen.png', 3, 'image/png');
    const dropped = file('dropped.png', 4, 'image/png');
    via = 'input';
    fireEvent.change(container.querySelector('[data-ag-part="input"]')!, { target: { files: [chosen] } });
    via = 'drop';
    fireEvent.drop(container.querySelector('[data-ag-part="root"]')!, { dataTransfer: { files: [dropped] } });
    const byInput = calls.find((c) => c.via === 'input')!;
    const byDrop = calls.find((c) => c.via === 'drop')!;
    expect(byInput.details).toEqual({ reason: 'accept' });
    expect(byDrop.details).toEqual({ reason: 'accept' });
    expect(byInput.items.map((i) => [i.file.name, i.status])).toEqual([['chosen.png', 'selected']]);
    expect(byDrop.items.map((i) => [i.file.name, i.status])).toEqual([['chosen.png', 'selected'], ['dropped.png', 'selected']]);
    // Same keys on every item regardless of the path that admitted it.
    expect(Object.keys(byDrop.items[1]!).sort()).toEqual(Object.keys(byInput.items[0]!).sort());
  });

  it('a rejection is announced through the S-26 announcer', async () => {
    render(
      <AuraGlassProvider>
        <FileUpload accept="image/*" />
      </AuraGlassProvider>,
    );
    await act(async () => {});
    fireEvent.change(document.querySelector('[data-ag-part="input"]')!, {
      target: { files: [file('notes.txt', 10, 'text/plain')] },
    });
    await act(async () => {});
    const polite = document.querySelector('[data-ag-announcer] [aria-live="polite"]');
    expect(polite).not.toBeNull();
    expect(polite!.textContent).toBe('1 file rejected: notes.txt (type)');
    // The visible error is the dropzone's description.
    const dropzone = document.querySelector('[data-ag-part="dropzone"]')!;
    const err = document.getElementById(dropzone.getAttribute('aria-describedby')!);
    expect(err?.textContent).toBe('notes.txt: type');
  });
});
