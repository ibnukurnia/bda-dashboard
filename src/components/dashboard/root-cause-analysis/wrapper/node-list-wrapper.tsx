import React from "react";
import { Skeleton } from "@mui/material";

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
            animation="wave"
            sx={{ bgcolor: 'grey.800' }}
            variant="rounded"
            width={"100%"}
            height={20}
          />
          <Skeleton
            animation="wave"
            sx={{ bgcolor: 'grey.800', fontSize: '1.5rem' }}
            variant="rounded"
            width={"75%"}
            height={20}
          />
          <Skeleton
            animation="wave"
            sx={{ bgcolor: 'grey.800', fontSize: '1.5rem' }}
            variant="rounded"
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
