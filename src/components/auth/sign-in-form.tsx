'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
// import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Eye, EyeOff } from 'react-feather';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { paths } from '@/paths';
import { authClient } from '@/lib/auth/client';
import { useUser } from '@/hooks/use-user';

const schema = zod.object({
  email: zod.string().min(1, { message: 'Email is required' }).email(),
  password: zod.string().min(1, { message: 'Password is required' }),
  rememberMe: zod.boolean(), // Add rememberMe field
});

type Values = zod.infer<typeof schema>;

const defaultValues = { email: 'sofia@devias.io', password: 'Secret1', rememberMe: false } satisfies Values;

export function SignInForm(): React.JSX.Element {
  const router = useRouter();

  const { checkSession } = useUser();

  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const [isPending, setIsPending] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);

      const { error } = await authClient.signInWithPassword(values);

      if (error) {
        setError('root', { type: 'server', message: error });
        setIsPending(false);
        return;
      }

      // Save the rememberMe value in local storage or session storage
      if (values.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }

      // Refresh the auth state
      await checkSession?.();

      // UserProvider, for this case, will not refresh the router
      // After refresh, GuestGuard will handle the redirect
      router.refresh();
    },
    [checkSession, router, setError]
  );

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h2" color="white">
          Sign in
        </Typography>
        {/* <Typography color="white" variant="body2">
          Don&apos;t have an account?{' '}
          <Link component={RouterLink} href={paths.auth.signUp} underline="hover" color="#F59823">
            Sign up
          </Link>
        </Typography> */}
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)}>
                {/* <InputLabel>Email address</InputLabel> */}
                <OutlinedInput
                  {...field}
                  label="Email address"
                  placeholder="Type your email"
                  type="email"
                  sx={{ backgroundColor: 'white' }} // Set background color to white
                />
                {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                {/* <InputLabel>Password</InputLabel> */}
                <OutlinedInput
                  {...field}
                  endAdornment={
                    showPassword ? (
                      <Eye
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={(): void => {
                          setShowPassword(false);
                        }}
                      />
                    ) : (
                      <EyeOff
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={(): void => {
                          setShowPassword(true);
                        }}
                      />
                    )
                  }
                  label="Password"
                  placeholder="Type your password"
                  type={showPassword ? 'text' : 'password'}
                  sx={{ backgroundColor: 'white' }} // Set background color to white
                />
                {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Stack spacing={1}>
            <Controller
              control={control}
              name="rememberMe"
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      {...field}
                      sx={{
                        color: 'white',
                        '&.Mui-checked': {
                          color: 'white',
                        },
                      }}
                    />
                  }
                  label="Remember me"
                  sx={{ color: 'white' }}
                />
              )}
            />
          </Stack>
          {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          <Button
            disabled={isPending}
            type="submit"
            sx={{
              backgroundColor: '#F59823',
              color: 'white', // Ensure the text color contrasts well with the background
              '&:hover': {
                backgroundColor: '#e0861e', // Optionally define a hover color
              },
            }}
          >
            Sign in
          </Button>
        </Stack>
      </form>
      <Stack
        sx={{
          alignItems: 'center', // Center horizontally
          justifyContent: 'center', // Center vertically
        }}
      >
        <Link
          component={RouterLink}
          href={paths.auth.resetPassword}
          variant="subtitle2"
          sx={{ color: 'white' }} // Set text color to white
        >
          Forgot password?
        </Link>
      </Stack>
      <Stack>
        <Alert color="warning">
          Use{' '}
          <Typography component="span" sx={{ fontWeight: 700 }} variant="inherit">
            sofia@devias.io
          </Typography>{' '}
          with password{' '}
          <Typography component="span" sx={{ fontWeight: 700 }} variant="inherit">
            Secret1
          </Typography>
        </Alert>
      </Stack>
    </Stack>
  );
}
