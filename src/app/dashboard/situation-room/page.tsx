import * as React from 'react';
import { Stack } from '@mui/material';
import type { Metadata } from 'next';
import { config } from '@/config';
import MainPageSituationRoom from '@/components/dashboard/situation-room/main-page';


export const metadata = { title: `Situation Room` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={0}>
      <MainPageSituationRoom />
    </Stack >
  );
}

