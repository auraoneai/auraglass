/** Exit codes (REQ-PLAT-84): 0 ok, 1 validation/TODOs, 2 usage, 3 safety refusal, 4 network/registry. */

export const EXIT = {
  ok: 0,
  validation: 1,
  usage: 2,
  safety: 3,
  network: 4,
} as const;
export type ExitCode = (typeof EXIT)[keyof typeof EXIT];

export class CliError extends Error {
  constructor(
    message: string,
    public readonly code: ExitCode,
  ) {
    super(message);
    this.name = 'CliError';
  }
}

export const usageError = (m: string) => new CliError(m, EXIT.usage);
export const safetyError = (m: string) => new CliError(m, EXIT.safety);
export const networkError = (m: string) => new CliError(m, EXIT.network);
