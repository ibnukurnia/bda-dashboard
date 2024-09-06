export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    // account: '/dashboard/account',
    anomaly: '/dashboard/anomaly-detection',
    // situation: '/dashboard/situation-room',
    forecasting: '/dashboard/forecasting',
    rootCauseAnalysis: '/dashboard/root-cause-analysis',
    settings: '/dashboard/settings',
  },
  errors: { notFound: '/errors/not-found' },
} as const
