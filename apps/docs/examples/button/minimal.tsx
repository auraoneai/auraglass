import { Button } from 'aura-glass';

export default function ButtonMinimal() {
  return (
    <>
      <Button prominent>Save changes</Button>
      <Button variant="clear">Cancel</Button>
      <Button intent="danger">Delete</Button>
    </>
  );
}
