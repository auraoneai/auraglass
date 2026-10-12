import { Accordion } from 'aura-glass';

export default function AccordionMinimal() {
  return (
    <Accordion.Root defaultValue={['billing']}>
      <Accordion.Item value="billing">
        <Accordion.Header><Accordion.Trigger>When am I billed?</Accordion.Trigger></Accordion.Header>
        <Accordion.Content>On the first day of each billing cycle.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="refunds">
        <Accordion.Header><Accordion.Trigger>Can I get a refund?</Accordion.Trigger></Accordion.Header>
        <Accordion.Content>Annual plans are refundable within 30 days.</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
