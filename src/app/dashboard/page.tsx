import { Box, Grid, Stack, Typography } from '@mui/material';
import MainPageOverview from '@/components/dashboard/overview/main-page';
import type { Metadata } from 'next';

export const metadata = { title: `Dashboard Overview` } satisfies Metadata;

export default function Page(): React.ReactElement {

  return (
    <Stack spacing={3}>
      <MainPageOverview />
    </Stack>
  );
}
