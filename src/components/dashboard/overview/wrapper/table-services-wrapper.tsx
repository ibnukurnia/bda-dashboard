import Skeleton from "@/components/system/Skeleton/Skeleton";
import React from "react";

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
            width={"100px"}
          />
        </div>
          <div
            className="h-5 flex gap-2 items-center"
          >
            {Array.from(Array(3), (_, i) => (
              <Skeleton
                key={i}
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
                width={"75px"}
              />
            </div>
            <div
              className="h-5 flex gap-2 items-center"
            >
              {Array.from(Array(3), (_, i) => (
                <div
                  key={i}
                  className="w-[100px] h-5 flex justify-center"
                >
                  <Skeleton
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
