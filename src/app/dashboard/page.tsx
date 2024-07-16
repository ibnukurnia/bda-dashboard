// import { useState, useEffect, useContext } from 'react';
// import type { Metadata } from 'next';
import { Box, Grid, Stack, Typography } from '@mui/material';
// import TabsComponent from '@/components/dashboard/overview/tabs';
// import { OverviewContext } from '@/contexts/overview-context';
// import { InsightPanel } from '@/components/dashboard/overview/panels/insight';
// import { TeamOverviewPanel } from '@/components/dashboard/overview/panels/team-overview';
// import { SeviceOverviewPanel } from '@/components/dashboard/overview/panels/service-overview-panel';
// import { MetricsOverviewPanel } from '@/components/dashboard/overview/panels/metrics';
import MainPageOverview from '@/components/dashboard/overview/main-page';
import type { Metadata } from 'next';
// import { config } from '@/config';

export const metadata = { title: `Dashboard Overview` } satisfies Metadata;

export default function Page(): React.ReactElement {

  // const {
  //   insightOverview,
  //   teamOverview,
  //   serviceOverviews,
  //   metricsOverviews,
  //   setLoad
  // } = useContext(OverviewContext)


  // const tabs = [
  //   {
  //     id: 'insights',
  //     label: 'Insights',
  //     icon:
  //       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  //         <g clipPath="url(#clip0_28_4313)">
  //           <path d="M21 8C19.55 8 18.74 9.44 19.07 10.51L15.52 14.07C15.22 13.98 14.78 13.98 14.48 14.07L11.93 11.52C12.27 10.45 11.46 9 10 9C8.55 9 7.73 10.44 8.07 11.52L3.51 16.07C2.44 15.74 1 16.55 1 18C1 19.1 1.9 20 3 20C4.45 20 5.26 18.56 4.93 17.49L9.48 12.93C9.78 13.02 10.22 13.02 10.52 12.93L13.07 15.48C12.73 16.55 13.54 18 15 18C16.45 18 17.27 16.56 16.93 15.48L20.49 11.93C21.56 12.26 23 11.45 23 10C23 8.9 22.1 8 21 8Z" fill="#FFFFF7" />
  //           <path d="M15 9L15.94 6.93L18 6L15.94 5.07L15 3L14.08 5.07L12 6L14.08 6.93L15 9Z" fill="#FFFFF7" />
  //           <path d="M3.5 11L4 9L6 8.5L4 8L3.5 6L3 8L1 8.5L3 9L3.5 11Z" fill="#FFFFF7" />
  //         </g>
  //         <defs>
  //           <clipPath id="clip0_28_4313">
  //             <rect width="24" height="24" fill="white" />
  //           </clipPath>
  //         </defs>
  //       </svg>,
  //     content: <InsightPanel insightOverview={insightOverview} />,
  //   },
  //   {
  //     id: 'team-overview',
  //     label: 'Team Overview',
  //     icon:
  //       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  //         <g clipPath="url(#clip0_28_4579)">
  //           <path d="M12 2C8.14 2 5 5.14 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.14 15.86 2 12 2ZM12 4C13.1 4 14 4.9 14 6C14 7.11 13.1 8 12 8C10.9 8 10 7.11 10 6C10 4.9 10.9 4 12 4ZM12 14C10.33 14 8.86 13.15 8 11.85C8.02 10.53 10.67 9.8 12 9.8C13.33 9.8 15.98 10.53 16 11.85C15.14 13.15 13.67 14 12 14Z" fill="#FFFFF7" />
  //         </g>
  //         <defs>
  //           <clipPath id="clip0_28_4579">
  //             <rect width="24" height="24" fill="white" />
  //           </clipPath>
  //         </defs>
  //       </svg>,
  //     content: <TeamOverviewPanel teamOverview={teamOverview} />,
  //   },
  //   {
  //     id: 'service-overview',
  //     label: 'Service Overview',
  //     icon:
  //       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  //         <g clipPath="url(#clip0_40_5959)">
  //           <path d="M13 13C12.44 13.56 11.55 13.56 11 13.01V13C10.45 12.45 10.45 11.56 11 11.01V11C11.55 10.45 12.44 10.45 12.99 11H13C13.55 11.55 13.55 12.45 13 13ZM12 5.99996L14.12 8.11996L16.62 5.61996L13.42 2.41996C12.64 1.63996 11.37 1.63996 10.59 2.41996L7.38996 5.61996L9.88996 8.11996L12 5.99996ZM5.99996 12L8.11996 9.87996L5.61996 7.37996L2.41996 10.58C1.63996 11.36 1.63996 12.63 2.41996 13.41L5.61996 16.61L8.11996 14.11L5.99996 12ZM18 12L15.88 14.12L18.38 16.62L21.58 13.42C22.36 12.64 22.36 11.37 21.58 10.59L18.38 7.38996L15.88 9.88996L18 12ZM12 18L9.87996 15.88L7.37996 18.38L10.58 21.58C11.36 22.36 12.63 22.36 13.41 21.58L16.61 18.38L14.11 15.88L12 18Z" fill="#FFFFF7" />
  //         </g>
  //         <defs>
  //           <clipPath id="clip0_40_5959">
  //             <rect width="24" height="24" fill="white" />
  //           </clipPath>
  //         </defs>
  //       </svg>,
  //     content: <SeviceOverviewPanel serviceOverviews={serviceOverviews} />
  //   },
  //   {
  //     id: 'metrics',
  //     label: 'Metrics',
  //     icon:
  //       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  //         <g clipPath="url(#clip0_40_5963)">
  //           <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM8 17C7.45 17 7 16.55 7 16V11C7 10.45 7.45 10 8 10C8.55 10 9 10.45 9 11V16C9 16.55 8.55 17 8 17ZM12 17C11.45 17 11 16.55 11 16V8C11 7.45 11.45 7 12 7C12.55 7 13 7.45 13 8V16C13 16.55 12.55 17 12 17ZM16 17C15.45 17 15 16.55 15 16V14C15 13.45 15.45 13 16 13C16.55 13 17 13.45 17 14V16C17 16.55 16.55 17 16 17Z" fill="#FFFFF7" />
  //         </g>
  //         <defs>
  //           <clipPath id="clip0_40_5963">
  //             <rect width="24" height="24" fill="white" />
  //           </clipPath>
  //         </defs>
  //       </svg>,
  //     content: <MetricsOverviewPanel metricsOverview={metricsOverviews} />,
  //   },
  // ];

  // useEffect(() => {
  //   setLoad(true)
  // }, [])

  return (
    <Stack spacing={3}>
      <MainPageOverview />
    </Stack>
  );
}
