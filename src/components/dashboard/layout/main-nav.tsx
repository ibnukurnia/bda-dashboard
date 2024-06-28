'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation'; // Import usePathname from Next.js
// import Tooltip from '@mui/material/Tooltip';
// import { Bell, List, Search, User } from 'react-feather';
import { Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
// import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
// import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';

import { usePopover } from '@/hooks/use-popover';

import { MobileNav } from './mobile-nav';
import { UserPopover } from './user-popover';

export function MainNav(): React.JSX.Element {
  const [openNav, setOpenNav] = React.useState<boolean>(false);
  const user = {
    name: 'Davin',
    avatar: '/assets/avatar.png',
    jobTitle: 'Senior Developer',
    country: 'USA',
    city: 'Los Angeles',
    timezone: 'GTM-7',
  } as const;

  const userPopover = usePopover<HTMLDivElement>();
  const pathname = usePathname();

  const getCurrentDateFormatted = (): string => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
    return now.toLocaleDateString('en-US', options);
  };

  const formattedDate = getCurrentDateFormatted();

  const renderOverviewStack = (): React.ReactElement => {
    let title = 'Default Page';
    let description = 'Insights'

    switch (pathname) {
      case '/dashboard':
        title = 'Overview';
        break;
      case '/dashboard/customers':
        title = 'Anomaly Prediction';
        break;
      case '/dashboard/integrations':
        title = 'Situation Room';
        break;
      default:
        break;
    }

    return (
      <Stack>
        <Typography variant="h2" component="h2" color="white">{title}</Typography>
        <Typography variant="body2" component="p" color="white">{description}</Typography>
      </Stack>
    );
  };
  const renderOverviewAlertStack = (): React.ReactElement => {
    let alert = 0;
    let alert_description = "There is no something wrong or ano.."

    switch (pathname) {
      case '/dashboard':
        alert = 0
        break;
      case '/dashboard/customers':
        alert = 0
        break;
      case '/situation-room':
        alert = 0
        break;
      default:
        break;
    }

    return (
      <div className='inline-flex content-center items-center gap-1 bg-black p-2'>
        <div className='bg-gray-400 px-2 py-1 rounded-2xl'>{alert}</div>
        <Typography variant="h6" component="h2" color="green">
          {alert_description}
        </Typography>
      </div>
    );
  };


  return (
    <React.Fragment>
      <Box
        component="header"
        sx={{
          // borderBottom: '1px solid var(--mui-palette-divider)',
          backgroundColor: '#05061e',
          position: 'sticky',
          top: 0,
          zIndex: 'var(--mui-zIndex-appBar)',
          padding: 2
        }}
      >
        <Stack
          direction="row"
          sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', px: 2, py: 1 }}
        >
          {renderOverviewStack()} {/* Conditionally render the Overview stack */}
          {renderOverviewAlertStack()} {/* Conditionally render the Overview Alert Box stack */}
          <Stack sx={{ alignItems: 'right' }} direction="row" spacing={1}>
            <Stack direction="column">
              <Typography variant="h6" component="h2" color="white">
                Hello, {user.name}
              </Typography>
              <Typography variant="body2" component="p" color="white">
                {formattedDate}
              </Typography>
            </Stack>
            <Avatar
              onClick={userPopover.handleOpen}
              ref={userPopover.anchorRef}
              src="/assets/avatar.png"
              sx={{ cursor: 'pointer' }}
            />
          </Stack>
        </Stack>
      </Box>
      <UserPopover anchorEl={userPopover.anchorRef.current} onClose={userPopover.handleClose} open={userPopover.open} />
      <MobileNav
        onClose={() => {
          setOpenNav(false);
        }}
        open={openNav}
      />
    </React.Fragment>
  );
}
