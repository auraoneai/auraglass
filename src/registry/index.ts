"use client";
/**
 * Styled Components Registry Export
 *
 * CRITICAL: Import StyledComponentsRegistry from THIS path, not from 'aura-glass/styled'
 *
 * Why this separate export path exists:
 * - The 'aura-glass/styled' barrel export includes ALL styled-components
 * - When Next.js loads app/layout.tsx during build, it executes all imports
 * - Those imports include `import styled from 'styled-components'` which crashes
 * - This standalone export ONLY includes the registry, no styled-components imports
 *
 * REQUIRED SETUP FOR NEXT.JS APP ROUTER:
 *
 * 1. Install styled-components:
 *    ```bash
 *    npm install styled-components
 *    ```
 *
 * 2. Wrap your app with StyledComponentsRegistry in app/layout.tsx:
 *    ```tsx
 *    import { StyledComponentsRegistry } from 'aura-glass/registry';  // ← Use /registry, NOT /styled!
 *
 *    export default function RootLayout({ children }: { children: React.ReactNode }) {
 *      return (
 *        <html lang="en">
 *          <body>
 *            <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
 *          </body>
 *        </html>
 *      );
 *    }
 *    ```
 *
 * This prevents "Cannot read properties of null (reading 'useState')" or
 * "Cannot read properties of null (reading 'useContext')" errors during
 * Next.js build-time static analysis.
 */

export { StyledComponentsRegistry } from "../styled/StyledComponentsRegistry";
