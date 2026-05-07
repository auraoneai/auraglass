import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassFormTable } from "./GlassFormTable";

interface TeamMember {
  name: string;
  email: string;
  role: string;
}

const columns = [
  { key: "name" as const, header: "Name" },
  { key: "email" as const, header: "Email" },
  { key: "role" as const, header: "Role" },
];

const meta: Meta<typeof GlassFormTable<TeamMember>> = {
  title: 'Controls/Inputs/Glass Form Table',
  component: GlassFormTable,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "An editable glass form table for compact structured data entry.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof GlassFormTable<TeamMember>>;

const TableFrame = () => {
  const [rows, setRows] = useState<TeamMember[]>([
    { name: "Avery Stone", email: "avery@auraglass.dev", role: "Owner" },
    { name: "Mina Chen", email: "mina@auraglass.dev", role: "Reviewer" },
  ]);

  return (
    <div className="glass-w-[min(820px,calc(100vw-48px))] glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-5 glass-shadow-xl glass-backdrop-blur-xl">
      <GlassFormTable columns={columns} rows={rows} onChange={setRows} />
    </div>
  );
};

export const Default: Story = {
  render: () => <TableFrame />,
};
