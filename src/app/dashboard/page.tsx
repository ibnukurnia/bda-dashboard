import type { Metadata } from 'next'
import { Box, Grid, Stack, Typography } from '@mui/material'

import MainPageOverview from '@/components/dashboard/overview/main-page'

export const metadata = { title: `Dashboard Overview` } satisfies Metadata

export default function Page(): React.ReactElement {
  return (
    <>
      <MainPageOverview />
    </>
  )
}
