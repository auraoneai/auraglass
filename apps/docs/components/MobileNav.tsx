// MobileNav.tsx — REQ-PLAT-99. Below 64rem the primary navigation lives in an
// aura-glass Sheet (side="start"), so the site works at 320 px. Selecting a
// link closes the sheet.
'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sheet } from 'aura-glass';
import type { NavSection } from '../nav.config';
import { NavTree } from './NavTree';

export function MobileNav({ nav }: { nav: NavSection[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname()?.replace(/\/$/, '') || '/';
  return (
    <div className="docs-mobile-nav">
      <Sheet.Root side="start" open={open} onOpenChange={(next: boolean) => setOpen(next)} labels={{ close: 'Close navigation' }}>
        <Sheet.Trigger aria-label="Open navigation">Menu</Sheet.Trigger>
        <Sheet.Content size="sm">
          <Sheet.Title>AuraGlass docs</Sheet.Title>
          <Sheet.Close>Close</Sheet.Close>
          <NavTree nav={nav} label="Primary" current={pathname} onNavigate={() => setOpen(false)} />
        </Sheet.Content>
      </Sheet.Root>
    </div>
  );
}
