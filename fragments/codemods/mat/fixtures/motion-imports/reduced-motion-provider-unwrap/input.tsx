import { ReducedMotionProvider, MotionPreferenceProvider } from "aura-glass";

export function App({ children }: { children: React.ReactNode }) {
  return (
    <ReducedMotionProvider>
      <MotionPreferenceProvider>{children}</MotionPreferenceProvider>
    </ReducedMotionProvider>
  );
}
