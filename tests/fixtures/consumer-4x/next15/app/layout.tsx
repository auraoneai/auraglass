import type { ReactNode } from "react";
import { StyledComponentsRegistry } from "aura-glass/registry";
import { Providers } from "./providers";
import "./globals.css";

export const metadata = {
  title: "consumer-4x / next15",
  description: "Real App Router consumer of aura-glass 4.x (REQ-PLAT-63).",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <Providers>{children}</Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
