/* mobile-settings (SURF-131, REQ-SURF-171, DX-079): MobileShell + TabBar +
   CMP Sheet that opens the MAT GlassPreferencesPanel. Deterministic
   fixtures; every primary control (tab items, the sheet trigger and close,
   the panel options) is at least 44×44 via --ag-target-coarse
   (mobile-settings.css). */
'use client';
import * as React from 'react';
import { MobileShell } from 'aura-glass/app-shell';
import { Sheet, TabBar } from 'aura-glass';
import { GlassPreferencesPanel } from 'aura-glass/theme';
import { SETTINGS_TABS } from './fixtures';
import './mobile-settings.css';

export interface MobileSettingsProps {
  /** Open the appearance sheet on first render (uncontrolled). */
  defaultSheetOpen?: boolean;
}

export function MobileSettings({ defaultSheetOpen = false }: MobileSettingsProps = {}) {
  const [open, setOpen] = React.useState(defaultSheetOpen);
  return (
    <div className="ag-mobile-settings" data-ag-part="mobile-settings">
      <MobileShell
        topBar={<strong>Settings</strong>}
        tabBar={
          <TabBar.Root aria-label="Settings sections">
            {SETTINGS_TABS.map((tab) => (
              <TabBar.Item key={tab.id} href={`#${tab.id}`} current={tab.id === 'general'}>
                {tab.label}
              </TabBar.Item>
            ))}
          </TabBar.Root>
        }
      >
        <section aria-labelledby="settings-general">
          <h2 id="settings-general">General</h2>
          <Sheet.Root open={open} onOpenChange={(next) => setOpen(next)} side="bottom">
            <Sheet.Trigger className="ag-mobile-settings__control">Appearance and motion</Sheet.Trigger>
            <Sheet.Content>
              <Sheet.Header>
                <Sheet.Title>Appearance and motion</Sheet.Title>
                <Sheet.Description>Transparency, contrast and motion preferences.</Sheet.Description>
              </Sheet.Header>
              <Sheet.Body>
                <GlassPreferencesPanel className="ag-mobile-settings__panel" />
              </Sheet.Body>
              <Sheet.Footer>
                <Sheet.Close className="ag-mobile-settings__control">Done</Sheet.Close>
              </Sheet.Footer>
            </Sheet.Content>
          </Sheet.Root>
        </section>
      </MobileShell>
    </div>
  );
}
