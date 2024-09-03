import type { Metadata } from 'next'

import MainPageOverview from '@/components/dashboard/overview/main-page'

export const metadata = { title: `Dashboard Overview` } satisfies Metadata

export default function Page(): React.ReactElement {
  return (
    <>
      <MainPageOverview />
    </>
  )
}
