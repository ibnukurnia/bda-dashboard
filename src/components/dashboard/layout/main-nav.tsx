'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation'; // Import usePathname from Next.js
import { Button, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Link from 'next/link'; // Import Link from Next.js
import { authClient } from '@/lib/auth/client';
import { useUser } from '@/hooks/use-user';
import router from 'next/dist/client/router';
import { logger } from '@/lib/default-logger';

import { MobileNav } from './mobile-nav';

interface MainNavProps {
  toggleSideNav: () => void;
}

interface UserInfo {
  name: string;
  avatar: string;
  country: string;
  city: string;
  timezone: string;
}

export function MainNav({ toggleSideNav }: MainNavProps): React.JSX.Element {
  const [openNav, setOpenNav] = React.useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState<boolean>(false);
  const [isNotifDetailsOpen, setIsNotifDetailsOpen] = React.useState<boolean>(false);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = React.useState<boolean>(false);
  const [userInfo, setUserInfo] = React.useState<UserInfo>({
    name: '',
    avatar: '/assets/avatar.png', // Default avatar
    country: 'Indonesia',
    city: 'Jakarta',
    timezone: 'GTM-7',
  });

  const notifRef = React.useRef<HTMLDivElement | null>(null);
  const userRef = React.useRef<HTMLDivElement | null>(null);
  const { checkSession } = useUser();
  const pathname = usePathname(); // Grabbing current path

  const getCurrentDateFormatted = (): string => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    };
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
      case '/dashboard/forecasting':
        title = 'Forecasting';
        break;
      case '/dashboard/root-cause-analysis':
        title = 'Root Cause Analysis';
        break;
      case '/dashboard/anomaly-notification':
        title = 'Anomaly Notification';
        break;
      case '/dashboard/users-management':
        title = 'Users Management';
        break;
      default:
        break;
    }

    return (
      <Box display={'flex'} gap={2}>
        {/* <button onClick={handleToggleSideNav} className="text-blue-400 hover:text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-10 w-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
          </svg>
        </button> */}
        <Typography variant="h3" component="h3" color="white" className="content-center">
          {title}
        </Typography>
      </Box>
    );
  };

  const handleSignOut = React.useCallback(async (): Promise<void> => {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        logger.error('Sign out error', error);
        return;
      }

      await checkSession?.();
      router.reload();
    } catch (err) {
      logger.error('Sign out error', err);
    }
  }, [checkSession]);

  const handleToggleSideNav = () => {
    toggleSideNav();
    setIsSidebarOpen((prevState) => !prevState);
  };

  // Toggle User Details Dropdown
  const toggleUserDetails = () => {
    setIsUserDetailsOpen((prev) => {
      // Close the notification dropdown if it's open
      if (isNotifDetailsOpen) {
        setIsNotifDetailsOpen(false);
      }
      return !prev;
    });
  };

  // Toggle Notification Dropdown
  const toggleNotifDetails = () => {
    setIsNotifDetailsOpen((prev) => {
      // Close the user dropdown if it's open
      if (isUserDetailsOpen) {
        setIsUserDetailsOpen(false);
      }
      return !prev;
    });
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
    const username = localStorage.getItem('username');

    setUserInfo({
      name: username || 'Guest', // Fallback to Guest if username is unavailable
      avatar: '/assets/avatar.png',
      country: 'Indonesia',
      city: 'Jakarta',
      timezone: 'GTM-7',
    });

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
          zIndex: '99',
          padding: 2,
        }}
      >
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: '64px' }}>
          {renderOverviewStack()}

          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={1}>
            {/* Notification Button */}
            <Button onClick={toggleNotifDetails} className="relative text-blue-400 hover:text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" className="w-10 h-10 stroke-current text-blue-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
              </svg>
              {/* Small red dot for notification */}
              <span className="absolute top-1 right-1 w-3 h-3 bg-red-600 rounded-full"></span>
            </Button>


            <Button onClick={toggleUserDetails} className="text-white hover:text-gray-300">
              <div
                style={{
                  backgroundColor: '#32375c', // Gray background
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%', // Rounded circle
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <span style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
                  {userInfo.name.charAt(0).toLowerCase()} {/* Display first letter */}
                </span>
              </div>
            </Button>

          </Stack>
        </Stack>
      </Box>

      {isUserDetailsOpen && (
        <Box
          ref={userRef}
          sx={{
            width: 'fit-content',
            alignSelf: 'flex-end',
            position: 'fixed',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            top: '96px',
            right: '16px',
            backgroundColor: 'white',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            zIndex: 9999,
            marginTop: '4px'
          }}
        >
          <Stack direction="column" gap={1} p={1}>
            <Typography variant="h6" component="h2" color="black">
              {userInfo.name}
            </Typography>
            <Typography variant="body2" component="p" color="black">
              {formattedDate}
            </Typography>
          </Stack>
          <Button onClick={handleSignOut} variant="contained" color="error">
            Log Out
          </Button>
        </Box>
      )}
      {isNotifDetailsOpen && (
        <div
          ref={notifRef}
          className="flex flex-col fixed w-fit right-4 self-end top-24 mt-2 bg-[#081635] border border-gray-600 rounded-lg shadow-lg z-20"
        >
          <div className="flex flex-col gap-4 p-4">
            {/* Anomaly Notification */}
            <div className="bg-[#1f2a48] p-4 rounded-lg flex flex-col gap-5">
              <div className="flex flex-row items-center justify-between gap-6 ">
                <div className="">
                  <p className="text-white font-semibold">Anomaly Detected!</p>
                  <p className="text-gray-200 text-sm">2024-10-03 10:00:00</p>
                </div>
                <span className="bg-red-600 text-white text-xs py-1 px-2 rounded-full">Log APM</span>
              </div>
              <div className="">
                <p className="text-gray-300 text-sm">
                  <span className="text-yellow-500">
                    <span className="inline-block mr-1">⚠</span> {/* Add same margin here */}
                    Anomaly:
                  </span>{' '}
                  Error Rate APM
                </p>
                <p className="text-gray-300 text-sm">
                  <span className="text-gray-200">
                    <svg
                      className="w-4 h-4 inline-block mr-1 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 1 0-14 0 7 7 0 0 0 14 0z"
                      />
                    </svg>
                    Identifier:
                  </span>{' '}
                  primorsk
                </p>
              </div>

            </div>
            <div className="bg-[#1f2a48] p-4 rounded-lg flex flex-col gap-5">
              <div className="flex flex-row items-center justify-between gap-6 ">
                <div className="">
                  <p className="text-white font-semibold">Anomaly Detected!</p>
                  <p className="text-gray-200 text-sm">2024-10-03 10:00:00</p>
                </div>
                <span className="bg-red-600 text-white text-xs py-1 px-2 rounded-full">Log APM</span>
              </div>
              <div className="">
                <p className="text-gray-300 text-sm">
                  <span className="text-yellow-500">
                    <span className="inline-block mr-1">⚠</span> {/* Add same margin here */}
                    Anomaly:
                  </span>{' '}
                  Error Rate APM
                </p>
                <p className="text-gray-300 text-sm">
                  <span className="text-gray-200">
                    <svg
                      className="w-4 h-4 inline-block mr-1 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 1 0-14 0 7 7 0 0 0 14 0z"
                      />
                    </svg>
                    Identifier:
                  </span>{' '}
                  primorsk
                </p>
              </div>

            </div>
          </div>

          <div className="border-t border-gray-600">
            <Link href="/dashboard/anomaly-notification" passHref>
              <Button component="a" className="w-full text-center py-3 text-blue-500 hover:bg-gray-800">
                View All Anomaly
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
