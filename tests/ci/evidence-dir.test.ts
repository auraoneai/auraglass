/* REQ-PLAT-37/51: evidenceDir() honours AURAGLASS_EVIDENCE_DIR, defaults to
   <root>/.artifacts, creates the directory; no scripts/** writer still targets
   a literal reports/ path. */
import { existsSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const root = join(__dirname, '..', '..');
const { evidenceDir } = require(join(root, 'scripts/ci/lib/evidence-dir.js'));

describe('evidenceDir', () => {
  afterEach(() => {
    delete process.env.AURAGLASS_EVIDENCE_DIR;
  });

  it('defaults to <root>/.artifacts and creates it', () => {
    const dir = evidenceDir('integration');
    expect(dir).toBe(join(root, '.artifacts', 'integration'));
    expect(existsSync(dir)).toBe(true);
  });

  it('honours AURAGLASS_EVIDENCE_DIR and accepts subdirectories', () => {
    const custom = join(root, '.artifacts-test-custom');
    process.env.AURAGLASS_EVIDENCE_DIR = custom;
    const dir = evidenceDir('a/b');
    expect(dir).toBe(join(custom, 'a', 'b'));
    expect(existsSync(dir)).toBe(true);
    rmSync(custom, { recursive: true, force: true });
  });

  it('no scripts/** write/mkdir call carries a literal reports/ segment', () => {
    const hits: string[] = [];
    const writeCalls = /(?:writeFileSync|appendFileSync|createWriteStream|mkdirSync|copyFileSync)\s*\([^)]*reports[\\/]/;
    const walk = (dir: string) => {
      for (const e of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, e.name);
        if (e.isDirectory()) walk(p);
        else if (/\.(js|mjs|cjs)$/.test(e.name) && writeCalls.test(readFileSync(p, 'utf8'))) {
          hits.push(p.slice(root.length + 1));
        }
      }
    };
    walk(join(root, 'scripts'));
    expect(hits).toEqual([]);
  });
});
