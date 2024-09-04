import { ColumnOption } from '@/types/anomaly';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';

interface FilterGraphAnomalyProps {
    scaleOptions: ColumnOption[];
    currentSelectedScales: ColumnOption[];
    servicesOptions: string[];
    currentSelectedService: string;
    onApplyFilters: (selectedScales: ColumnOption[], selectedService: string) => void; // Separate filters for anomalies and services
}

const FilterGraphAnomaly: React.FC<FilterGraphAnomalyProps> = ({
    scaleOptions,
    currentSelectedScales,
    servicesOptions,
    currentSelectedService,
    onApplyFilters,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedScaleOptions, setSelectedScaleOptions] = useState<ColumnOption[]>(currentSelectedScales);
    const [filteredServicesOptions, setFilteredServicesOptions] = useState(servicesOptions)
    const [selectedServiceOptions, setSelectedServiceOptions] = useState<string>(currentSelectedService);
    const [searchValue, setSearchValue] = useState('')
    const panelRef = useRef<HTMLDivElement>(null);

    const togglePanel = () => {
        setIsOpen(!isOpen);
    };

    const handleScaleChange = (value: ColumnOption) => {
        setSelectedScaleOptions((prev) => (
            prev.includes(value)
                ? prev.filter((option) => option.name !== value.name)
                : [...prev, value]
        ));
    };

    const handleServiceChange = (value: string) => {
        setSelectedServiceOptions(value);
    };

    const handleApply = () => {
        onApplyFilters
            (selectedScaleOptions,
                selectedServiceOptions,
            );
        setIsOpen(false); // Close the panel after applying filters
    };

    const handleReset = () => {
        setSelectedScaleOptions([]);
        setSelectedServiceOptions('');
    };

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value)
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                setIsOpen(false); // Close the panel when clicking outside of it
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    useEffect(() => {
        setFilteredServicesOptions(servicesOptions.filter(option => option.includes(searchValue)))
    }, [searchValue])

    useEffect(() => {
        setFilteredServicesOptions(servicesOptions)
    }, [servicesOptions])

    // useEffect(() => {
    //     console.log('Scale Options:', scaleOptions);
    // }, [scaleOptions]);


    return (
        <div className="flex">
            <button
                className="font-medium rounded-lg text-sm py-3 ps-4 pe-9 text-white text-center bg-blue-700 hover:bg-blue-800 inline-flex items-center gap-2"
                onClick={togglePanel}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-4"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
                    />
                </svg>
                Filter
            </button>
            {isOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div ref={panelRef} className="bg-white rounded-lg p-6 w-96 flex flex-col gap-1">
                        <h2 className="text-xl font-semibold mb-10 text-center">Select Filter</h2>

                        <div className="">
                            <h3 className="font-semibold mb-3 text-lg">Scale</h3>
                            <div className="overflow-y-auto max-h-40">
                                {scaleOptions.length > 0 ? (
                                    scaleOptions.map((option) => (
                                        <label key={option.name} className="flex items-center justify-between mb-2">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    value={option.name}
                                                    checked={selectedScaleOptions.some(selected => selected.name === option.name)}
                                                    onChange={() => handleScaleChange(option)}
                                                    className="mr-2"
                                                />
                                                {option.comment}
                                            </div>
                                        </label>
                                    ))
                                ) : (
                                    <p>No options available</p>
                                )}
                            </div>
                        </div>

                        <hr className="w-auto h-1 mx-auto bg-gray-700 border-0 rounded" />

                        <div className="w-full">
                            <h3 className="font-semibold mb-3 text-lg">Services</h3>
                            {servicesOptions.length > 0 ? (
                                <>
                                    <input
                                        className="w-full text-black border border-gray-300 bg-light-700 hover:bg-light-800 focus:ring-2 focus:outline-none font-medium rounded-lg text-sm flex justify-between items-center p-2 mb-2"
                                        placeholder='Search service'
                                        value={searchValue}
                                        onChange={handleSearch}
                                    />
                                    <div className="overflow-y-auto max-h-40">
                                        {filteredServicesOptions.map((service, index) => (
                                            <label key={index} className="flex items-center justify-between mb-2">
                                                <div className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        value={service}
                                                        checked={selectedServiceOptions === service}
                                                        onChange={() => handleServiceChange(service)}
                                                        className="mr-2"
                                                    />
                                                    {service}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <p>No services available</p>
                            )}
                        </div>

                        <div className="flex justify-between mt-10 space-x-4">
                            <button className="bg-white text-blue-600 border border-primary-blue px-4 py-2 rounded-lg flex-1 text-center" onClick={handleReset}>
                                RESET
                            </button>
                            <button
                                className="bg-blue-600 hover:bg-blue-800 disabled:bg-gray-200 disabled:text-gray-400 text-white px-4 py-2 rounded-lg flex-1 text-center"
                                disabled={selectedScaleOptions.length === 0 || selectedServiceOptions.length === 0}
                                onClick={handleApply}
                            >
                                TERAPKAN
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterGraphAnomaly;
