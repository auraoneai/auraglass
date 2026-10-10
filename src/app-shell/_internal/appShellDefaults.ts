/* Server-safe context carrying the shell defaults down to the server
   Sidebar/Inspector trees so they can emit SSR-correct inert/hidden attrs
   without reading the client store (SURF-30). */

import { createContext } from 'react';
import type { InspectorState, SidebarState } from '../appShellStore';

export const AppShellDefaults = createContext<{
  sidebar: SidebarState;
  inspector: InspectorState;
}>({ sidebar: 'expanded', inspector: 'closed' });
