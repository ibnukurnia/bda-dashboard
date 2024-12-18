import * as React from 'react'
import type { Metadata } from 'next'

import MainPageRootCauseAnalysis from '@/components/dashboard/root-cause-analysis/main-page'

export const metadata = { title: `Root Cause Analysis` } satisfies Metadata

export default function Page(): React.JSX.Element {
  return (
    <MainPageRootCauseAnalysis />
  )
}
