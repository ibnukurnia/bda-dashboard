'use client';

import { useCallback, useState } from 'react';
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

import { paths } from '@/paths';
import { authClient } from '@/lib/auth/client';
import { useUser } from '@/hooks/use-user';
import { LoginSchema, LoginValues } from '@/modules/schemas';
import { LoginUsecase } from '@/modules/usecases/auth';
import { handleError } from '@/lib/error-handler';
import { IconButton, InputAdornment } from '@mui/material';

export function SignInForm() {
  const router = useRouter();
  const { checkSession } = useUser();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginValues>({
    mode: 'onChange', defaultValues: {
      pernr: '',
      password: ''
    }, resolver: zodResolver(LoginSchema)
  });

  const onSubmit = useCallback(async (values: LoginValues): Promise<void> => {
    setIsPending(true)

    try {
      await LoginUsecase(values)
      console.log(values)
      router.push('/dashboard')
    } catch (error) {
      //set to be displayed later
      const errString = handleError(error)
      setError('root', { type: 'server', message: errString })
      return
    } finally {
      setIsPending(false)
      await checkSession?.()
      router.refresh()
    }
  }, [checkSession, router, errors])

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h2" color="white">
          Sign in
        </Typography>
        {errors.root ? <Alert color="error" severity='error'>{errors.root.message}</Alert> : null}
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="pernr"
            render={({ field }) => (
              <FormControl error={Boolean(errors.pernr)}>
                <OutlinedInput
                  {...field}
                  label="Pern"
                  placeholder="Type your pernr"
                  type="text"
                  sx={{ backgroundColor: 'white' }}
                />
                {errors.pernr ? <FormHelperText>{errors.pernr.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <OutlinedInput
                  {...field}
                  sx={{ backgroundColor: 'white' }}
                  endAdornment={
                    <InputAdornment position="end" sx={{ backgroundColor: '#E8F0FE' }}>
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        style={{ color: '' }}
                      >
                        {showPassword ? (
                          <Eye fontSize="var(--icon-fontSize-md)" />
                        ) : (
                          <EyeOff fontSize="var(--icon-fontSize-md)" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                  placeholder="Type your password"
                  type={showPassword ? 'text' : 'password'}
                />
                {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
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
        {/* <Link
          component={RouterLink}
          href={paths.auth.resetPassword}
          variant="subtitle2"
          sx={{ color: 'white' }} // Set text color to white
        >
          Forgot password?
        </Link> */}
      </Stack>
    </Stack>
  );
}
