/* CMP-318: FileUpload — generated for lane 3g (T0/T2 components). */
import { describe, expect, it } from '@jest/globals';
import { fireEvent, render, screen, act } from '@testing-library/react';
import * as React from 'react';
import { FileUpload } from './index';

const file = (name: string, size: number, type: string) => new File([new Uint8Array(size)], name, { type });

describe('FileUpload', () => {
  it('renders dropzone + hidden input + list parts', () => {
    const { container } = render(<FileUpload defaultItems={[{ file: file('a.png', 1, 'image/png'), status: 'idle' }]} />);
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
    const uploader = (f: File, signal: AbortSignal) => new Promise<void>((_res, rej) => {
      signal.addEventListener('abort', () => { aborted.push(f.name); rej(new DOMException('aborted', 'AbortError')); });
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
    expect(item?.getAttribute('data-ag-status')).not.toBe('complete');
  });
});
