'use client';

import React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useUser } from '@/hooks/use-user';
import { navItems } from './config';
import { navIcons } from './nav-icons';
import { isNavItemActive } from '@/lib/is-nav-item-active';
import type { NavItemConfig } from '@/types/nav';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { canViewFeature } from '@/lib/feature-flags';
// import router from 'next/dist/client/router';

interface SideNavProps {
  isOpen: boolean;
}

export function SideNav({ isOpen }: SideNavProps): React.ReactElement {
  const { user } = useUser(); // Fetch user data, including their role
  const userRole = user?.role || ''; // Default to an empty string if the role is unavailable
  const pathname = usePathname();
  console.log(user)
  // Filter nav items based on the user's role
  const filteredNavItems = navItems.filter((item) => {

    console.log(userRole)
    // Hide 'user-management' menu for 'Viewer' role
    if (item.key === 'user-management' && userRole === 'Viewer') {
      return false;
    }
    return true;
  });

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
        gap: '28px',
        height: '100%',
        left: 0,
        maxWidth: '100%',
        position: 'fixed',
        scrollbarWidth: 'none',
        top: 0,
        width: isOpen ? 'fit-content' : '0px',
        overflow: isOpen ? 'visible' : 'hidden',
        zIndex: 'var(--SideNav-zIndex)',
        boxShadow: '0px 4px 34.2px 16px #00000040',
        transition: 'width 0.3s, overflow 0.3s',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      <Box height="67px" borderBottom="1px solid #FFFFFF33">
        <RouterLink href="/">
          <img
            src="/assets/logo-only-ops-vision.svg"
            width="45px"
            height="44px"
            alt="Logo"
          />
        </RouterLink>
      </Box>

      {renderNavItems({ pathname, items: filteredNavItems })}
    </Box>
  );
}

function renderNavItems({ items = [], pathname }: { items?: NavItemConfig[]; pathname: string }): React.ReactElement {
  const { user } = useUser();
  const children = items.reduce((acc: React.ReactNode[], curr: NavItemConfig): React.ReactNode[] => {
    const { key, ...item } = curr;

    if (user && canViewFeature(item.featureFlag, user)) {
      acc.push(<NavItem key={key} pathname={pathname} {...item} />);
    }

    return acc;
  }, []);

  return (
    <Stack component="ul" gap="28px" sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {items.map(({ key, ...item }) => (
        <NavItem key={key} pathname={pathname} {...item} />
      ))}
    </Stack>
  );
}

interface NavItemProps extends Omit<NavItemConfig, 'items'> {
  pathname: string;
}

function NavItem({ title, disabled, external, href, icon, matcher, pathname, onClick }: NavItemProps): React.ReactElement {
  const active = isNavItemActive({ disabled, external, href, matcher, pathname });
  const Icon = icon ? navIcons[icon] : null;

  return (
    <li>
      <Box
        title={title}
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
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            flex: '0 0 auto',
          }}
        >
          {Icon ? (
            <Icon
              fill={active ? 'var(--NavItem-icon-active-color)' : 'var(--NavItem-icon-color)'}
              width={32}
              height={32}
              opacity={active ? 1 : 0.2}
            />
          ) : null}
        </Box>
      </Box>
    </li>
  );
}
