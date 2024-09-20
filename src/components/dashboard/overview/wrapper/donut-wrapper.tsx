import React from "react";
import { Skeleton } from "@mui/material";

interface DonutChartWrapperProps {
  children: React.ReactNode;
  isLoading?: boolean;
}

const DonutChartWrapper: React.FC<DonutChartWrapperProps> = ({
  children,
  isLoading,
}) => {
  if (isLoading) return (
    <Skeleton
      animation="wave"
      sx={{ bgcolor: 'grey.800' }}
      variant="circular"
      width={250}
      height={250}
    />
  )
  return children
};

export default DonutChartWrapper;
