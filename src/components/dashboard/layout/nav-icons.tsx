import type { Icon } from 'react-feather';
import { PieChart as ChartPieIcon } from 'react-feather';
import { Settings as GearSixIcon } from 'react-feather';
import { Minus as PlugsConnectedIcon } from 'react-feather';
import { User as UserIcon } from 'react-feather';
import { Users as UsersIcon } from 'react-feather';
import { XOctagon as XSquare } from 'react-feather';

export const navIcons = {
  'chart-pie': ChartPieIcon,
  'gear-six': GearSixIcon,
  'plugs-connected': PlugsConnectedIcon,
  'x-square': XSquare,
  user: UserIcon,
  users: UsersIcon,
} as Record<string, Icon>;
