import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { ChartPie as ChartPieIcon } from '@phosphor-icons/react/dist/csr/ChartPie';
import { GearSix as GearSixIcon } from '@phosphor-icons/react/dist/csr/GearSix';
import { PlugsConnected as PlugsConnectedIcon } from '@phosphor-icons/react/dist/csr/PlugsConnected';
import { User as UserIcon } from '@phosphor-icons/react/dist/csr/User';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/csr/Users';
import { XSquare } from '@phosphor-icons/react/dist/csr/XSquare';

export const navIcons = {
  'chart-pie': ChartPieIcon,
  'gear-six': GearSixIcon,
  'plugs-connected': PlugsConnectedIcon,
  'x-square': XSquare,
  user: UserIcon,
  users: UsersIcon,
} as Record<string, Icon>;
