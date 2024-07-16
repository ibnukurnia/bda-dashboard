import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
import { Stack } from '@mui/material';
import MainPageAnomaly from '@/components/dashboard/anomaly/main-page';

export const metadata = { title: `Anomaly Prediction` } satisfies Metadata;

export default function Page(): React.JSX.Element {
    return (
        <Stack spacing={0}>
            <MainPageAnomaly />
        </Stack>
    );
}
