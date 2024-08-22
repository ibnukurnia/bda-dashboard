// components/OverviewAlertStack.tsx
'use-client'

import React from 'react';
import Typography from '@mui/material/Typography';


interface OverviewAlertStackProps {
    pathname: string;
}

const OverviewAlertStack: React.FC<OverviewAlertStackProps> = ({ pathname }) => {
    let alert = 0;
    let alertDescription = "There is no something wrong or ano..";

    switch (pathname) {
        case '/dashboard':
            alert = 0;
            break;
        case '/dashboard/anomaly-detection':
            alert = 3;
            break;
        case '/situation':
            alert = 1;
            break;
        default:
            break;
    }

    return (
        <div className='inline-flex content-center items-center gap-3 bg-black p-2 rounded-xl'>
            <div className='bg-gray-400 px-2 py-1 rounded-2xl'>{alert}</div>
            <Typography variant="h6" component="h2" color="green">
                {alertDescription}
            </Typography>
        </div>
    );
};

export default OverviewAlertStack;
