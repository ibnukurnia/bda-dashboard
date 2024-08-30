import * as React from 'react'
import type { Metadata } from 'next'
import { Stack } from '@mui/material'

import MainPageForecasting from '@/components/dashboard/forecasting/main-page'

export const metadata = { title: `Anomaly Forecasting` } satisfies Metadata

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={0}>
      <MainPageForecasting />
    </Stack>
  )
}
