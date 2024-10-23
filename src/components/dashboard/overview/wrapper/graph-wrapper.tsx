import Skeleton from "@/components/system/Skeleton/Skeleton";
import React from "react";

interface GraphWrapperProps {
  children: React.ReactNode;
  isLoading?: boolean;
}

const GraphWrapper: React.FC<GraphWrapperProps> = ({
  children,
  isLoading,
}) => {
  if (isLoading) return (
    Array.from(Array(6), (_, i) => (
      <div className={`flex flex-col gap-2`} key={i}>
        <Skeleton
          height={12}
          width={"75px"}
        />
        <Skeleton
          height={12}
          width={"75px"}
        />
        <Skeleton
          variant="rounded"
          width={"100%"}
          height={230}
        />
        <Skeleton
          height={20}
          width={"125px"}
        />
      </div>
    ))
  )
  return children
};

export default GraphWrapper;
