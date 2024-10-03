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
    <div className="chart-section">
      {Array.from(Array(5), (_, i) => (
        <div className={`chart-section-col chart-section-col-${i + 1} flex flex-col gap-2`} key={i}>
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
        </div>
      ))}
    </div>
  )
  return children
};

export default GraphWrapper;
