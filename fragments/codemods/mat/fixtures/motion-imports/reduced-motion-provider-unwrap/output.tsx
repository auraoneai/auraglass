import { MotionPreferenceProvider } from "aura-glass";

export function App({ children }: { children: React.ReactNode }) {
  return (
    <MotionPreferenceProvider>{children}</MotionPreferenceProvider>
  );
}
