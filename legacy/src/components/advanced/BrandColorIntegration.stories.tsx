import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import BrandColorIntegration, {
  BrandGlassButton,
} from "./BrandColorIntegration";
import { IntelligentColorProvider } from "./IntelligentColorSystem";

const frameStyle: CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  padding: "clamp(20px, 5vw, 64px)",
  boxSizing: "border-box",
  background:
    "radial-gradient(circle at 18% 14%, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0) 34%), linear-gradient(145deg, #f7f7f8 0%, #e4e5e7 58%, #cfd1d4 100%)",
};

const meta = {
  title: "Effects + Advanced/Brand Color Integration",
  component: BrandColorIntegration,
  args: {
    children: null,
  },
  parameters: {
    layout: "fullscreen",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "The real BrandColorIntegration export with neutral liquid material and intentionally restrained brand accents.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof BrandColorIntegration>;

export default meta;
type Story = StoryObj<typeof meta>;

interface BrandSceneProps {
  eyebrow: string;
  title: string;
  entityId?: string;
  brandColors?: string[];
}

function BrandScene({
  eyebrow,
  title,
  entityId,
  brandColors,
}: BrandSceneProps) {
  return (
    <main style={frameStyle}>
      <IntelligentColorProvider>
        <BrandColorIntegration
          entityId={entityId}
          brandColors={brandColors}
          className="glass-foundation-complete glass-w-full glass-max-w-2xl glass-radius-3xl glass-p-8"
        >
          <div className="glass-grid glass-gap-5">
            <div>
              <span className="glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide glass-text-tertiary">
                {eyebrow}
              </span>
              <h2 className="glass-mt-2 glass-text-3xl glass-font-semibold glass-text-primary">
                {title}
              </h2>
              <p className="glass-mt-3 glass-max-w-xl glass-text-secondary glass-leading-relaxed">
                Brand identity is carried by typography and small accents while
                the supporting material remains clear, neutral liquid glass.
              </p>
            </div>
            <div className="glass-flex glass-flex-wrap glass-gap-3">
              <BrandGlassButton>Primary action</BrandGlassButton>
              <BrandGlassButton variant="secondary">
                Secondary action
              </BrandGlassButton>
            </div>
          </div>
        </BrandColorIntegration>
      </IntelligentColorProvider>
    </main>
  );
}

export const BasicIntegration: Story = {
  render: () => (
    <BrandScene
      eyebrow="Brand system"
      title="Identity, without the tint wash"
    />
  ),
};

export const CustomBrandColors: Story = {
  render: () => (
    <BrandScene
      eyebrow="Custom palette"
      title="Controlled accent adaptation"
      brandColors={["#2563eb", "#475569"]}
    />
  ),
};

export const EntityShowcase: Story = {
  render: () => (
    <BrandScene
      eyebrow="Entity palette"
      title="Recognizable, restrained identity"
      entityId="apple"
    />
  ),
};

export const BrandComparison: Story = {
  render: () => (
    <BrandScene
      eyebrow="Material comparison"
      title="One surface, adaptable expression"
      brandColors={["#0f766e", "#334155"]}
    />
  ),
};
