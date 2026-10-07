import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassSignaturePad as GlassSignaturePadComponent } from "./GlassSignaturePad";

const frameStyle: CSSProperties = {
  boxSizing: "border-box",
  maxWidth: "100%",
  minWidth: 0,
  width: "min(352px, calc(100vw - 32px))",
};

const signatureSvg = [
  '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="160" viewBox="0 0 320 160">',
  '<path d="M45 104 C62 68 76 76 66 104 C55 133 104 72 116 78 C129 84 93 123 111 116 C129 110 143 83 153 85 C166 88 143 115 158 112 C178 108 188 79 201 86 C213 93 195 115 213 110 C229 106 243 89 253 91 C262 94 253 108 276 105" fill="none" stroke="#334155" stroke-width="3.1" stroke-linecap="round" stroke-linejoin="round"/>',
  '<path d="M76 128 C128 120 190 121 267 124" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round"/>',
  "</svg>",
].join("");
const signatureValue = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(signatureSvg)}`;

const signatureOptions = {
  backgroundColor: "#f8fafc",
  maxWidth: 3,
  minWidth: 0.8,
  penColor: "#334155",
  throttle: 16,
  velocityFilterWeight: 0.72,
} as const;

const meta = {
  title: "Workflows/Glass Signature Pad",
  component: GlassSignaturePadComponent,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    controls: {
      exclude: ["onChange", "onBegin", "onEnd", "onClear", "onSave"],
    },
    docs: {
      description: {
        component:
          "The real GlassSignaturePad export with a deterministic captured signature, native clear/save states, and a compact neutral liquid-glass frame.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    disabled: false,
    exportFormat: "png",
    exportQuality: 0.9,
    height: 160,
    options: signatureOptions,
    placeholder: "Sign to approve",
    respectMotionPreference: false,
    showClearButton: true,
    showPlaceholder: true,
    showSaveButton: true,
    value: signatureValue,
    width: 320,
  },
} satisfies Meta<typeof GlassSignaturePadComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GlassSignaturePad: Story = {
  name: "GlassSignaturePad",
  render: (args) => (
    <div style={frameStyle}>
      <GlassSignaturePadComponent
        {...args}
        aria-label="Approval signature"
        data-testid="glass-signature-pad-story"
      />
    </div>
  ),
};
