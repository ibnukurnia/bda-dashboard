'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import type { NavItemConfig } from '@/types/nav';
import { isNavItemActive } from '@/lib/is-nav-item-active';
import { navItems } from './config';
import { navIcons } from './nav-icons';
// import { authClient } from '@/lib/auth/client';
// import { logger } from '@/lib/default-logger';
import { useUser } from '@/hooks/use-user';
import { usePathname } from 'next/navigation';
// import router from 'next/dist/client/router';

interface SideNavProps {
  isOpen: boolean;
}

export function SideNav({ isOpen }: SideNavProps): React.ReactElement {
  const pathname = usePathname();
  const { checkSession } = useUser();

  // const handleSignOut = React.useCallback(async (): Promise<void> => {
  //   try {
  //     const { error } = await authClient.signOut();

  //     if (error) {
  //       logger.error('Sign out error', error);
  //       return;
  //     }

  //     await checkSession?.();
  //     router.reload();
  //   } catch (err) {
  //     logger.error('Sign out error', err);
  //   }
  // }, [checkSession]);

  // const logoutItem: NavItemConfig = {
  //   key: 'logout',
  //   icon: 'log-out',
  //   onClick: handleSignOut,
  // };

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
        padding: '47px 20px',
        bgcolor: '#08163580',
        color: 'var(--SideNav-color)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap:'28px',
        height: '100%',
        left: 0,
        maxWidth: '100%',
        position: 'fixed',
        scrollbarWidth: 'none',
        top: 0,
        width: isOpen ? 'fit-content' : '0px',
        overflow: isOpen ? 'visible' : 'hidden',
        zIndex: 'var(--SideNav-zIndex)',
        boxShadow: ' 0px 4px 34.2px 16px #00000040',
        transition: 'width 0.3s, overflow 0.3s',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      <Box height={'67px'} borderBottom={'1px solid #FFFFFF33'}>
        <img
          src='/assets/logo-only-ops-vision.svg'
          width={'45px'}
          height={'44px'}
        />
      </Box>

      {renderNavItems({ pathname, items: navItems })}
      {/* <Box component="nav" sx={{ alignContent: 'flex-end', flex: '1 1 auto', px: '8px', py: '20px', mt: 'auto' }}>
        {renderNavItems({ pathname, items: [logoutItem] })}
      </Box> */}
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
    <Stack component="ul" gap={'28px'} sx={{ listStyle: 'none', m: 0, p: 0 }}>
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
          : { role: 'button', onClick })}
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
          justifyContent: 'center',
          ...(disabled && {
            bgcolor: 'var(--NavItem-disabled-background)',
            color: 'var(--NavItem-disabled-color)',
            cursor: 'not-allowed',
          }),
          ...(active && {
            bgcolor: '#3078FF',
          }),
          '&:hover': {
            bgcolor: '#3078FF',
          },
        }}
      >
        <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', flex: '0 0 auto' }}>
          {Icon ? <Icon
            fill={active ? 'var(--NavItem-icon-active-color)' : 'var(--NavItem-icon-color)'}
            width={32}
            height={32}
            opacity={active ? 1 : 0.2}
          /> : null}
        </Box>
      </Box>
    </li>
  );
}
