import React from "react";
import { Skeleton } from "@mui/material";

interface HealthinessGaugesWrapperProps {
  children: React.ReactNode;
  isLoading?: boolean;
  isError?: boolean;
}

const HealthinessGaugesWrapper: React.FC<HealthinessGaugesWrapperProps> = ({
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

export default HealthinessGaugesWrapper;
