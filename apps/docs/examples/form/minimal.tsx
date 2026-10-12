import { Button, Field, Form } from 'aura-glass';

export default function FormMinimal() {
  return (
    <Form onSubmit={(event) => event.preventDefault()}>
      <Field.Root name="email" validate={(value) => (value ? null : 'Enter an email address')}>
        <Field.Label>Email</Field.Label>
        <Field.Control type="email" />
        <Field.Error />
      </Field.Root>
      <Button type="submit" prominent>Subscribe</Button>
    </Form>
  );
}
