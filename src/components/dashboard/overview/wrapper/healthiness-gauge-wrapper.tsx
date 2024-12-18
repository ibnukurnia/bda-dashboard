import Skeleton from "@/components/system/Skeleton/Skeleton";
import React from "react";

interface HealthinessGaugesWrapperProps {
  children: React.ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  healthinessRef: React.RefObject<HTMLDivElement>
}

const HealthinessGaugesWrapper: React.FC<HealthinessGaugesWrapperProps> = ({
  children,
  isLoading,
  isError,
  healthinessRef,
}) => {
  if (isError) return (
    <span className="text-center text-white absolute top-1/2 w-full left-0">
      Terjadi kesalahan. Silakan refresh halaman ini atau coba beberapa saat lagi
    </span>
  )
  if (isLoading) return (
    <div className="flex flex-wrap gap-8" ref={healthinessRef}>
      {Array.from(Array(6), (_, i) => (
        <Skeleton
          key={i}
          className="flex flex-col flex-grow"
          customStyle={{ minWidth: 250 }}
          height={200}
        />
      ))}
    </div>
  )
  return children
};

export default HealthinessGaugesWrapper;
