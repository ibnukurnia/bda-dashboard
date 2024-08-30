import type { Icon } from 'react-feather';
import {
  BarChart as ChartPieIcon,
  Settings as GearSixIcon,
  Minus as PlugsConnectedIcon,
  User as UserIcon,
  Users as UsersIcon,
  XOctagon as XSquare,
  Radio,
  Database,
  LogOut as Logout,
  Activity,
} from 'react-feather';

export const navIcons: Record<string, Icon> = {
  'chart-pie': ChartPieIcon,
  'gear-six': GearSixIcon,
  'plugs-connected': PlugsConnectedIcon,
  'x-square': XSquare,
  'log-out': Logout,
  'radio': Radio,
  'database': Database,
  user: UserIcon,
  users: UsersIcon,
  activity: Activity,
};
