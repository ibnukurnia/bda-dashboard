'use client';

import React, { useRef, useState } from 'react';
import useOnClickOutside from '@/hooks/use-on-click-outside';
import { TAB_DATA_SOURCE } from '../../../../constants';
import { useRouter, useSearchParams } from 'next/navigation';

interface TabsWithDropdownProps {
  selectedDataSource: string;
}

const TabsWithDropdown: React.FC<TabsWithDropdownProps> = ({ selectedDataSource }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showDropdown, setShowDropdown] = useState(-1)

  const dropdownRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(dropdownRef, () => {
    setShowDropdown(-1)
  })

  const activeTab = TAB_DATA_SOURCE.find(ds =>
    ds.namespace === selectedDataSource ||
    (ds.children && ds.children.find(child => child.namespace === selectedDataSource)))

  const handleTabClick = (index: number) => {
    setShowDropdown(index)
  }

  const handleDropdownClick = (dataSource: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('data_source', dataSource);
    
    // Clear the selected options
    params.delete("anomaly")
    params.delete("service")

    router.push(`/dashboard/anomaly-detection?${params.toString()}`);
    setShowDropdown(-1)
  }

  return (
    <div className='flex flex-row justify-between'>
      <div className='flex flex-row gap-6 container-button-x p-3' ref={dropdownRef}>
        {TAB_DATA_SOURCE.map((ds, i) =>
          <div className="container-button relative inline-block z-[98]" key={ds.textLabel}>
            <button
              onClick={() => ds.children ? handleTabClick(i) : handleDropdownClick(ds.namespace)}
              className={`flex items-center px-4 py-2 border rounded text-white ${activeTab?.textLabel === ds.textLabel ? 'active' : 'bg-transparent'} transition duration-300 ease-in-out`}
            >
              {ds.children && 
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* SVG paths */}
                </svg>
              }
              {ds.textLabel}
              {ds.children &&
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`ml-2 transition-transform ${showDropdown === i ? 'rotate-180' : 'rotate-0'}`}>
                  <path d="M6 9L12 15L18 9H6Z" fill="#FFFFF7" />
                </svg>
              }
            </button>

            {/* Dropdown Menu */}
            {showDropdown === i && (
              <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded shadow-lg z-10">
                {ds.children && ds.children.map((child, index) => (
                  <button
                    key={child.namespace}
                    onClick={() => handleDropdownClick(child.namespace)}
                    className={`text-black block w-full text-left p-6 text-sm ${child.namespace === selectedDataSource ? 'text-blue-600' : 'text-black'} transition duration-300 ease-in-out hover:bg-blue-100`}
                  >
                    {child.textLabel}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TabsWithDropdown;
