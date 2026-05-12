"use client";

import React, { forwardRef, useMemo, useState } from "react";
import { cn } from "../../lib/utils";
import "./marketing.css";

export interface InstallCommandProps
  extends React.HTMLAttributes<HTMLDivElement> {
  command?: string;
  packageManager?: "npm" | "pnpm" | "yarn" | "bun";
  copyable?: boolean;
  copiedLabel?: string;
}

const packageCommands: Record<
  NonNullable<InstallCommandProps["packageManager"]>,
  string
> = {
  npm: "npm install aura-glass",
  pnpm: "pnpm add aura-glass",
  yarn: "yarn add aura-glass",
  bun: "bun add aura-glass",
};

export const InstallCommand = forwardRef<HTMLDivElement, InstallCommandProps>(
  (
    {
      command,
      packageManager = "npm",
      copyable = true,
      copiedLabel = "Copied",
      className,
      ...props
    },
    ref
  ) => {
    const [copied, setCopied] = useState(false);
    const resolvedCommand = useMemo(
      () => command ?? packageCommands[packageManager],
      [command, packageManager]
    );

    const handleCopy = async () => {
      if (
        !copyable ||
        typeof navigator === "undefined" ||
        !navigator.clipboard?.writeText
      ) {
        return;
      }

      await navigator.clipboard.writeText(resolvedCommand);
      setCopied(true);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "ag-marketing-scope ag-showcase-card ag-install-command",
          className
        )}
        data-highlight="true"
        data-intensity="medium"
        data-padding="sm"
        data-radius="lg"
        {...props}
      >
        <code className="ag-install-command__code">{resolvedCommand}</code>
        {copyable && (
          <button
            type="button"
            className="ag-install-command__button"
            aria-label={copied ? copiedLabel : "Copy install command"}
            onClick={handleCopy}
          >
            {copied ? copiedLabel : "Copy"}
          </button>
        )}
        <span
          className="ag-install-command__status"
          role="status"
          aria-live="polite"
        >
          {copied ? copiedLabel : ""}
        </span>
      </div>
    );
  }
);

InstallCommand.displayName = "InstallCommand";
