/** Output discipline: status words always printed; colour only on a TTY without NO_COLOR (REQ-PLAT-84, §15.9). */

import pc from 'picocolors';

export function colorEnabled(stream: NodeJS.WriteStream = process.stdout): boolean {
  if (process.env.NO_COLOR !== undefined) return false;
  return Boolean(stream.isTTY);
}

export function paint(enabled: boolean): typeof pc {
  if (enabled) return pc;
  const identity = new Proxy(pc, {
    get: () => (s: unknown) => String(s),
  });
  return identity as typeof pc;
}

export interface Out {
  json: boolean;
  silent: boolean;
  color: boolean;
}

export function makeOut(flags: Record<string, string | boolean>): Out {
  return {
    json: Boolean(flags.json),
    silent: Boolean(flags.silent),
    color: colorEnabled(),
  };
}

export function printJson(value: unknown): void {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

export function status(out: Out, word: 'pass' | 'info' | 'warn' | 'fail' | 'ok', message: string): void {
  if (out.silent) return;
  const c = paint(out.color);
  const colored =
    word === 'pass' || word === 'ok' ? c.green(word) : word === 'info' ? c.blue(word) : word === 'warn' ? c.yellow(word) : c.red(word);
  process.stdout.write(`${word.toUpperCase().padEnd(7)} ${message}\n`);
  void colored;
}
