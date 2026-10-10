/**
 * REQ-PLAT-47 runtime expectation for the react19 legs.
 *
 * The GitLab `plat:test:react19` matrix sets AG_REACT19_LEG and installs
 * react@19/react-dom@19 with --no-save, so a leg run must be on React 19.
 * A plain `jest` run (no AG_REACT19_LEG) runs on the repo's pinned
 * devDependency major. Either way the running major is asserted exactly.
 */
import { readFileSync } from 'fs';
import { join } from 'path';

export function expectedReactMajor(): number {
  if (process.env.AG_REACT19_LEG) return 19;
  const pkg = JSON.parse(readFileSync(join(__dirname, '..', '..', 'package.json'), 'utf8')) as {
    devDependencies?: Record<string, string>;
  };
  const pinned = pkg.devDependencies?.react ?? '';
  const major = parseInt(pinned.replace(/^[^\d]*/, ''), 10);
  if (Number.isNaN(major)) {
    throw new Error(`cannot read devDependencies.react major from package.json (${pinned})`);
  }
  return major;
}
