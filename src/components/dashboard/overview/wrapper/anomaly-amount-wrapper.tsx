import React from "react";
import { Skeleton } from "@mui/material";

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
      animation="wave"
      sx={{ bgcolor: 'grey.800' }}
      variant="rounded"
      width={"100%"}
      height={300}
    />
  )
  return children
};

export default AnomalyAmountWrapper;
