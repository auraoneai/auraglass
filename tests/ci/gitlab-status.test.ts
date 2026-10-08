/* @jest-environment node */
// PLAT-019/020: gitlab-status.mjs against recorded API fixtures. The mock API
// runs in a child process (sync exec in the test would starve an in-process
// server).
import { describe, expect, it } from '@jest/globals';
import { execFileSync, spawn, type ChildProcess } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const FIX = 'tests/ci/fixtures/gitlab-api';
const SCRIPT = 'scripts/ci/gitlab-status.mjs';

// helper: serves the fixture body on :0, prints the port on stdout
function startApi(fixturePath: string): Promise<{ port: number; child: ChildProcess }> {
  return new Promise((resolve) => {
    const child = spawn(
      process.execPath,
      [
        '-e',
        `const f=JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'));
         require('http').createServer((q,r)=>{
           r.setHeader('content-type','application/json');
           if(q.url.includes('/pipelines')&&q.url.includes('/jobs')) r.end(JSON.stringify(f.jobs??[]));
           else if(q.url.includes('/pipelines')) r.end(JSON.stringify(f.pipelines));
           else{r.statusCode=404;r.end('{}')}
         }).listen(0,'127.0.0.1',function(){console.log(this.address().port)});`,
        fixturePath,
      ],
      { stdio: ['ignore', 'pipe', 'ignore'] },
    );
    let buf = '';
    child.stdout!.on('data', (d) => {
      buf += d;
      const port = parseInt(buf.trim(), 10);
      if (port) resolve({ port, child });
    });
  });
}

function run(base: string): { code: number; out: string } {
  try {
    const out = execFileSync('node', [SCRIPT, '--sha', 'sha-under-test', '--api-base', base], {
      encoding: 'utf8',
      env: { ...process.env, CI: '', GITLAB_CI: '' },
    });
    return { code: 0, out };
  } catch (e: any) {
    return { code: e.status ?? 1, out: `${e.stdout ?? ''}${e.stderr ?? ''}` };
  }
}

describe('gitlab-status.mjs', () => {
  it.each(readdirSync(FIX).filter((f) => f.endsWith('.json')))('fixture %s', async (file) => {
    const fixture = JSON.parse(readFileSync(join(FIX, file), 'utf8'));
    const want = fixture.expect;
    const { port, child } = await startApi(join(process.cwd(), FIX, file));
    try {
      const r = run(`http://127.0.0.1:${port}`);
      expect(r.code).toBe(want.code);
      for (const s of want.contains ?? []) expect(r.out).toContain(s);
    } finally {
      child.kill();
    }
  }, 30000);
});
