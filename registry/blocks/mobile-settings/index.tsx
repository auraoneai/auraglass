/* mobile-settings (SURF-131, §3.3): MobileShell + TabBar + CMP Sheet +
   MAT GlassPreferencesPanel seam. Deterministic fixtures; every primary
   control rides the 44px touch target from --ag-touch-target. */
import * as React from 'react';
import { MobileShell } from 'aura-glass/app-shell';
import { TabBar } from 'aura-glass';
import { SETTINGS_TABS } from './fixtures';

export function MobileSettings() {
  return (
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
        <p>Theme, haptics and transparency preferences.</p>
      </section>
    </MobileShell>
  );
}
