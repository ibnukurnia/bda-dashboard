import * as React from 'react'
import type { Metadata } from 'next'

import MainPageUserManagement from '@/components/dashboard/user-management/main-page'

export const metadata = { title: `User Management` } satisfies Metadata

export default function Page(): React.JSX.Element {
    return (
        <MainPageUserManagement />
    )
}
