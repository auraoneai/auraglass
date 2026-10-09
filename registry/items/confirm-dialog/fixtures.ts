// fixtures.ts — deterministic sample data for confirm-dialog.

export const confirmNeutralProps = {
  title: "Discard draft?",
  description: "Your unsaved changes will be lost. This cannot be undone.",
  confirmLabel: "Discard",
  cancelLabel: "Keep editing",
};

export const confirmDestructiveProps = {
  variant: "destructive" as const,
  title: "Delete project?",
  description: "All 14 files and 3 environments will be permanently removed.",
  confirmLabel: "Delete project",
  cancelLabel: "Cancel",
};
