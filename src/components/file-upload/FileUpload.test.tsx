/* CMP-318: FileUpload — generated for lane 3g (T0/T2 components). */
import { describe, expect, it } from '@jest/globals';
import { fireEvent, render, screen, act } from '@testing-library/react';
import * as React from 'react';
import { FileUpload } from './index';

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
    const seen: { reason: string; n?: number }[] = [];
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
});
