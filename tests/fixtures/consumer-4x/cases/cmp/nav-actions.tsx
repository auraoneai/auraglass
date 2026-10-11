/* CMP-426 consumer-4x case: dropdown menu + card list. */
'use client';
import * as React from 'react';
import {
  GlassDropdownMenu,
  GlassDropdownMenuTrigger,
  GlassDropdownMenuContent,
  GlassDropdownMenuItem,
  GlassDropdownMenuLabel,
  GlassDropdownMenuSeparator,
  GlassDropdownMenuCheckboxItem,
  GlassDropdownMenuRadioGroup,
  GlassDropdownMenuRadioItem,
  GlassCard,
  GlassButton,
} from 'aura-glass';

const tickets = [
  { id: 'T-1', title: 'First ticket' },
  { id: 'T-2', title: 'Second ticket' },
];

export function NavActions() {
  const [showArchived, setShowArchived] = React.useState(false);
  const [sort, setSort] = React.useState('newest');
  return (
    <div>
      <GlassDropdownMenu>
        <GlassDropdownMenuTrigger>
          <GlassButton variant="secondary">Actions</GlassButton>
        </GlassDropdownMenuTrigger>
        <GlassDropdownMenuContent>
          <GlassDropdownMenuLabel>Tickets</GlassDropdownMenuLabel>
          <GlassDropdownMenuItem onSelect={() => {}}>New ticket</GlassDropdownMenuItem>
          <GlassDropdownMenuItem onSelect={() => {}}>Export CSV</GlassDropdownMenuItem>
          <GlassDropdownMenuSeparator />
          <GlassDropdownMenuCheckboxItem
            checked={showArchived}
            onCheckedChange={setShowArchived}
          >
            Show archived
          </GlassDropdownMenuCheckboxItem>
          <GlassDropdownMenuRadioGroup value={sort} onValueChange={setSort}>
            <GlassDropdownMenuRadioItem value="newest">Newest</GlassDropdownMenuRadioItem>
            <GlassDropdownMenuRadioItem value="oldest">Oldest</GlassDropdownMenuRadioItem>
          </GlassDropdownMenuRadioGroup>
        </GlassDropdownMenuContent>
      </GlassDropdownMenu>
      {tickets.map((t) => (
        <GlassCard key={t.id} variant="outlined" size="sm" clickable>
          {t.title}
        </GlassCard>
      ))}
    </div>
  );
}
