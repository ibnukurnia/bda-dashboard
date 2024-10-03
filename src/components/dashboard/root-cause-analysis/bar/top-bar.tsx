import React from 'react';
import { Typography } from '@mui/material';
import Skeleton from '@/components/system/Skeleton/Skeleton';

interface TopBarProps {
  title: string;
  subtitle?: string;
  isLoading?: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ title, subtitle, isLoading }) => {
  return (
    <div className="w-full h-16">
      <Typography
        variant="subtitle1"
        color={'white'}
      >
        {title}
      </Typography>
      <hr />
      {isLoading ?
        <Skeleton
          customStyle={{ fontSize: '1.5rem' }}
          variant="text"
          width={"100%"}
        /> :
        <Typography
          variant="subtitle1"
          color={'white'}
        >
          {subtitle}
        </Typography>
      }
    </div>
  );
};

export default TopBar;
