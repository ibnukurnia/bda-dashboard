// the nav config

import type { NavItemConfig } from '@/types/nav'
import { paths } from '@/paths'

export const navItems: NavItemConfig[] = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'menu-overview' },
  { key: 'root-cause-anaylis', title: 'Root Cause Analysis', href: paths.dashboard.rootCauseAnalysis, icon: 'menu-root-cause-analysis' },
  { key: 'anomaly-detection', title: 'Anomaly Detection', href: paths.dashboard.anomaly, icon: 'menu-anomaly-detection' },
  // { key: 'situation', href: paths.dashboard.situation, icon: 'database' },
  { key: 'forecasting', title: 'Forecasting', href: paths.dashboard.forecasting, icon: 'menu-forecasting' },
  { key: 'anomaly-notification', title: 'Notification', href: paths.dashboard.anomalyNotification, icon: 'bell' },
  { key: 'users-management', title: 'User Management', href: paths.dashboard.userManagement, icon: 'menu-user-management' },
  // { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  // { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  // { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
]

export const logoutItem: NavItemConfig = { key: 'logout', title: 'Logout', href: paths.auth.signIn, icon: 'log-out' }

// the nav config
