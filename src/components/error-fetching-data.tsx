import React from 'react';
import { Typography } from '@mui/material';

const ErrorFetchingData: React.FC = () => {
    return (
        <Typography variant="h5" component="h5" color="white">
            Failed To Fetch Data
        </Typography>
    );
};

export default ErrorFetchingData;
