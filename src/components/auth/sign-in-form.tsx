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
import { IconButton, FormHelperText } from '@mui/material';
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
    mode: 'onChange',
    defaultValues: {
      pernr: '',
      password: '',
    },
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = useCallback(
    async (values: LoginValues): Promise<void> => {
      setIsPending(true);

      try {
        await LoginUsecase(values);
        // console.log(values);
        router.push('/dashboard');
      } catch (error) {
        const errString = handleError(error);
        setError('root', { type: 'server', message: errString });
        return;
      } finally {
        setIsPending(false);
        await checkSession?.();
        router.refresh();
      }
    },
    [checkSession, router, errors]
  );

  return (
    <Stack spacing={4}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[25px]">
        <Stack spacing={1}>
          <div className="flex flex-col gap-[10px]">
            <Typography fontWeight={700} fontSize={20} lineHeight={'24.38px'} color="white">
              Welcome to OpsVision! 👋🏻
            </Typography>
            <Typography fontWeight={400} fontSize={16} lineHeight={'18.8px'} color="white">
              Please sign-in to your account
            </Typography>
          </div>
          {errors.root && <Alert severity="error">{errors.root.message}</Alert>}
        </Stack>
        <Stack spacing={2} className="gap-[10px]">
          <div className="flex flex-col gap-[25px]">
            <Controller
              control={control}
              name="pernr"
              render={({ field }) => (
                <FormControl error={Boolean(errors.pernr)} className="gap-[7px]">
                  <Typography
                    fontWeight={400}
                    fontSize={14}
                    lineHeight={"16.45px"}
                    color={errors.pernr ? "#D23636" : "white"}
                  >
                    Personal Number
                  </Typography>
                  <OutlinedInput
                    {...field}
                    placeholder="Input your personal number..."
                    type="text"
                    sx={{
                      color: "white",
                      backgroundColor: "transparent !important",
                      "&.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                        borderColor: errors.pernr ? "#D23636" : "#848AB0",
                      },
                      fontSize: "14px",
                      fontWeight: 500,
                    }}
                    startAdornment={
                      <PersonIcon className="mr-2" color={errors.pernr ? "#D23636" : "white"} />
                    }
                  />
                  {errors.pernr && (
                    <FormHelperText error sx={{ margin: 0 }} color="#D23636">
                      {errors.pernr.message || "Personal number is required"}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <FormControl error={Boolean(errors.password)} className="gap-[7px]">
                  <Typography
                    fontWeight={400}
                    fontSize={14}
                    lineHeight={"16.45px"}
                    color={errors.password ? "#D23636" : "white"}
                  >
                    Password
                  </Typography>
                  <OutlinedInput
                    {...field}
                    sx={{
                      color: "white",
                      backgroundColor: "transparent !important",
                      "&.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                        borderColor: errors.password ? "#D23636" : "#848AB0",
                      },
                      fontSize: "14px",
                      fontWeight: 500,
                    }}
                    startAdornment={
                      <LockIcon className="mr-2" color={errors.password ? "#D23636" : "white"} />
                    }
                    endAdornment={
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          padding: 0,
                          paddingLeft: "0.5rem",
                        }}
                      >
                        {showPassword ? <Eye color="white" size={15} /> : <EyeOff color="white" size={15} />}
                      </IconButton>
                    }
                    placeholder="Input your password..."
                    type={showPassword ? "text" : "password"}
                  />
                  {errors.password && (
                    <FormHelperText error sx={{ margin: 0 }} color="#D23636">
                      {errors.password.message || "Password is required"}
                    </FormHelperText>
                  )}
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
            color: 'white',
          }}
        >
          Sign in
        </Button>
      </form>
      <Stack
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
      ></Stack>
    </Stack>
  );
}
