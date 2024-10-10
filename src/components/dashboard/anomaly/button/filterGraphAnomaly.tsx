import { ClusterOptionResponse } from '@/modules/models/anomaly-predictions';
import { ColumnOption } from '@/types/anomaly';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';

interface FilterGraphAnomalyProps {
    scaleOptions: ColumnOption[];
    currentSelectedScales: ColumnOption[];
    clusterOptions: ClusterOptionResponse[] | null | undefined;
    currentSelectedCluster: ClusterOptionResponse[];
    servicesOptions: string[] | null | undefined;
    currentSelectedService: string | null;
    onApplyFilters: (selectedScales: ColumnOption[], selectedCluster: ClusterOptionResponse[], selectedService: string | null) => void; // Separate filters for anomalies and services
}

const FilterGraphAnomaly: React.FC<FilterGraphAnomalyProps> = ({
    scaleOptions,
    currentSelectedScales,
    clusterOptions,
    currentSelectedCluster,
    servicesOptions,
    currentSelectedService,
    onApplyFilters,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedScaleOptions, setSelectedScaleOptions] = useState<ColumnOption[]>(currentSelectedScales);
    const [selectedClusterOptions, setSelectedClusterOptions] = useState<ClusterOptionResponse[]>(currentSelectedCluster);
    const [filteredServicesOptions, setFilteredServicesOptions] = useState(servicesOptions)
    const [selectedServiceOptions, setSelectedServiceOptions] = useState<string | null>(currentSelectedService);
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

    const handleClusterChange = (value: ClusterOptionResponse) => {
        setSelectedClusterOptions((prev) => (
            prev.includes(value)
                ? prev.filter((option) => option !== value)
                : [...prev, value]
        ));
    };

    const handleServiceChange = (value: string) => {
        setSelectedServiceOptions(value);
    };

    const handleApply = () => {
        onApplyFilters(
            selectedScaleOptions,
            selectedClusterOptions,
            selectedServiceOptions,
        );
        setIsOpen(false); // Close the panel after applying filters
    };

    const handleReset = () => {
        setSelectedScaleOptions([]);
        setSelectedServiceOptions(null);
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
        setFilteredServicesOptions(servicesOptions?.filter(
            (option) =>
                option.toLowerCase().includes(searchValue.toLowerCase()) // Convert both to lowercase
        ) ?? []);
    }, [searchValue]);

    useEffect(() => {
        setFilteredServicesOptions(servicesOptions)
    }, [servicesOptions])

    useEffect(() => {
        setSelectedScaleOptions(currentSelectedScales)
    }, [currentSelectedScales])

    useEffect(() => {
        setSelectedServiceOptions(currentSelectedService)
    }, [currentSelectedService])

    const gridCount = 1 + (clusterOptions ? 1 : 0) + (servicesOptions ? 1 : 0)

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
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-[9999]">
                    <div
                        ref={panelRef}
                        className="bg-white rounded-lg p-6 w-full max-w-max mx-auto flex flex-col gap-4 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    >
                        <h2 className="text-xl font-semibold mb-10 text-center">Select Filter</h2>

                        <div
                            className={`grid gap-4`}
                            style={{
                                gridTemplateColumns: `repeat(${gridCount}, 1fr)`
                            }}
                        >
                            <div className="flex flex-col">
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

                            {clusterOptions && (
                                <div className="flex flex-col">
                                    <h3 className="font-semibold mb-3 text-lg">Cluster</h3>
                                    <div className="overflow-y-auto max-h-40">
                                        {clusterOptions.length > 0 ? (
                                            clusterOptions.map((option) => (
                                                <label key={option.name} className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            value={option.name}
                                                            checked={selectedClusterOptions.some(selected => selected.name === option.name)}
                                                            onChange={() => handleClusterChange(option)}
                                                            className="mr-2"
                                                        />
                                                        {option.label}
                                                    </div>
                                                </label>
                                            ))
                                        ) : (
                                            <p>No options available</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {servicesOptions && (
                                <div className="flex flex-col">
                                    <h3 className="font-semibold mb-3 text-lg">Services</h3>
                                    {servicesOptions && servicesOptions.length > 0 ? (
                                        <>
                                            <input
                                                className="w-full text-black border border-gray-300 bg-light-700 hover:bg-light-800 focus:outline-none font-medium rounded-lg text-sm flex justify-between items-center p-2 mb-2"
                                                placeholder='Search service'
                                                value={searchValue}
                                                onChange={handleSearch}
                                            />
                                            <div className="overflow-y-auto max-h-40">
                                                {filteredServicesOptions && filteredServicesOptions.map((service, index) => (
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
                            )}
                        </div>
                        <div className="flex justify-between mt-10 space-x-4">
                            <button className="bg-white text-blue-600 border border-primary-blue px-4 py-2 rounded-lg flex-1 text-center" onClick={handleReset}>
                                RESET
                            </button>
                            <button
                                className="bg-blue-600 hover:bg-blue-800 disabled:bg-gray-200 disabled:text-gray-400 text-white px-4 py-2 rounded-lg flex-1 text-center"
                                disabled={
                                    selectedScaleOptions.length === 0 ||
                                    (clusterOptions != null && selectedClusterOptions.length === 0) ||
                                    (servicesOptions != null && selectedServiceOptions == null)
                                }
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
