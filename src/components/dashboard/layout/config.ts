// the nav config

import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems: NavItemConfig[] = [
  { key: 'overview',href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'customers', href: paths.dashboard.customers, icon: 'radio' },
  { key: 'integrations',href: paths.dashboard.integrations, icon: 'database' },
  // { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  // { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
    // { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
];

export const logoutItem: NavItemConfig = { key: 'logout', href: paths.auth.signIn, icon: 'log-out' };
