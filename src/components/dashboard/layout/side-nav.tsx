// sidenav.tsx

'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';

import type { NavItemConfig } from '@/types/nav';
import { isNavItemActive } from '@/lib/is-nav-item-active';
import { navItems } from './config'; // Importing the updated navItems
import { navIcons } from './nav-icons';
// import { paths } from '@/paths';
import { authClient } from '@/lib/auth/client';
import { logger } from '@/lib/default-logger';
import { useUser } from '@/hooks/use-user';
import { usePathname } from 'next/navigation';
import router from 'next/dist/client/router';
// import { LogOut as LogoutIcon } from 'react-feather';

export function SideNav(): React.ReactElement {
  const pathname = usePathname();
  const { checkSession } = useUser();

  const handleSignOut = React.useCallback(async (): Promise<void> => {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        logger.error('Sign out error', error);
        return;
      }

      // Refresh the auth state
      await checkSession?.();

      // Manually refresh the router to update navigation state
      router.reload();
    } catch (err) {
      logger.error('Sign out error', err);
    }
  }, [checkSession]);

  const logoutItem: NavItemConfig = {
    key: 'logout',
    // title: 'Logout',
    icon: 'log-out',
    onClick: handleSignOut,
  };

  return (
    <Box
      sx={{
        '--SideNav-background': 'var(--mui-palette-neutral-950)',
        '--SideNav-color': 'var(--mui-palette-common-white)',
        '--NavItem-color': 'var(--mui-palette-neutral-300)',
        '--NavItem-hover-background': 'rgba(255, 255, 255, 0.04)',
        '--NavItem-active-background': 'var(--mui-palette-primary-main)',
        '--NavItem-active-color': 'var(--mui-palette-primary-contrastText)',
        '--NavItem-disabled-color': 'var(--mui-palette-neutral-500)',
        '--NavItem-icon-color': 'var(--mui-palette-neutral-400)',
        '--NavItem-icon-active-color': 'var(--mui-palette-primary-contrastText)',
        '--NavItem-icon-disabled-color': 'var(--mui-palette-neutral-600)',
        bgcolor: '##020A20',
        color: 'var(--SideNav-color)',
        display: { xs: 'none', lg: 'flex' },
        flexDirection: 'column',
        height: '100%',
        left: 0,
        maxWidth: '100%',
        position: 'fixed',
        scrollbarWidth: 'none',
        top: 0,
        width: 'var(--SideNav-width)',
        zIndex: 'var(--SideNav-zIndex)',
        boxShadow: ' 0px 4px 34.2px 16px #00000040',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      <Divider sx={{ borderColor: 'var(--mui-palette-neutral-700)' }} />
      {/* Primary Navigation Section */}
      <Box component="nav" sx={{ flex: '1 1 auto', px: '10px', py: '20px' }}>
        {renderNavItems({ pathname, items: navItems })}
      </Box>
      {/* Logout Section */}
      <Box component="nav" sx={{ alignContent: 'flex-end', flex: '1 1 auto', px: '8px', py: '20px', mt: 'auto' }}>
        {renderNavItems({ pathname, items: [logoutItem] })}
      </Box>
      <Divider sx={{ borderColor: 'var(--mui-palette-neutral-700)' }} />
    </Box>
  );
}

function renderNavItems({ items = [], pathname }: { items?: NavItemConfig[]; pathname: string }): React.ReactElement {
  const children = items.reduce((acc: React.ReactNode[], curr: NavItemConfig): React.ReactNode[] => {
    const { key, ...item } = curr;

    acc.push(<NavItem key={key} pathname={pathname} {...item} />);

    return acc;
  }, []);

  return (
    <Stack component="ul" spacing={2} sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {children}
    </Stack>
  );
}

interface NavItemProps extends Omit<NavItemConfig, 'items'> {
  pathname: string;
}

function NavItem({ disabled, external, href, icon, matcher, pathname, onClick }: NavItemProps): React.ReactElement {
  const active = isNavItemActive({ disabled, external, href, matcher, pathname });
  const Icon = icon ? navIcons[icon] : null;

  return (
    <li>
      <Box
        {...(href
          ? {
            component: external ? 'a' : RouterLink,
            href,
            target: external ? '_blank' : undefined,
            rel: external ? 'noreferrer' : undefined,
          }
          : { role: 'button', onClick })} // Add onClick handler here
        sx={{
          alignItems: 'center',
          borderRadius: 1,
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          flex: '0 0 auto',
          gap: 1,
          p: '10px',
          position: 'relative',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          justifyContent: 'center', // Center horizontally
          ...(disabled && {
            bgcolor: 'var(--NavItem-disabled-background)',
            color: 'var(--NavItem-disabled-color)',
            cursor: 'not-allowed',
          }),
          ...(active && {
            bgcolor: '#0A1635',
            color: '#4082BD',
          }),
        }}
      >
        <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', flex: '0 0 auto' }}>
          {Icon ? <Icon fill={active ? 'var(--NavItem-icon-active-color)' : 'var(--NavItem-icon-color)'} width={32} height={32} /> : null}
        </Box>

      </Box>
    </li>
  );
}
