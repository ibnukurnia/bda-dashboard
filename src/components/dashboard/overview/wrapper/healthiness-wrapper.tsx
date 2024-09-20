import React from "react";
import { Skeleton } from "@mui/material";

interface HealthinessChartWrapperProps {
  children: React.ReactNode;
  isLoading?: boolean;
}

const HealthinessChartWrapper: React.FC<HealthinessChartWrapperProps> = ({
  children,
  isLoading,
}) => {
  if (isLoading) return (
    <>
      {Array.from(Array(6), (_, i) => (
        <Skeleton
          key={i}
          className="flex flex-col flex-grow"
          animation="wave"
          sx={{ bgcolor: 'grey.800', minWidth: 250 }}
          variant="rounded"
          height={200}
        />
      ))}
    </>
  )
  return children
};

export default HealthinessChartWrapper;
