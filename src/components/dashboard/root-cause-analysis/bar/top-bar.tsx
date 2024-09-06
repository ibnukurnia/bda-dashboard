import React from 'react';
import { Typography } from '@mui/material';

interface TopBarProps {
  title: string;
  subtitle?: string;
}

const TopBar: React.FC<TopBarProps> = ({ title, subtitle }) => {
  return (
    <div className="w-48 h-16">
      <Typography
        variant="subtitle1"
        color={'white'}
      >
        {title}
      </Typography>
      <hr />
      <Typography
        variant="subtitle1"
        color={'white'}
      >
        {subtitle}
      </Typography>
    </div>
  );
};

export default TopBar;
