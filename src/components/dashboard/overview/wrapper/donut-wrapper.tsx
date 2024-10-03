import Skeleton from "@/components/system/Skeleton/Skeleton";
import React from "react";

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
      variant="circular"
      width={250}
      height={250}
    />
  )
  return children
};

export default DonutChartWrapper;
