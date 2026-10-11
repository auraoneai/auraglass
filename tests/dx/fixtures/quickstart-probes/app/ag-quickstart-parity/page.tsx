/* Quickstart parity probe (REQ-PLAT-103, next-tailwind cell only). Test
   instrumentation that tests/dx/quickstart.spec.ts writes into the scaffolded
   app before the run step (not a quickstart step): an element styled only
   with the Tailwind bridge utility `glass-regular` next to a Surface carrying
   [data-ag-variant="regular"]; the spec asserts both compute the same
   backdrop-filter. */
import { Environment, Surface } from 'aura-glass';

export default function QuickstartParity() {
  return (
    <Environment backdrop="light">
      <div style={{ display: 'grid', gap: 24, padding: 24 }}>
        <div data-qs-probe="tailwind" className="glass-regular" style={{ padding: 16 }}>
          glass-regular
        </div>
        <Surface data-qs-probe="material" layer="content" variant="regular" style={{ padding: 16 }}>
          data-ag-variant=regular
        </Surface>
      </div>
    </Environment>
  );
}
