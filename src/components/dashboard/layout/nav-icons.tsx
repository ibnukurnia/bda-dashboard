import MenuAnomalyDetectionIcon from '@/components/system/Icon/MenuAnomalyDetectionIcon';
import MenuForecastingIcon from '@/components/system/Icon/MenuForecastingIcon';
import MenuOverviewIcon from '@/components/system/Icon/MenuOverviewIcon';
import MenuRootCauseAnalysisIcon from '@/components/system/Icon/MenuRootCauseAnalysisIcon';
import MenuUserManagementIcon from '@/components/system/Icon/MenuUserManagementIcon';
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
  AlertOctagon,
  Bell
} from 'react-feather';

export const navIcons: Record<string, Icon> = {
  'chart-pie': ChartPieIcon,
  'gear-six': GearSixIcon,
  'plugs-connected': PlugsConnectedIcon,
  'x-square': XSquare,
  'log-out': Logout,
  'radio': Radio,
  'database': Database,
  'alert-octagon': AlertOctagon,
  bell: Bell,
  user: UserIcon,
  users: UsersIcon,
  activity: Activity,
  'menu-overview': MenuOverviewIcon,
  'menu-anomaly-detection': MenuAnomalyDetectionIcon,
  'menu-forecasting': MenuForecastingIcon,
  'menu-root-cause-analysis': MenuRootCauseAnalysisIcon,
  'menu-user-management': MenuUserManagementIcon,
};
