import Skeleton from "@/components/system/Skeleton/Skeleton";
import React from "react";

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
      customStyle={{ minWidth: 250 }}
      height={450}
    />
  )
  return children
};

export default HealthinessTreeWrapper;
