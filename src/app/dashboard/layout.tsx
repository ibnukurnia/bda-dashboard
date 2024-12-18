'use client'

import * as React from 'react'
import Box from '@mui/material/Box'
import GlobalStyles from '@mui/material/GlobalStyles'
import { AuthGuard } from '@/components/auth/auth-guard'
import { MainNav } from '@/components/dashboard/layout/main-nav'
import { SideNav } from '@/components/dashboard/layout/side-nav'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  const [isSideNavOpen, setIsSideNavOpen] = React.useState(true)

  const toggleSideNav = () => {
    setIsSideNavOpen(!isSideNavOpen)
  }

  return (
    <AuthGuard>
      <GlobalStyles
        styles={{
          body: {
            '--MainNav-height': '56px',
            '--MainNav-zIndex': 1000,
            '--SideNav-width': '128px',
            '--SideNav-zIndex': 1100,
            '--MobileNav-width': '320px',
            '--MobileNav-zIndex': 1100,
          },
        }}
      />
      <Box
        sx={{
          bgcolor: '#05061E',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          minHeight: '100%',
        }}
      >
        {isSideNavOpen && <SideNav isOpen={isSideNavOpen} />}
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            pl: isSideNavOpen ? '94px' : 0,
            transition: 'padding-left 0.3s',
          }}
        >
          <MainNav toggleSideNav={toggleSideNav} />
          <main>
            <div className='py-4 px-8'>
              {children}
            </div>
          </main>
        </Box>
      </Box>
    </AuthGuard>
  )
}
