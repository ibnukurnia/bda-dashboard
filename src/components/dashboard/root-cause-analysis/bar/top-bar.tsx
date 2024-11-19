import React from 'react';
import { Typography } from '@mui/material';
import Skeleton from '@/components/system/Skeleton/Skeleton';

interface TopBarProps {
  title: string; // Title displayed on the top bar
  subtitle?: string; // Optional subtitle displayed below the title
  isLoading?: boolean; // Indicates whether the subtitle is loading
}

const TopBar: React.FC<TopBarProps> = ({ title, subtitle, isLoading }) => {
  return (
    <div className="w-full h-16">
      {/* Title section */}
      <Typography
        title={title} // Sets the full title as a tooltip on hover
        variant="subtitle1"
        color="white"
        noWrap // Prevents wrapping of text
        sx={{
          overflow: 'hidden', // Ensures text doesn't overflow its container
          textOverflow: 'ellipsis', // Adds ellipsis if text overflows
          whiteSpace: 'nowrap', // Keeps text on a single line
          maxWidth: '100%', // Restricts width of the text container
        }}
      >
        {title}
      </Typography>

      <hr /> {/* Separator between title and subtitle */}

      {/* Subtitle section */}
      {isLoading ? (
        // If loading, display a skeleton loader in place of the subtitle
        <Skeleton
          className="my-1" // Adds vertical margin
          width="60%" // Adjusts the skeleton width
          height={20} // Adjusts the skeleton height
        />
      ) : (
        // If not loading, display the subtitle
        <Typography
          title={subtitle} // Sets the full subtitle as a tooltip on hover
          variant="subtitle1"
          color="white"
          noWrap // Prevents wrapping of text
          sx={{
            overflow: 'hidden', // Ensures text doesn't overflow its container
            textOverflow: 'ellipsis', // Adds ellipsis if text overflows
            whiteSpace: 'nowrap', // Keeps text on a single line
            maxWidth: '100%', // Restricts width of the text container
          }}
        >
          {subtitle}
        </Typography>
      )}
    </div>
  );
};

export default TopBar;
