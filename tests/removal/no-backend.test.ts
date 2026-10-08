/* @jest-environment node */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';

// PLAT-227 / REQ-PLAT-82: after RM-01, `next` carries no backend surface.
// Already true for dependencies at C0 — this test pins it so a regression
// re-adding a server artifact fails immediately.
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const tracked = execFileSync('git', ['ls-files'], { encoding: 'utf8' }).split('\n').filter(Boolean);

const BACKEND_PKGS = /^(express|fastify|koa|hapi|@?nestjs|socket\.io|ws|jsonwebtoken|jose|bcrypt|passport|ioredis|bullmq|bull|pg|mysql|mongodb|mongoose|prisma|@prisma)/i;

describe('no backend on next (PLAT-227)', () => {
  it('no backend package in any dependency field', () => {
    for (const field of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'])
      for (const dep of Object.keys(pkg[field] ?? {}))
        expect(BACKEND_PKGS.test(dep)).toBe(false);
  });
  it('no build:server, hosted or docker:* scripts', () => {
    for (const s of Object.keys(pkg.scripts ?? {}))
      expect(s).not.toMatch(/^(build:server|hosted.*|docker:)/);
    expect(JSON.stringify(pkg.scripts ?? {})).not.toMatch(/docker (build|compose|run)/);
  });
  it('no server/, Dockerfile, docker-compose*, nginx.conf, workers/, bin/ tracked', () => {
    const banned = tracked.filter((f) =>
      /^server\//.test(f) || f === 'Dockerfile' || /^docker-compose/.test(f)
      || f === 'nginx.conf' || /^workers\//.test(f) || /^bin\//.test(f));
    expect(banned).toEqual([]);
  });
  it('no aura-glass/services specifier anywhere in src', () => {
    let out = '';
    try {
      out = execFileSync('rg', ['-l', String.raw`aura-glass/(services|server|api)`, 'src/'],
        { encoding: 'utf8' });
    } catch { out = ''; }
    expect(out.trim()).toBe('');
  });
});
