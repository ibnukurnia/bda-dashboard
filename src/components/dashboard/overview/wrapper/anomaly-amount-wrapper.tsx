import Skeleton from "@/components/system/Skeleton/Skeleton";
import React from "react";

interface AnomalyAmountWrapperProps {
  children: React.ReactNode;
  isLoading?: boolean;
}

const AnomalyAmountWrapper: React.FC<AnomalyAmountWrapperProps> = ({
  children,
  isLoading,
}) => {
  if (isLoading) return (
    <Skeleton
      width={"100%"}
      height={300}
    />
  )
  return children
};

export default AnomalyAmountWrapper;
