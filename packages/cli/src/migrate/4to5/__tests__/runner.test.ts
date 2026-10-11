/** migrate 4to5 runner: file walking, kind detection, gitignore respect. */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { walkFiles } from '../index.js';
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'agwalk-'));
describe('walkFiles', () => {
  it('finds code/css/json, skips node_modules + dist', () => {
    const dir = tmp();
    fs.mkdirSync(path.join(dir, 'src'), { recursive: true });
    fs.mkdirSync(path.join(dir, 'node_modules', 'x'), { recursive: true });
    fs.mkdirSync(path.join(dir, 'dist'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'src', 'a.tsx'), 'x');
    fs.writeFileSync(path.join(dir, 'a.css'), 'x');
    fs.writeFileSync(path.join(dir, 'package.json'), '{}');
    fs.writeFileSync(path.join(dir, 'node_modules', 'x', 'b.tsx'), 'x');
    fs.writeFileSync(path.join(dir, 'dist', 'c.tsx'), 'x');
    const files = walkFiles(dir).map((p) => path.relative(dir, p).split(path.sep).join('/')).sort();
    expect(files).toEqual(['a.css', 'package.json', 'src/a.tsx'].sort());
  });
});
