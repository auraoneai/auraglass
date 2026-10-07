import type { Meta, StoryObj } from "@storybook/react";

import {
  MultiUserGlassEditor,
  type CollaborationParticipant,
} from "./MultiUserGlassEditor";

const participants: CollaborationParticipant[] = [
  { id: "ana", name: "Ana", presence: "active" },
  { id: "bo", name: "Bo", presence: "idle" },
  { id: "cy", name: "Cy", presence: "offline" },
];

const meta = {
  title: "Workflows/Collaboration/Multi User Glass Editor",
  component: MultiUserGlassEditor,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Direct coverage of the collaborative editor, participant presence, synchronization label, and editable content surface.",
      },
    },
  },
  args: {
    users: participants,
    header: "Launch brief",
    defaultValue:
      "The launch brief is ready for a final product, design, and accessibility review.",
    contained: true,
    maxWidth: 620,
    maxHeight: 420,
    "aria-label": "Collaborative launch brief",
  },
} satisfies Meta<typeof MultiUserGlassEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
