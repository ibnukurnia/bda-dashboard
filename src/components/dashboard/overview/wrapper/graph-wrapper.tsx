import React from "react";
import { Skeleton } from "@mui/material";

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
        <div className={`chart-section-col chart-section-col-${i + 1}`} key={i}>
          <Skeleton
            animation="wave"
            sx={{ bgcolor: 'grey.800', fontSize: '1.5rem', marginTop: '-8px' }}
            variant="text"
            width={"75px"}
          />
          <Skeleton
            animation="wave"
            sx={{ bgcolor: 'grey.800', fontSize: '1.5rem', marginTop: '-8px' }}
            variant="text"
            width={"75px"}
          />
          <Skeleton
            animation="wave"
            sx={{ bgcolor: 'grey.800' }}
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
