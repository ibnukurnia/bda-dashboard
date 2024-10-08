import * as React from 'react'
import type { Metadata } from 'next'

import MainPageForecasting from '@/components/dashboard/forecasting/main-page'

export const metadata = { title: `Anomaly Forecasting` } satisfies Metadata

export default function Page(): React.JSX.Element {
  return (
    <MainPageForecasting />
  )
}
