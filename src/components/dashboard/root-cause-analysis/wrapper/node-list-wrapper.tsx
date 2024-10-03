import Skeleton from "@/components/system/Skeleton/Skeleton";
import React from "react";

interface NodeListWrapperProps {
  children: React.ReactNode;
  isLoading?: boolean;
  nodeCount: number;
}

const NodeListWrapper: React.FC<NodeListWrapperProps> = ({
  children,
  isLoading,
  nodeCount,
}) => {
  if (isLoading) return (
    <div className="h-[80px] flex flex-col gap-2">
      {Array.from(Array(nodeCount), (_, i) => (
        <div className={"w-full flex flex-col gap-1"} key={i}>
          <Skeleton
            width={"100%"}
            height={20}
          />
          <Skeleton
            customStyle={{ fontSize: '1.5rem' }}
            width={"75%"}
            height={20}
          />
          <Skeleton
            customStyle={{ fontSize: '1.5rem' }}
            width={"75px"}
            height={20}
          />
        </div>
      ))}
    </div>
  )
  return children
};

export default NodeListWrapper;
