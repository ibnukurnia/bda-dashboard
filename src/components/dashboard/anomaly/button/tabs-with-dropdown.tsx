'use client';

import React, { useRef, useState } from 'react';
import useOnClickOutside from '@/hooks/use-on-click-outside';
import { TAB_DATA_SOURCE } from '../../../../constants';
import { useRouter, useSearchParams } from 'next/navigation';

// Interface for the component props
interface TabsWithDropdownProps {
  selectedDataSource: string; // The currently selected data source
}

// Main component for rendering tabs with optional dropdowns
const TabsWithDropdown: React.FC<TabsWithDropdownProps> = ({ selectedDataSource }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showDropdown, setShowDropdown] = useState(-1); // State to manage the visibility of first-level dropdowns
  const [showSecondLevelDropdown, setShowSecondLevelDropdown] = useState<{ [key: number]: number }>({}); // State to manage visibility of second-level dropdowns

  const dropdownRef = useRef<HTMLDivElement>(null); // Reference for detecting clicks outside the dropdown

  // Close all dropdowns when a click outside the component is detected
  useOnClickOutside(dropdownRef, () => {
    setShowDropdown(-1); // Hide all first-level dropdowns
    setShowSecondLevelDropdown({}); // Reset all second-level dropdowns
  });

  // Determine the active tab based on the selected data source
  const activeTab = TAB_DATA_SOURCE.find(ds =>
    ds.children.some(child =>
      child.namespace === selectedDataSource ||
      (child.children && child.children.some(subChild => subChild.namespace === selectedDataSource))
    )
  );

  // Toggle the visibility of a first-level dropdown
  const handleTabClick = (index: number) => {
    setShowDropdown(index === showDropdown ? -1 : index);
  };

  // Toggle the visibility of a second-level dropdown
  const handleSecondLevelClick = (tabIndex: number, childIndex: number) => {
    setShowSecondLevelDropdown(prev => ({
      ...prev,
      [tabIndex]: prev[tabIndex] === childIndex ? -1 : childIndex,
    }));
  };

  // Handle selection of a data source from the dropdown
  const handleDropdownClick = (dataSource: string) => {
    const currentParams = new URLSearchParams(searchParams?.toString() || '');

    // Update the data_source query parameter
    currentParams.set('data_source', dataSource);

    // Remove unrelated query parameters
    const currentParamKeys = searchParams.keys();
    currentParamKeys.forEach(key => {
      if (!['data_source', 'time_range'].includes(key)) currentParams.delete(key);
    });

    // Generate the new URL
    const newUrl = `/dashboard/anomaly-detection?${currentParams.toString()}`;

    // Replace the current URL without re-rendering or adding to browser history
    router.replace(newUrl);

    // Close all dropdowns
    setShowDropdown(-1);
    setShowSecondLevelDropdown({});
  };

  return (
    <div className="flex flex-row justify-between">
      {/* Container for the tabs and dropdowns */}
      <div className="flex flex-row gap-6 container-button-x p-3" ref={dropdownRef}>
        {TAB_DATA_SOURCE.map((ds, i) => (
          <div className="container-button relative inline-block z-50" key={ds.textLabel}>
            {/* Tab button */}
            <button
              onClick={() => handleTabClick(i)}
              className={`flex items-center px-4 py-2 border rounded text-white ${activeTab?.textLabel === ds.textLabel ? 'active' : 'bg-transparent'} transition duration-300 ease-in-out`}
            >
              {/* Optional icon */}
              {ds.children && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* SVG paths */}
                </svg>
              )}
              {ds.textLabel}
              {/* Dropdown indicator */}
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

            {/* First-level dropdown */}
            {showDropdown === i && (
              <div className="absolute mt-4 w-full bg-[#05061e] border-2 border-[#004889] rounded shadow-lg z-10">
                {ds.children &&
                  ds.children.map((child, childIndex) => (
                    <div key={child.textLabel} className="relative">
                      {/* Second-level dropdown trigger */}
                      {child.children ? (
                        <div>
                          <button
                            onClick={() => handleSecondLevelClick(i, childIndex)}
                            className="text-white block w-full text-left px-5 py-4 text-sm transition duration-300 ease-in-out flex justify-between items-center"
                          >
                            {child.textLabel}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                          </button>

                          {/* Second-level dropdown */}
                          {showSecondLevelDropdown[i] === childIndex && (
                            <div className="absolute left-full top-0 mt-0 ml-2 bg-[#05061e] border-2 border-[#004889] rounded shadow-lg z-10 w-48">
                              {child.children.map((subChild) => (
                                <button
                                  key={subChild.namespace}
                                  onClick={() => handleDropdownClick(subChild.namespace)}
                                  className={`block w-full text-left px-5 py-4 text-sm ${subChild.namespace === selectedDataSource
                                    ? 'text-blue-400'
                                    : 'text-[#fff]'
                                    } transition duration-300 ease-in-out`}
                                >
                                  {subChild.textLabel}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        // First-level dropdown item without children
                        <button
                          onClick={() => handleDropdownClick(child.namespace)}
                          className={`text-black block w-full text-left px-5 py-4 text-sm ${child.namespace === selectedDataSource ? 'text-blue-400' : 'text-white'} transition duration-300 ease-in-out`}
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
