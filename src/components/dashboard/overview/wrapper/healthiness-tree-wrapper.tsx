import React from "react";
import { Skeleton } from "@mui/material";

interface HealthinessTreeWrapperProps {
  children: React.ReactNode;
  isLoading?: boolean;
  isError?: boolean;
}

const HealthinessTreeWrapper: React.FC<HealthinessTreeWrapperProps> = ({
  children,
  isLoading,
  isError,
}) => {
  if (isError) return (
    <span className="text-center text-white absolute top-1/2 w-full left-0">
      Terjadi kesalahan. Silakan refresh halaman ini atau coba beberapa saat lagi
    </span>
  )
  if (isLoading) return (
    <Skeleton
      className="flex flex-col flex-grow"
      animation="wave"
      sx={{ bgcolor: 'grey.800', minWidth: 250 }}
      variant="rounded"
      height={450}
    />
  )
  return children
};

export default HealthinessTreeWrapper;
