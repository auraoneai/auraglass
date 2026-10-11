// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Accordion } from 'aura-glass';

// TODO(aura-glass 5): 4.x accordions were role="tablist"; 5.0 Accordion uses button+region semantics. Remove the wrapping tablist role, see docs/migration.
<div>
  <Accordion.Root value={v} onValueChange={setV}>
    <Accordion.Item value="a"><Accordion.Header><Accordion.Trigger>A</Accordion.Trigger></Accordion.Header><Accordion.Panel>…</Accordion.Panel></Accordion.Item>
  </Accordion.Root>
</div>
