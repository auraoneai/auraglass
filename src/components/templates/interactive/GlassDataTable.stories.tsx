import type { Meta, StoryObj } from "@storybook/react";
import { GlassDataTable } from "./GlassDataTable";
import React from "react";
import { ANIMATION } from "../../../tokens/designConstants";

const meta: Meta<typeof GlassDataTable> = {
  title: 'Workflows/Glass Data Table',
  component: GlassDataTable,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A comprehensive data table component with sorting, filtering, pagination, and loading states.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof GlassDataTable>;

const tableStoryStyles = `
  .ag-data-table-story {
    min-height: 100vh;
    width: 100%;
    overflow: auto;
    box-sizing: border-box;
    background:
      radial-gradient(circle at 16% 12%, rgba(59, 130, 246, 0.24), transparent 30%),
      radial-gradient(circle at 84% 18%, rgba(20, 184, 166, 0.22), transparent 28%),
      linear-gradient(135deg, #0f172a 0%, #1e293b 48%, #0f766e 100%);
    color: #f8fafc;
    padding: clamp(16px, 4vw, 32px);
  }

  .ag-data-table-story h1,
  .ag-data-table-story p,
  .ag-data-table-story .glass-text-secondary {
    color: #f8fafc;
  }

  .ag-data-table-story p {
    opacity: 0.92;
  }

  .ag-data-table-story .mb-6 {
    margin-bottom: 1.5rem;
  }

  .ag-data-table-story table {
    min-width: 760px;
  }

  .ag-data-table-story [data-glass-component] {
    flex-wrap: wrap;
    gap: 12px;
  }

  .ag-data-table-story button {
    color: #0f172a !important;
    background: rgba(255, 255, 255, 0.78) !important;
    border-color: rgba(15, 23, 42, 0.18) !important;
  }

  [data-storybook-preview-mode="dark"] .ag-data-table-story button {
    color: #f8fafc !important;
    background: rgba(15, 23, 42, 0.68) !important;
    border-color: rgba(226, 232, 240, 0.22) !important;
  }

  @media (max-width: 640px) {
    .ag-data-table-story table {
      min-width: 680px;
    }

    .ag-data-table-story [data-glass-component] {
      align-items: flex-start;
      justify-content: flex-start;
    }
  }
`;

const TableStoryFrame = ({
  children,
  maxWidth = 1280,
}: {
  children: React.ReactNode;
  maxWidth?: number;
}) => (
  <div className="ag-data-table-story glass-contrast-guard">
    <style>{tableStoryStyles}</style>
    <div style={{ maxWidth, margin: "0 auto", minWidth: 0 }}>{children}</div>
  </div>
);

// Sample data for the stories
const sampleUsers = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "Admin",
    status: "Active",
    joinDate: "2023-01-15",
    projects: 12,
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    role: "Developer",
    status: "Active",
    joinDate: "2023-03-22",
    projects: 8,
  },
  {
    id: 3,
    name: "Carol Brown",
    email: "carol@example.com",
    role: "Designer",
    status: "Inactive",
    joinDate: "2022-11-08",
    projects: 15,
  },
  {
    id: 4,
    name: "David Wilson",
    email: "david@example.com",
    role: "Manager",
    status: "Active",
    joinDate: "2022-09-12",
    projects: 23,
  },
  {
    id: 5,
    name: "Eva Davis",
    email: "eva@example.com",
    role: "Developer",
    status: "Active",
    joinDate: "2023-05-03",
    projects: 6,
  },
  {
    id: 6,
    name: "Frank Miller",
    email: "frank@example.com",
    role: "Designer",
    status: "Active",
    joinDate: "2023-02-18",
    projects: 11,
  },
  {
    id: 7,
    name: "Grace Lee",
    email: "grace@example.com",
    role: "Developer",
    status: "Inactive",
    joinDate: "2022-12-01",
    projects: 9,
  },
  {
    id: 8,
    name: "Henry Taylor",
    email: "henry@example.com",
    role: "Admin",
    status: "Active",
    joinDate: "2022-10-15",
    projects: 18,
  },
  {
    id: 9,
    name: "Iris Chen",
    email: "iris@example.com",
    role: "Manager",
    status: "Active",
    joinDate: "2023-04-07",
    projects: 14,
  },
  {
    id: 10,
    name: "Jack Anderson",
    email: "jack@example.com",
    role: "Developer",
    status: "Active",
    joinDate: "2023-06-12",
    projects: 4,
  },
  {
    id: 11,
    name: "Kate Wilson",
    email: "kate@example.com",
    role: "Designer",
    status: "Active",
    joinDate: "2023-01-28",
    projects: 7,
  },
  {
    id: 12,
    name: "Liam Garcia",
    email: "liam@example.com",
    role: "Developer",
    status: "Inactive",
    joinDate: "2022-08-14",
    projects: 13,
  },
];

const userColumns = [
  {
    key: "name" as const,
    label: "Name",
    sortable: true,
    width: "200px",
    render: (value: any) => (
      <div className="glass-flex glass-items-center glass-gap-3">
        <div className="glass-w-8 glass-h-8 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-primary glass-text-sm glass-font-medium">
          {String(value).charAt(0)}
        </div>
        <span className="glass-font-medium">{String(value)}</span>
      </div>
    ),
  },
  {
    key: "email" as const,
    label: "Email",
    sortable: true,
    render: (value: any) => (
      <span className="glass-text-primary hover:glass-text-primary">
        {String(value)}
      </span>
    ),
  },
  {
    key: "role" as const,
    label: "Role",
    sortable: true,
    render: (value: any) => {
      const roleColors = {
        Admin: { background: "#fee2e2", color: "#991b1b" },
        Manager: { background: "#f3e8ff", color: "#6b21a8" },
        Developer: { background: "#dbeafe", color: "#1e40af" },
        Designer: { background: "#dcfce7", color: "#166534" },
      };
      const colorStyle = roleColors[value as keyof typeof roleColors] || {
        background: "#f3f4f6",
        color: "#1f2937",
      };
      return (
        <span
          className="glass-radius-full glass-text-xs glass-font-medium"
          style={{ ...colorStyle, display: "inline-block", padding: "4px 8px" }}
        >
          {String(value)}
        </span>
      );
    },
  },
  {
    key: "status" as const,
    label: "Status",
    sortable: true,
    render: (value: any) => (
      <div className="glass-flex glass-items-center glass-gap-2">
        <div
          className="glass-radius-full"
          style={{
            width: 8,
            height: 8,
            background: value === "Active" ? "#22c55e" : "#9ca3af",
            flex: "0 0 auto",
          }}
        />
        <span style={{ color: value === "Active" ? "#86efac" : "#e5e7eb" }}>
          {String(value)}
        </span>
      </div>
    ),
  },
  {
    key: "projects" as const,
    label: "Projects",
    sortable: true,
    render: (value: any) => (
      <div className="glass-flex glass-items-center glass-gap-2">
        <span className="font-mono glass-text-sm">{String(value)}</span>
        <div className="glass-w-16 glass-h-1 glass-surface-subtle glass-radius-full overflow-hidden">
          <div
            className={`glass-h-full glass-surface-blue transition-all duration-[${ANIMATION.DURATION.normal}ms]`}
            style={{ width: `${Math.min(100, (Number(value) / 25) * 100)}%` }}
          />
        </div>
      </div>
    ),
  },
  {
    key: "joinDate" as const,
    label: "Join Date",
    sortable: true,
    render: (value: any) => new Date(String(value)).toLocaleDateString(),
  },
];

export const Default: Story = {
  args: {
    data: sampleUsers,
    columns: userColumns,
    searchable: true,
    paginated: true,
    pageSize: 8,
  },
  render: (args) => (
    <TableStoryFrame>
      <div className="mb-6">
        <h1 className="glass-text-2xl glass-font-bold glass-text-secondary glass-mb-2">
          User Management
        </h1>
        <p className="glass-text-secondary">
          Manage your team members and their roles
        </p>
      </div>
      <GlassDataTable {...args} />
    </TableStoryFrame>
  ),
};

export const LoadingState: Story = {
  args: {
    data: [],
    columns: userColumns,
    loading: true,
    loadingRows: 6,
  },
  render: (args) => (
    <TableStoryFrame>
      <div className="mb-6">
        <h1 className="glass-text-2xl glass-font-bold glass-text-secondary glass-mb-2">
          Loading Data
        </h1>
        <p className="glass-text-secondary">
          Loading skeleton animation while data loads
        </p>
      </div>
      <GlassDataTable {...args} />
    </TableStoryFrame>
  ),
};

export const EmptyState: Story = {
  args: {
    data: [],
    columns: userColumns,
    emptyMessage: "No users found. Try adjusting your search criteria.",
  },
  render: (args) => (
    <TableStoryFrame>
      <div className="mb-6">
        <h1 className="glass-text-2xl glass-font-bold glass-text-secondary glass-mb-2">
          Empty State
        </h1>
        <p className="glass-text-secondary">
          How the table looks when there's no data
        </p>
      </div>
      <GlassDataTable {...args} />
    </TableStoryFrame>
  ),
};

export const SimpleTable: Story = {
  args: {
    data: [
      {
        name: "Task 1",
        priority: "High",
        status: "In Progress",
        assignee: "Alice",
      },
      {
        name: "Task 2",
        priority: "Medium",
        status: "Completed",
        assignee: "Bob",
      },
      { name: "Task 3", priority: "Low", status: "Todo", assignee: "Carol" },
      {
        name: "Task 4",
        priority: "High",
        status: "In Progress",
        assignee: "David",
      },
    ],
    columns: [
      { key: "name", label: "Task Name", sortable: true },
      {
        key: "priority",
        label: "Priority",
        sortable: true,
        render: (value: any) => {
          const colors = {
            High: { background: "#fee2e2", color: "#991b1b" },
            Medium: { background: "#fef3c7", color: "#92400e" },
            Low: { background: "#dcfce7", color: "#166534" },
          };
          const colorStyle = colors[value as keyof typeof colors] || {
            background: "#f3f4f6",
            color: "#1f2937",
          };
          return (
            <span
              className="glass-radius glass-text-sm"
              style={{
                ...colorStyle,
                display: "inline-block",
                padding: "4px 8px",
              }}
            >
              {String(value)}
            </span>
          );
        },
      },
      { key: "status", label: "Status", sortable: true },
      { key: "assignee", label: "Assignee", sortable: true },
    ],
    searchable: false,
    paginated: false,
  },
  render: (args) => (
    <TableStoryFrame maxWidth={896}>
      <div className="mb-6">
        <h1 className="glass-text-2xl glass-font-bold glass-text-secondary glass-mb-2">
          Simple Task List
        </h1>
        <p className="glass-text-secondary">
          Basic table without search or pagination
        </p>
      </div>
      <GlassDataTable {...args} />
    </TableStoryFrame>
  ),
};

export const AllFeatures: Story = {
  args: {
    data: sampleUsers.concat(
      sampleUsers.map((user, i) => ({
        ...user,
        id: user.id + 100,
        name: user.name + " (Copy)",
        email: `copy${i + 1}@example.com`,
      }))
    ),
    columns: userColumns,
    searchable: true,
    paginated: true,
    pageSize: 5,
  },
  render: (args) => (
    <TableStoryFrame>
      <div className="mb-6">
        <h1 className="glass-text-2xl glass-font-bold glass-text-secondary glass-mb-2">
          Complete Data Table
        </h1>
        <p className="glass-text-secondary">
          All features enabled: search, sort, pagination with larger dataset
        </p>
      </div>
      <GlassDataTable {...args} />
    </TableStoryFrame>
  ),
};
