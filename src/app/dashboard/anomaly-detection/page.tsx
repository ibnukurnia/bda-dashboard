import * as React from 'react';
import type { Metadata } from 'next';
import { Stack } from '@mui/material';
import MainPageAnomaly from '@/components/dashboard/anomaly/main-page';
import { redirect, RedirectType } from 'next/navigation';
import { validDataSource, validTimeRange } from '@/helper';
import { DEFAULT_DATA_SOURCE_NAMESPACE, DEFAULT_TIME_RANGE } from '@/constants';

export const metadata = { title: `Anomaly Prediction` } satisfies Metadata;

interface PageProps {
    searchParams: { [key: string]: string | undefined }; // Proper type for searchParams
}

export default function Page({ searchParams }: PageProps): React.JSX.Element {
    let correctedSearchParams = false

    if (!searchParams.data_source || !validDataSource(searchParams.data_source)) {
        correctedSearchParams = true
        searchParams.data_source = DEFAULT_DATA_SOURCE_NAMESPACE
    }

    if (!searchParams.time_range || !validTimeRange(searchParams.time_range)) {
        correctedSearchParams = true
        searchParams.time_range = DEFAULT_TIME_RANGE
    }

    if (correctedSearchParams) {
        // console.log(correctedSearchParams, "test")
        const filteredSearchParams = Object.fromEntries(
            Object.entries(searchParams)
                .filter(([_, value]) => value !== undefined) // Filter out undefined values
                .map(([key, value]) => [key, value as string]) // Cast value to string
        );

        const searchParamString = new URLSearchParams(filteredSearchParams).toString();
        // console.log(searchParamString, "test 2")
        redirect(`/dashboard/anomaly-detection?${searchParamString}`, RedirectType.replace);

    }

    return (
        <Stack>
            <MainPageAnomaly />
        </Stack>
    );
}
