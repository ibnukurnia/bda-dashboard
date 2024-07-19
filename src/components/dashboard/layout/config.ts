// the nav config

import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems: NavItemConfig[] = [
  { key: 'overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'anomaly-prediction', href: paths.dashboard.anomaly, icon: 'radio' },
  { key: 'situation', href: paths.dashboard.situation, icon: 'database' },
  // { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  // { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  // { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
];

export const logoutItem: NavItemConfig = { key: 'logout', href: paths.auth.signIn, icon: 'log-out' };

// the nav config

import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems: NavItemConfig[] = [
  { key: 'overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'anomaly-prediction', href: paths.dashboard.anomaly, icon: 'radio' },
  { key: 'situation', href: paths.dashboard.situation, icon: 'database' },
  // { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  // { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  // { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
];

export const logoutItem: NavItemConfig = { key: 'logout', href: paths.auth.signIn, icon: 'log-out' };
