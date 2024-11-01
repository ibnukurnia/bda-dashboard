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

  const [showDropdown, setShowDropdown] = useState(-1);
  const [showSecondLevelDropdown, setShowSecondLevelDropdown] = useState<{ [key: number]: number }>({}); // State to manage second-level dropdown visibility

  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(dropdownRef, () => {
    setShowDropdown(-1);
    setShowSecondLevelDropdown({});
  });

  // Updated activeTab logic to check both levels of children
  const activeTab = TAB_DATA_SOURCE.find(ds =>
    ds.children.some(child =>
      child.namespace === selectedDataSource ||
      (child.children && child.children.some(subChild => subChild.namespace === selectedDataSource))
    )
  );


  const handleTabClick = (index: number) => {
    setShowDropdown(index === showDropdown ? -1 : index); // Toggle the dropdown visibility
  };

  const handleSecondLevelClick = (tabIndex: number, childIndex: number) => {
    setShowSecondLevelDropdown(prev => ({
      ...prev,
      [tabIndex]: prev[tabIndex] === childIndex ? -1 : childIndex, // Toggle second-level dropdown
    }));
  };

  const handleDropdownClick = (dataSource: string) => {
    console.log('Selected Data Source:', dataSource);

    // Get current query parameters
    const currentParams = new URLSearchParams(searchParams?.toString() || '');

    // Set the new data source
    currentParams.set('data_source', dataSource);

    // Clear the selected options
    currentParams.delete("anomaly");
    currentParams.delete("severity");
    currentParams.delete("cluster");
    currentParams.delete("operation");
    currentParams.delete("service");
    currentParams.delete("network");
    currentParams.delete("node");
    currentParams.delete("interface");
    currentParams.delete("category");
    currentParams.delete("domain");

    // Force update the URL and disable reactivity
    const newUrl = `/dashboard/anomaly-detection?${currentParams.toString()}`;

    console.log('Navigating to:', newUrl);

    // Replace the URL without triggering a re-render or unnecessary history push
    router.replace(newUrl);

    // Close dropdowns
    setShowDropdown(-1);
    setShowSecondLevelDropdown({});
  };


  return (
    <div className="flex flex-row justify-between">
      <div className="flex flex-row gap-6 container-button-x p-3" ref={dropdownRef}>
        {TAB_DATA_SOURCE.map((ds, i) => (
          <div className="container-button relative inline-block z-50" key={ds.textLabel}>
            <button
              onClick={() => handleTabClick(i)}
              className={`flex items-center px-4 py-2 border rounded text-white ${activeTab?.textLabel === ds.textLabel ? 'active' : 'bg-transparent'} transition duration-300 ease-in-out`}
            >
              {ds.children && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* SVG paths */}
                </svg>
              )}
              {ds.textLabel}
              {ds.children && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`ml-2 transition-transform ${showDropdown === i ? 'rotate-180' : 'rotate-0'}`}
                >
                  <path d="M6 9L12 15L18 9H6Z" fill="#FFFFF7" />
                </svg>
              )}
            </button>

            {/* First Level Dropdown */}
            {showDropdown === i && (
              <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded shadow-lg z-10">
                {ds.children &&
                  ds.children.map((child, childIndex) => (
                    <div key={child.textLabel} className="relative">
                      {/* Second Level Dropdown Trigger */}
                      {child.children ? (
                        <div>
                          <button
                            onClick={() => handleSecondLevelClick(i, childIndex)}
                            className="text-black block w-full text-left px-5 py-4 text-sm hover:bg-blue-100 transition duration-300 ease-in-out flex justify-between items-center"
                          >
                            {child.textLabel}

                            {/* Arrow SVG added to first-level dropdown with children */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>

                          </button>

                          {/* Second Level Dropdown */}
                          {showSecondLevelDropdown[i] === childIndex && (
                            <div className="absolute left-full top-0 mt-0 ml-2 bg-white border border-gray-200 rounded shadow-lg z-10 w-48">
                              {child.children.map((subChild) => (
                                <button
                                  key={subChild.namespace}
                                  onClick={() => handleDropdownClick(subChild.namespace)}
                                  className={`text-black block w-full text-left px-5 py-4 text-sm ${subChild.namespace === selectedDataSource
                                    ? 'text-blue-600'
                                    : 'text-black'
                                    } transition duration-300 ease-in-out hover:bg-blue-100`}
                                >
                                  {subChild.textLabel}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => handleDropdownClick(child.namespace)}
                          className={`text-black block w-full text-left px-5 py-4 text-sm ${child.namespace === selectedDataSource ? 'text-blue-600' : 'text-black'
                            } transition duration-300 ease-in-out hover:bg-blue-100`}
                        >
                          {child.textLabel}
                        </button>
                      )}
                    </div>
                  ))}
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
};

export default TabsWithDropdown;
