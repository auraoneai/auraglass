#!/usr/bin/env node
/** @auraglass/cli bin router (PLAT-301). Exit codes 0/1/2/3/4 per REQ-PLAT-84. */
import { parseArgs } from './cli/args.js';
import { CliError, EXIT, usageError } from './cli/errors.js';
import { PACKAGE_VERSION, PACKAGE_NAME } from './meta.js';

const USAGE = `${PACKAGE_NAME} ${PACKAGE_VERSION}
Usage: auraglass <command> [flags]

Commands:
  init                  Set up aura-glass in this project
  add <name>            Install a registry item
  diff <name>           Diff installed files against upstream
  update <name>         Update installed registry files
  doctor [--v5]         Environment + migration-readiness checks
  audit <deps|imports|backdrop>  Dependency/import/backdrop audits
  migrate <4to5|icons|radix|mui> Codemods (4to5 default)
  list [filter]         List registry items
  info <name>           Show a registry item

Flags (all commands): --cwd <dir> --json --yes --silent
Safety: --allow-dirty --allow-no-git   Run: --dry-run --transform <ids> --allow-todo
Exit codes: 0 ok · 1 validation/TODOs · 2 usage · 3 safety refusal · 4 network/registry
`;

async function main(): Promise<number> {
  const argv = process.argv.slice(2);
  if (argv.includes('--version') || argv[0] === 'version') {
    process.stdout.write(`${PACKAGE_VERSION}\n`);
    return EXIT.ok;
  }
  if (argv.includes('--help') || argv.includes('-h') || argv[0] === 'help') {
    process.stdout.write(USAGE);
    return EXIT.ok;
  }
  const [cmd, ...rest] = argv;
  const { args, flags } = parseArgs(rest);
  switch (cmd) {
    case 'init': {
      const { initCommand } = await import('./commands/init.js');
      return initCommand(args, flags);
    }
    case 'add': {
      const { addCommand } = await import('./commands/add.js');
      return addCommand(args, flags);
    }
    case 'diff': {
      const { diffCommand } = await import('./commands/diff.js');
      return diffCommand(args, flags);
    }
    case 'update': {
      const { updateCommand } = await import('./commands/update.js');
      return updateCommand(args, flags);
    }
    case 'doctor': {
      const { doctorCommand } = await import('./commands/doctor.js');
      return doctorCommand(args, flags);
    }
    case 'audit': {
      const { auditCommand } = await import('./commands/audit.js');
      return auditCommand(args, flags);
    }
    case 'migrate': {
      const { migrateCommand } = await import('./commands/migrate.js');
      return migrateCommand(args, flags);
    }
    case 'list': {
      const { listCommand } = await import('./commands/list-info.js');
      return listCommand(args, flags);
    }
    case 'info': {
      const { infoCommand } = await import('./commands/list-info.js');
      return infoCommand(args, flags);
    }
    case undefined:
      process.stdout.write(USAGE);
      return EXIT.usage;
    default:
      throw usageError(`unknown command: ${cmd}\n\n${USAGE}`);
  }
}

main()
  .then((code) => { process.exitCode = code; })
  .catch((e: unknown) => {
    if (e instanceof CliError) {
      process.stderr.write(`${e.message}\n`);
      process.exitCode = e.code;
      return;
    }
    process.stderr.write(`${e instanceof Error ? e.message : String(e)}\n`);
    process.exitCode = EXIT.validation;
  });
