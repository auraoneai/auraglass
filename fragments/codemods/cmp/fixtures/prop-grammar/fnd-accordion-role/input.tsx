// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Accordion } from 'aura-glass';

<div role="tablist">
  <Accordion.Root value={v} onValueChange={setV}>
    <Accordion.Item value="a"><Accordion.Header><Accordion.Trigger>A</Accordion.Trigger></Accordion.Header><Accordion.Panel>…</Accordion.Panel></Accordion.Item>
  </Accordion.Root>
</div>
