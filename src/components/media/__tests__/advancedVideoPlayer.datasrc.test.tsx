/** PLAT-076: the configured media source is bound to the <video> element —
    nothing is left stranded in a data attribute that never becomes src. */
import React from "react";
import { render } from "@testing-library/react";
import { GlassAdvancedVideoPlayer } from "../GlassAdvancedVideoPlayer";

const media = {
  id: "m1",
  type: "video" as const,
  src: "https://cdn.example.com/real-video.mp4",
  title: "Demo",
};

describe("GlassAdvancedVideoPlayer sources", () => {
  it("binds mediaFile.src onto the video element", () => {
    const { container } = render(
      <GlassAdvancedVideoPlayer mediaFile={media} />
    );
    const video = container.querySelector("video");
    expect(video).not.toBeNull();
    expect(video).toHaveAttribute("src", media.src);
  });

  it("does not rely on data-src that never swaps to src", () => {
    const { container } = render(
      <GlassAdvancedVideoPlayer mediaFile={media} />
    );
    const video = container.querySelector("video");
    expect(video).not.toHaveAttribute("data-src");
    expect(video).not.toHaveAttribute("dataSrc");
  });
});
