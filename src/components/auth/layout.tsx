import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

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
        background: 'radial-gradient(105.48% 165.73% at 100% -2.82%, #000C6F 0%, #01040D 100%)'
      }}
    >
      <Box sx={{ position: 'absolute', display: 'flex', justifyContent: 'center', gap: 4, marginTop: '59px', marginLeft: '83px' }}>
        <img src="/assets/bumn.png" alt="bumn" />
        <img src="/assets/bri.png" alt="bri" />
      </Box>
      <Box
        sx={{
          alignItems: 'center',
          color: 'var(--mui-palette-common-white)',
          display: { xs: 'none', lg: 'flex' },
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Stack className='w-max[565px] gap-5'>
          <img
            src="/assets/logo-ops-vision.svg"
            alt="OpsVision"
            width="355px"
            height="73px"
          />
          <Typography color="white" fontWeight={600} fontSize={20} lineHeight={'24.38px'} sx={{ opacity: 0.8 }}>
            Clear Insight for Confident Operation
          </Typography>
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
