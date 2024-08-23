'use client';

import * as React from 'react';
import { MobileNav } from './mobile-nav';
import { usePathname } from 'next/navigation'; // Import usePathname from Next.js
import { Button, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
interface MainNavProps {
  toggleSideNav: () => void;
}

export function MainNav({ toggleSideNav }: MainNavProps): React.JSX.Element {

  const [openNav, setOpenNav] = React.useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState<boolean>(false);

  const user = {
    name: 'Fadhli',
    avatar: '/assets/avatar.png',
    jobTitle: 'Data Scientist',
    country: 'Indonesia',
    city: 'Jakarta',
    timezone: 'GTM-7',
  } as const;

  // const userPopover = usePopover<HTMLDivElement>();
  const pathname = usePathname();
  // console.log(pathname)

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
      case '/dashboard/anomaly-detection':
        title = 'Anomaly Detection';
        break;
      // case '/dashboard/situation-room':
      //   title = 'Situation Room';
      //   break;
      default:
        break;
    }

    return (
      <Stack>
        <Typography variant="h3" component="h3" color="white">{title}</Typography>
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
      case '/dashboard/anomaly-detection':
        alert = 3
        break;
      // case '/situation':
      //   alert = 1
      //   break;
      default:
        break;
    }

    return (
      <div className='inline-flex content-center items-center gap-3 bg-black p-2 rounded-xl'>
        <div className='bg-gray-400 px-2 py-1 rounded-2xl'>{alert}</div>
        <Typography variant="h6" component="h2" color="green">
          {alert_description}
        </Typography>
      </div>
    );
  };

  const handleToggleSideNav = () => {
    toggleSideNav();
    setIsSidebarOpen(prevState => !prevState);
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
          paddingTop: 3,
          paddingBottom: 3
        }}
      >
        <Stack
          direction="row"
          sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: '64px' }}
        >
          {renderOverviewStack()} {/* Conditionally render the Overview stack */}
          {renderOverviewAlertStack()} {/* Conditionally render the Overview Alert Box stack */}
          <button onClick={handleToggleSideNav} className='text-sm md:text-md lg:text-lg text-blue-400 hover:text-blue-600'>
            {isSidebarOpen ? 'Open Sidebar' : 'Close Sidebar'}
          </button>
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

              src="/assets/avatar.png"
              sx={{ cursor: 'pointer' }}
            />
          </Stack>

        </Stack>
      </Box>
      {/* <UserPopover anchorEl={userPopover.anchorRef.current} onClose={userPopover.handleClose} open={userPopover.open} /> */}
      <MobileNav
        onClose={() => {
          setOpenNav(false);
        }}
        open={openNav}
      />
    </React.Fragment>
  );
}
