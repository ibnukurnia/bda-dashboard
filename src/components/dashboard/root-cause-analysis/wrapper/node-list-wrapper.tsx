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
    <div className="flex flex-col">
      {Array.from(Array(nodeCount), (_, i) => (
        <div className={"w-full h-[80px] flex flex-col gap-1"} key={i}>
          <Skeleton
            width={"100%"}
            height={20}
          />
          <div className="flex justify-between">
            <Skeleton
              width={"60%"}
              height={40}
            />
            <Skeleton
              width={"75px"}
              height={20}
            />
          </div>
        </div>
      ))}
    </div>
  )
  return children
};

export default NodeListWrapper;
