'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation'; // Import usePathname from Next.js
import { Button, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Link from 'next/link'; // Import Link from Next.js

import { MobileNav } from './mobile-nav';

interface MainNavProps {
  toggleSideNav: () => void;
}

export function MainNav({ toggleSideNav }: MainNavProps): React.JSX.Element {
  const [openNav, setOpenNav] = React.useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState<boolean>(false);
  const [isNotifDetailsOpen, setIsNotifDetailsOpen] = React.useState<boolean>(false);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = React.useState<boolean>(false);

  const notifRef = React.useRef<HTMLDivElement | null>(null);
  const userRef = React.useRef<HTMLDivElement | null>(null);

  const user = {
    name: 'Fadhli',
    avatar: '/assets/avatar.png',
    jobTitle: 'Data Scientist',
    country: 'Indonesia',
    city: 'Jakarta',
    timezone: 'GTM-7',
  } as const;

  const pathname = usePathname();

  const getCurrentDateFormatted = (): string => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
    return now.toLocaleDateString('en-US', options);
  };

  const formattedDate = getCurrentDateFormatted();

  const renderOverviewStack = (): React.ReactElement => {
    let title = 'Default Page';

    switch (pathname) {
      case '/dashboard':
        title = 'Overview';
        break;
      case '/dashboard/anomaly-detection':
        title = 'Anomaly Detection';
        break;
      case '/dashboard/situation-room':
        title = 'Situation Room';
        break;
      case '/dashboard/forecasting':
        title = 'Forecasting';
        break;
      default:
        break;
    }

    return (
      <Box display={'flex'} gap={2}>
        <button onClick={handleToggleSideNav} className='text-blue-400 hover:text-blue-600'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-10 w-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
          </svg>
        </button>
        <Typography variant="h3" component="h3" color="white" className='content-center '>
          {title}
        </Typography>
      </Box>
    );
  };

  const handleToggleSideNav = () => {
    toggleSideNav();
    setIsSidebarOpen((prevState) => !prevState);
  };

  const toggleUserDetails = () => {
    setIsUserDetailsOpen((prev) => !prev);
  };

  const toggleNotifDetails = () => {
    setIsNotifDetailsOpen((prev) => !prev);
  };

  // Close dropdowns if clicked outside
  const handleClickOutside = (event: MouseEvent) => {
    if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
      setIsNotifDetailsOpen(false);
    }
    if (userRef.current && !userRef.current.contains(event.target as Node)) {
      setIsUserDetailsOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <React.Fragment>
      <Box
        component="header"
        sx={{
          backgroundColor: '#05061e',
          position: 'sticky',
          top: 0,
          zIndex: 'var(--mui-zIndex-appBar)',
          paddingTop: 2,
          paddingBottom: 2,
        }}
      >
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: '64px' }}>
          {renderOverviewStack()}

          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            {/* Notification Button */}
            <Button onClick={toggleNotifDetails} className="relative text-blue-400 hover:text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" className="w-10 h-10 stroke-current text-blue-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
              </svg>
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">3</span>
            </Button>

            {/* User Button */}
            <Button onClick={toggleUserDetails} className="text-white hover:text-gray-300">
              <Avatar src="/assets/avatar.png" sx={{ cursor: 'pointer', marginLeft: '8px' }} />
            </Button>
          </Stack>
        </Stack>
      </Box>

      {isUserDetailsOpen && (
        <Box
          ref={userRef}
          sx={{
            position: 'absolute',
            top: '72px',
            right: '16px',
            backgroundColor: 'white',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            zIndex: 9999,
          }}
        >
          <Stack direction="column" gap={2} p={1}>
            <Typography variant="h6" component="h2" color="black">
              {user.name}
            </Typography>
            <Typography variant="body2" component="p" color="black">
              {user.jobTitle}
            </Typography>
            <Typography variant="body2" component="p" color="black">
              {formattedDate}
            </Typography>
          </Stack>
        </Box>
      )}

      {isNotifDetailsOpen && (
        <div ref={notifRef} className="absolute right-16 w-64 bg-white border border-gray-200 rounded shadow-lg z-10">
          <div className="p-3">
            <Typography variant="body2" className="px-4 py-2 text-gray-800">
              Notification 1
            </Typography>
            <Typography variant="body2" className="px-4 py-2 text-gray-800">
              Notification 2
            </Typography>
            <Typography variant="body2" className="px-4 py-2 text-gray-800">
              Notification 3
            </Typography>
            {/* Add more notifications as needed */}
          </div>
          <div className="border-t border-gray-200">
            <Link href="/notifications" passHref>
              <Button component="a" className="w-full text-center py-2 text-gray-600 hover:bg-gray-100">
                View All
              </Button>
            </Link>
          </div>
        </div>
      )}

      <MobileNav
        onClose={() => {
          setOpenNav(false);
        }}
        open={openNav}
      />
    </React.Fragment>
  );
}
