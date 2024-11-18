// the nav config

import type { NavItemConfig } from '@/types/nav'
import { paths } from '@/paths'

export const navItems: NavItemConfig[] = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'menu-overview', featureFlag: "GENERAL_FEATURE" },
  { key: 'root-cause-anaylis', title: 'Root Cause Analysis', href: paths.dashboard.rootCauseAnalysis, icon: 'menu-root-cause-analysis', featureFlag: "GENERAL_FEATURE" },
  { key: 'anomaly-detection', title: 'Anomaly Detection', href: paths.dashboard.anomaly, icon: 'menu-anomaly-detection', featureFlag: "GENERAL_FEATURE" },
  // { key: 'situation', href: paths.dashboard.situation, icon: 'database', featureFlag: "GENERAL_FEATURE" },
  { key: 'forecasting', title: 'Forecasting', href: paths.dashboard.forecasting, icon: 'menu-forecasting', featureFlag: "GENERAL_FEATURE" },
  { key: 'anomaly-notification', title: 'Anomaly Notification', href: paths.dashboard.anomalyNotification, icon: 'bell', featureFlag: "GENERAL_FEATURE" },
  { key: 'users-management', title: 'User Management', href: paths.dashboard.userManagement, icon: 'menu-user-management', featureFlag: "USER_MANAGEMENT" },
  // { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six', featureFlag: "GENERAL_FEATURE" },
  // { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user', featureFlag: "GENERAL_FEATURE" },
  // { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square', featureFlag: "GENERAL_FEATURE" },
]

export const logoutItem: NavItemConfig = { key: 'logout', title: 'Logout', href: paths.auth.signIn, icon: 'log-out', featureFlag: "GENERAL_FEATURE" }

// the nav config
