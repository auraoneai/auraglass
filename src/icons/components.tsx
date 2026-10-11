/* Icon (CMP-037): name-keyed registry component. Decorative svg by default;
   role='img' + <title> when aria-label/title given (handled in createIcon). */
import * as React from 'react';
import type { IconComponent, IconComponentProps } from './types';
import { ActivityIcon } from './data/activity';
import { AlertCircleIcon } from './status/alert-circle';
import { AlertTriangleIcon } from './status/alert-triangle';
import { ArchiveIcon } from './action/archive';
import { BellIcon } from './collaboration/bell';
import { CalendarIcon } from './navigation/calendar';
import { CheckIcon } from './action/check';
import { DatabaseIcon } from './data/database';
import { FilterIcon } from './action/filter';
import { HomeIcon } from './navigation/home';
import { Loader2Icon } from './action/loader-2';
import { MenuIcon } from './navigation/menu';
import { SearchIcon } from './action/search';
import { SettingsIcon } from './navigation/settings';
import { SparklesIcon } from './ai/sparkles';
import { UserIcon } from './collaboration/user';
import { UsersIcon } from './collaboration/users';
import { XIcon } from './action/x';

export const iconRegistry = {
  activity: ActivityIcon,
  alert: AlertCircleIcon,
  archive: ArchiveIcon,
  calendar: CalendarIcon,
  check: CheckIcon,
  close: XIcon,
  command: SearchIcon,
  data: DatabaseIcon,
  filter: FilterIcon,
  home: HomeIcon,
  loading: Loader2Icon,
  menu: MenuIcon,
  notification: BellIcon,
  search: SearchIcon,
  settings: SettingsIcon,
  spark: SparklesIcon,
  user: UserIcon,
  users: UsersIcon,
  warning: AlertTriangleIcon,
  clear: XIcon,} as const;

export const Icon = ({ name, ...props }: IconComponentProps) => {
  const C: IconComponent = iconRegistry[name as keyof typeof iconRegistry] ?? CircleFallback;
  return <C {...props} />;
};

const CircleFallback: IconComponent = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg" width={props.size ?? 24} height={props.size ?? 24}
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" aria-hidden={true} focusable="false"
    data-ag-part="root" {...props}>
    <circle cx={12} cy={12} r={9} />
  </svg>
);
