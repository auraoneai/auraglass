import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassKanbanBoard, type KanbanColumn } from "./GlassKanbanBoard";

const initialColumns: KanbanColumn[] = [
  {
    id: "backlog",
    title: "Backlog",
    description: "Ready for triage",
    color: "#64748b",
    limit: 5,
    cards: [
      {
        id: "card-1",
        title: "Audit empty states",
        description: "Replace generated fallbacks with product-like examples.",
        priority: "high",
        tags: ["storybook", "quality"],
        assignee: { id: "mira", name: "Mira" },
        dueDate: new Date("2026-05-08"),
      },
      {
        id: "card-2",
        title: "Tighten filter chips",
        description: "Verify removable and selected states in dark mode.",
        priority: "medium",
        tags: ["forms"],
        assignee: { id: "kai", name: "Kai" },
      },
    ],
  },
  {
    id: "progress",
    title: "In progress",
    description: "Owned this sprint",
    color: "#2563eb",
    limit: 4,
    cards: [
      {
        id: "card-3",
        title: "Build modal previews",
        description: "Show overlays open with realistic task copy.",
        priority: "urgent",
        tags: ["modal", "a11y"],
        assignee: { id: "rio", name: "Rio" },
        dueDate: new Date("2026-05-07"),
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    description: "Ready for visual review",
    color: "#14b8a6",
    cards: [
      {
        id: "card-4",
        title: "Normalize story surfaces",
        description: "Add component/app previewSurface parameters.",
        priority: "low",
        tags: ["storybook"],
        assignee: { id: "ana", name: "Ana" },
      },
    ],
  },
];

const KanbanStory = (args: React.ComponentProps<typeof GlassKanbanBoard>) => {
  const [columns, setColumns] = useState(args.columns ?? initialColumns);

  return (
    <div style={{ width: "min(1180px, calc(100vw - 64px))" }}>
      <GlassKanbanBoard
        {...args}
        columns={columns}
        onCardMove={(cardId, fromColumn, toColumn, position) => {
          setColumns((current) => {
            const next = current.map((column) => ({
              ...column,
              cards: [...column.cards],
            }));
            const source = next.find((column) => column.id === fromColumn);
            const target = next.find((column) => column.id === toColumn);
            const card = source?.cards.find((item) => item.id === cardId);
            if (!source || !target || !card) return current;
            source.cards = source.cards.filter((item) => item.id !== cardId);
            target.cards.splice(position, 0, card);
            return next;
          });
        }}
      />
    </div>
  );
};

const meta: Meta<typeof GlassKanbanBoard> = {
  title: 'Data + Visualization/Glass Kanban Board',
  component: GlassKanbanBoard,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "A glass kanban board for task pipelines with priorities, tags, assignees, and drag movement.",
      },
    },
  },
  args: {
    columns: initialColumns,
    title: "Story quality sprint",
    description: "Track Storybook presentation fixes across core UI lanes.",
    columnWidth: 330,
    maxHeight: 620,
    cardSize: "md",
    showAddCard: true,
    showAddColumn: false,
  },
};

export default meta;
type Story = StoryObj<typeof GlassKanbanBoard>;

export const Default: Story = {
  render: (args) => <KanbanStory {...args} />,
};

export const CompactCards: Story = {
  args: {
    cardSize: "sm",
    columnWidth: 290,
    maxHeight: 460,
  },
  render: (args) => <KanbanStory {...args} />,
};
