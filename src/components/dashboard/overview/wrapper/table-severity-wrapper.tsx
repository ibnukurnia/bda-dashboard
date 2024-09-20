import React from "react";
import { Skeleton } from "@mui/material";

interface TableSeverityWrapperProps {
  children: React.ReactNode;
  isLoading?: boolean;
}

const TableSeverityWrapper: React.FC<TableSeverityWrapperProps> = ({
  children,
  isLoading,
}) => {
  if (isLoading) return (
    <div className='w-full flex flex-col gap-4'>
      <div className='grid grid-cols-2'>
        <div className="h-5 flex items-center">
          <Skeleton
            animation="wave"
            sx={{ bgcolor: 'grey.800', fontSize: '1.5rem' }}
            variant="text"
            width={"100px"}
          />
        </div>
        <div className="h-5 flex items-center m-auto">
          <Skeleton
            animation="wave"
            sx={{ bgcolor: 'grey.800', fontSize: '1.5rem' }}
            variant="text"
            width={"100px"}
          />
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        {Array.from(Array(3), (_, i) => (
          <div key={i} className='grid grid-cols-2'>
            <div className="h-5 flex items-center">
              <Skeleton
                animation="wave"
                sx={{ bgcolor: 'grey.800', fontSize: '1.5rem' }}
                variant="text"
                width={"75px"}
              />
            </div>
            <div className="h-5 flex items-center m-auto">
              <Skeleton
                animation="wave"
                sx={{ bgcolor: 'grey.800', fontSize: '1.5rem' }}
                variant="text"
                width={"75px"}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
  return children
};

export default TableSeverityWrapper;
