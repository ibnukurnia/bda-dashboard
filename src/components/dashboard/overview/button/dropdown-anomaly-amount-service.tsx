import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import Button from '@/components/system/Button/Button';
import Skeleton from '@/components/system/Skeleton/Skeleton';
import { GetAmountServiceList } from '@/modules/usecases/overviews';
import useDebounce from '@/hooks/use-debounce';
import useUpdateEffect from '@/hooks/use-update-effect';

interface DropdownAnomalyAmountServiceProps {
  onSelectData: (value: string[]) => void;
}

const DropdownAnomalyAmountService: React.FC<DropdownAnomalyAmountServiceProps> = ({
  onSelectData,
}) => {
  const [data, setData] = useState<string[]>([])
  const [currentSelectedData, setCurrentSelectedData] = useState<string[]>(['mylta-brimo']) // Default to 'mylta-brimo'
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<number>(0);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const dropdownContainerRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    GetAmountServiceList()
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error('Error fetching services list:', err);
        setData([]); // Default to "All" if fetching fails
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  useUpdateEffect(() => {
    // If 'mylta-brimo' is available in the list, select it by default
    if (data.includes('mylta-brimo')) {
      setCurrentSelectedData(['mylta-brimo']);
      onSelectData(['mylta-brimo']);
    } else {
      onSelectData(data); // Fallback to all data if 'mylta-brimo' isn't present
    }
  }, [data])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useLayoutEffect(() => {
    const containerHeight = dropdownContainerRef.current?.clientHeight;
    const buttonPos = dropdownRef.current?.offsetTop;
    const buttonHeight = dropdownRef.current?.clientHeight;
    const emptySpaceDown = window.innerHeight + window.scrollY - (buttonHeight ?? 0);

    if (buttonPos && containerHeight && buttonPos + containerHeight > emptySpaceDown) {
      setPosition(0 - containerHeight - 4);
    } else {
      if (buttonHeight) {
        setPosition(buttonHeight + 4);
      }
    }
  }, [isOpen]);

  useDebounce(() => {
    onSelectData(currentSelectedData.length === 0 ? data : currentSelectedData)
  }, 750, [currentSelectedData]);

  const handleSelectData = (value: string) => {
    // Update the selected service in state
    setCurrentSelectedData((prevs) =>
      prevs.some(prev => prev === value) ?
        prevs.filter(prev => prev !== value) :
        [...prevs, value]
    );
  };

  if (isLoading) return (
    <Skeleton width={200} height={48} />
  )

  return (
    <div className="relative inline-block text-left self-end" ref={dropdownRef}>
      <Button onClick={toggleDropdown}>
        {currentSelectedData.length === 0 || currentSelectedData.length === data.length ?
          'All' : currentSelectedData.join(", ")}
        <svg
          className="w-2.5 h-2.5 ml-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
        </svg>
      </Button>

      {isOpen && (
        <div
          ref={dropdownContainerRef}
          style={{ top: position }}
          className={`absolute right-0 bg-white rounded-lg shadow-lg z-50 flex w-[auto] max-h-96 overflow-auto scrollbar`}
        >
          <ul className="text-sm text-gray-800 w-48">
            <li>
              <div
                onClick={() => setCurrentSelectedData([])}
                className="cursor-pointer block px-4 py-3 hover:bg-gray-200 hover:rounded-lg"
              >
                <input
                  type="checkbox"
                  checked={currentSelectedData.length === 0 || currentSelectedData.length === data.length}
                  className="mr-2"
                  readOnly
                />
                All
              </div>
            </li>
            {data.map((dataSelection, dsid) => (
              <li key={dsid}>
                <div
                  onClick={() => handleSelectData(dataSelection)}
                  className="cursor-pointer block px-4 py-3 hover:bg-gray-200 hover:rounded-lg"
                >
                  <input
                    type="checkbox"
                    checked={currentSelectedData.includes(dataSelection)}
                    className="mr-2"
                    readOnly
                  />
                  {dataSelection}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownAnomalyAmountService;
