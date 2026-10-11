/* CMP-426 consumer-4x case: settings form — controls family. */
'use client';
import * as React from 'react';
import {
  GlassButton,
  GlassInput,
  GlassSwitch,
  GlassCheckbox,
  GlassSelectCompound,
  GlassSelectItem,
  GlassSelectContent,
  GlassSelectTrigger,
  GlassSelectValue,
} from 'aura-glass';
import { GlassCard } from 'aura-glass';
import { Typography } from 'aura-glass/components/data-display/Typography';

const roles = ['admin', 'editor', 'viewer'];

export function SettingsForm() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [notifications, setNotifications] = React.useState(true);
  const [marketing, setMarketing] = React.useState(false);
  const [role, setRole] = React.useState('viewer');
  const [busy, setBusy] = React.useState(false);

  return (
    <GlassCard variant="elevated" size="md" hoverable>
      <Typography variant="h2">Account settings</Typography>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setBusy(true);
        }}
      >
        <GlassInput
          label="Display name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          helperText="Shown on your public profile"
          fullWidth
        />
        <GlassInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          errorText={email.includes('@') ? undefined : 'Enter a valid email'}
          state={email.includes('@') ? 'default' : 'error'}
        />
        <GlassSelectCompound value={role} onValueChange={setRole} name="role">
          <GlassSelectTrigger>
            <GlassSelectValue placeholder="Choose a role" />
          </GlassSelectTrigger>
          <GlassSelectContent>
            {roles.map((r) => (
              <GlassSelectItem key={r} value={r}>{r}</GlassSelectItem>
            ))}
          </GlassSelectContent>
        </GlassSelectCompound>
        <GlassSwitch
          checked={notifications}
          onChange={(checked) => setNotifications(checked)}
          label="Email notifications"
        />
        <GlassCheckbox
          checked={marketing}
          onCheckedChange={(checked) => setMarketing(Boolean(checked))}
          label="Product updates"
        />
        <GlassButton variant="primary" type="submit" loading={busy}>
          Save changes
        </GlassButton>
        <GlassButton variant="ghost" type="button" onClick={() => setName('')}>
          Reset
        </GlassButton>
      </form>
    </GlassCard>
  );
}
