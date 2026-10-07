import { useEffect, useRef } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassButton } from "../button/GlassButton";
import {
  GlassToastProvider as ToastProvider,
  GlassToastViewport as ToastViewport,
  useToast,
} from "./GlassToastProvider";

const meta = {
  title: "Data + Visualization/Glass Toast Provider",
  component: ToastProvider,
  parameters: {
    layout: "fullscreen",
    previewSurface: "component",
  },
  args: {
    children: null,
  },
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

const ToastLauncher = ({ seed }: { seed: string }) => {
  const { addToast } = useToast();
  const seeded = useRef(false);

  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    addToast({
      title: "Workspace published",
      description: "Northstar Studio is now available to every collaborator.",
      type: "success",
      duration: 0,
    });
  }, [addToast, seed]);

  return (
    <GlassButton
      type="button"
      onClick={() =>
        addToast({
          title: "Changes saved",
          description: "Your workspace settings are up to date.",
          type: "info",
          duration: 0,
        })
      }
    >
      Show another toast
    </GlassButton>
  );
};

const StoryStage = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      padding: 32,
      boxSizing: "border-box",
    }}
  >
    {children}
  </div>
);

export const GlassToastProvider: Story = {
  name: "GlassToastProvider",
  render: () => (
    <ToastProvider position="bottom-right" duration={0}>
      <StoryStage>
        <ToastLauncher seed="provider" />
      </StoryStage>
    </ToastProvider>
  ),
};

export const GlassToastViewport: Story = {
  name: "GlassToastViewport",
  render: () => (
    <ToastProvider position="bottom-right" duration={0}>
      <StoryStage>
        <ToastLauncher seed="viewport" />
        <ToastViewport position="top-right" />
      </StoryStage>
    </ToastProvider>
  ),
};
