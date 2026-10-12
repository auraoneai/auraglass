import { Checkbox, CheckboxGroup } from 'aura-glass';

export default function CheckboxGroupMinimal() {
  return (
    <CheckboxGroup defaultValue={['email']} name="channel" aria-label="Notification channels">
      <Checkbox value="email">Email</Checkbox>
      <Checkbox value="sms">SMS</Checkbox>
      <Checkbox value="push">Push</Checkbox>
    </CheckboxGroup>
  );
}
