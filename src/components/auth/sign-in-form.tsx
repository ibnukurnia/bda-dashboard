'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Eye, EyeOff } from 'react-feather';
import { Controller, useForm } from 'react-hook-form';

import { useUser } from '@/hooks/use-user';
import { LoginSchema, LoginValues } from '@/modules/schemas';
import { LoginUsecase } from '@/modules/usecases/auth';
import { handleError } from '@/lib/error-handler';
import { IconButton } from '@mui/material';
import PersonIcon from '../system/Icon/PersonIcon';
import LockIcon from '../system/Icon/LockIcon';

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
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-[25px]'>
        <Stack spacing={1}>
          <div className={"flex flex-col gap-[10px]"}>
            <Typography fontWeight={700} fontSize={20} lineHeight={'24.38px'} color="white">
              Welcome to OpsVision! 👋🏻
            </Typography>
            <Typography fontWeight={400} fontSize={16} lineHeight={'18.8px'} color="white">
              Please sign-in to your account
            </Typography>
          </div>
          {errors.root ? <Alert color="error" severity='error'>{errors.root.message}</Alert> : null}
        </Stack>
        <Stack spacing={2} className='gap-[10px]'>
          <div className='flex flex-col gap-[25px]'>
            <Controller
              control={control}
              name="pernr"
              render={({ field }) => (
                <FormControl error={Boolean(errors.pernr)} className='gap-[10px]'>
                  <Typography fontWeight={400} fontSize={16} lineHeight={'18.8px'} color="white">
                    Personal Number
                  </Typography>
                  <OutlinedInput
                    {...field}
                    placeholder="Input your personal number..."
                    type="text"
                    sx={{
                      color: 'white',
                      "&.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#848AB0"
                      },
                    }}
                    startAdornment={
                      <PersonIcon className='mr-2'/>
                    }
                  />
                  {/* {errors.pernr ? <FormHelperText>{errors.pernr.message}</FormHelperText> : null} */}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <FormControl error={Boolean(errors.password)} className='gap-[10px]'>
                  <Typography fontWeight={400} fontSize={16} lineHeight={'18.8px'} color="white">
                    Password
                  </Typography>
                  <OutlinedInput
                    {...field}
                    sx={{
                      color: 'white',
                      "&.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#848AB0"
                      },
                    }}
                    startAdornment={
                      <LockIcon className='mr-2'/>
                    }
                    endAdornment={
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          padding: 0,
                          paddingLeft: '0.5rem',
                        }}
                      >
                        {showPassword ? (
                          <Eye color='white' size={20}/>
                        ) : (
                          <EyeOff color='white' size={20}/>
                        )}
                      </IconButton>
                    }
                    placeholder="Input your password..."
                    type={showPassword ? 'text' : 'password'}
                  />
                  {/* {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null} */}
                </FormControl>
              )}
            />
          </div>
        </Stack>
        <Button
          disabled={isPending}
          type="submit"
          sx={{
            background: 'radial-gradient(100% 100% at 51.89% 0%, #306BFF 0%, #083EC6 100%)',
            color: 'white', // Ensure the text color contrasts well with the background
          }}
        >
          Sign in
        </Button>
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
