import * as React from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { Search } from 'react-feather';

export function CompaniesFilters(): React.JSX.Element {
  return (
    <div className="max-w-lg">
      <OutlinedInput
        defaultValue=""
        fullWidth
        placeholder="Search..."
        startAdornment={
          <InputAdornment position="start">
            <Search className="text-white" fontSize="var(--icon-fontSize-md)" />
          </InputAdornment>
        }
        className="border border-secondary-darker text-white"
        sx={{
          maxWidth: '380px',
          maxHeight: '46px',
          border: '1px solid var(--Secondary-Darker, #F28E0F)',
          color: 'white',
          '::placeholder': {
            color: 'white',
          },
        }}
      />
    </div>
  );
}
