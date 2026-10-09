// fixtures.ts — deterministic sample data for account-menu.
import type { AccountMenuItem } from "./index";

export const accountMenuItems: AccountMenuItem[] = [
  { id: "profile", label: "Profile" },
  { id: "billing", label: "Billing" },
  { id: "security", label: "Security" },
  { id: "delete", label: "Delete account", danger: true },
];

export const accountMenuProps = {
  name: "Amara Osei",
  email: "amara@auraone.ai",
  items: accountMenuItems,
};
