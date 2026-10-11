/* permissions-matrix fixtures — deterministic values only (5.2 block). */
export const ROLES = ['Owner', 'Admin', 'Editor', 'Viewer'] as const;
export const PERMISSIONS = [
  { id: 'project.read', label: 'Read project', description: 'View projects and their content' },
  { id: 'project.write', label: 'Edit project', description: 'Change project settings and content' },
  { id: 'billing.manage', label: 'Manage billing', description: 'Invoices, plans and payment methods' },
  { id: 'members.invite', label: 'Invite members', description: 'Send invitations and assign roles' },
] as const;

export const GRANTS: Record<string, string[]> = {
  Owner: ['project.read', 'project.write', 'billing.manage', 'members.invite'],
  Admin: ['project.read', 'project.write', 'members.invite'],
  Editor: ['project.read', 'project.write'],
  Viewer: ['project.read'],
};
