import * as React from 'react';
// import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Image from 'next/image';

// import { paths } from '@/paths';
// import { DynamicLogo } from '@/components/core/logo';

export interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <Box
      sx={{
        display: {
          position: 'relative',
          xs: 'flex',
          lg: 'grid'
        },
        flexDirection: 'column',
        gridTemplateColumns: 'auto 802px',
        minHeight: '100%',
        backgroundImage: 'url(/assets/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Box sx={{ position: 'absolute', display: 'flex', justifyContent: 'center', gap: 4, marginTop: '59px', marginLeft: '83px' }}>
        <img src="/assets/bumn.png" alt="bumn" />
        <img src="/assets/bri.png" alt="bri" />
      </Box>
      <Box
        sx={{
          alignItems: 'center',
          // background: 'radial-gradient(50% 50% at 50% 50%, #122647 0%, #090E23 100%)',
          color: 'var(--mui-palette-common-white)',
          display: { xs: 'none', lg: 'flex' },
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Stack spacing={3}>
          <Stack spacing={1}>
            <img
              src="/assets/logo-ops-vision.svg"
              alt="OpsVision"
              width="114.14px"
              height="108.61px"
            />
            <div className='flex flex-col gap-3'>
              <Typography color="white" fontWeight={700} fontSize={40} lineHeight={'48.76px'}>
                OpsVision
              </Typography>
              <Typography color="white" fontWeight={600} fontSize={20} lineHeight={'24.38px'} sx={{ opacity: 0.8 }}>
                Clear Insight for Confident Operation
              </Typography>

            </div>
          </Stack>
        </Stack>
      </Box>
      <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column', background: 'rgba(255,255,255,0.1)' }}>
        <Box sx={{ alignItems: 'center', display: 'flex', flex: '1 1 auto', justifyContent: 'center', p: 3 }}>
          <Box sx={{ maxWidth: '450px', width: '100%' }}>{children}</Box>
        </Box>
      </Box>
    </Box>
  );
}
