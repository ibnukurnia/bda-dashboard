import React from "react";
import { Skeleton } from "@mui/material";

interface TableServicesWrapperProps {
  children: React.ReactNode;
  isLoading?: boolean;
}

const TableServicesWrapper: React.FC<TableServicesWrapperProps> = ({
  children,
  isLoading,
}) => {
  if (isLoading) return (
    <div className='w-full flex flex-col gap-6'>
      <div className='flex justify-between'>
        <div className="h-5 flex items-center">
          <Skeleton
            animation="wave"
            sx={{ bgcolor: 'grey.800' }}
            variant="rounded"
            width={"100px"}
          />
        </div>
          <div
            className="h-5 flex gap-2 items-center"
          >
            {Array.from(Array(3), (_, i) => (
              <Skeleton
                key={i}
                animation="wave"
                sx={{ bgcolor: 'grey.800' }}
                variant="rounded"
                width={"100px"}
              />
            ))}
          </div>
      </div>
      <div className='flex flex-col gap-4'>
        {Array.from(Array(5), (_, i) => (
          <div key={i} className='flex justify-between'>
            <div className="h-5 flex items-center">
              <Skeleton
                animation="wave"
                sx={{ bgcolor: 'grey.800' }}
                variant="rounded"
                width={"75px"}
              />
            </div>
            <div
              className="h-5 flex gap-2 items-center"
            >
              {Array.from(Array(3), (_, i) => (
                <div
                  key={i}
                  className="w-[100px] flex justify-center"
                >
                  <Skeleton
                    animation="wave"
                    sx={{ bgcolor: 'grey.800' }}
                    variant="rounded"
                    width={"75px"}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
  return children
};

export default TableServicesWrapper;
