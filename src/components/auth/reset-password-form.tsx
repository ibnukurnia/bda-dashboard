'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { authClient } from '@/lib/auth/client';

const schema = zod.object({ email: zod.string().min(1, { message: 'Email is required' }).email() });

type Values = zod.infer<typeof schema>;

const defaultValues = { email: '' } satisfies Values;

export function ResetPasswordForm(): React.JSX.Element {
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

      const { error } = await authClient.resetPassword(values);

      if (error) {
        setError('root', { type: 'server', message: error });
        setIsPending(false);
        return;
      }

      setIsPending(false);

      // Redirect to confirm password reset
    },
    [setError]
  );

  return (
    <Stack spacing={4}>
      <Typography variant="h5" color="white">Reset password</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)} sx={{ '& .MuiOutlinedInput-root': { borderColor: 'white' } }}>
                <InputLabel sx={{ color: 'white' }}>Email address</InputLabel>
                <OutlinedInput
                  {...field}
                  label="Email address"
                  type="email"
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'white', // Change border color to white
                    },
                    color: 'white', // Change text color to white
                  }}
                />
                {errors.email ? <FormHelperText sx={{ color: 'white' }}>{errors.email.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          <Button disabled={isPending} type="submit" sx={{
            backgroundColor: '#F59823',
            color: 'white', // Ensure the text color contrasts well with the background
            '&:hover': {
              backgroundColor: '#e0861e', // Optionally define a hover color
            },
          }}>
            Send recovery link
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}