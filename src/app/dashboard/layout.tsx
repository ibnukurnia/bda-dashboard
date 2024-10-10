'use client'

import * as React from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import GlobalStyles from '@mui/material/GlobalStyles'

import { OverviewProvider } from '@/contexts/overview-context'
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
      {/* <OverviewProvider> */}
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
            {/* <Container maxWidth="xxl">
            </Container> */}

            <main>
              <Container maxWidth="xxl" sx={{ pb: '32px' }}>
                {children}
              </Container>
            </main>
          </Box>
        </Box>
      {/* </OverviewProvider> */}
    </AuthGuard>
  )
}
