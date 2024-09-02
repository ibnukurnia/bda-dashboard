import React, { useEffect, useRef, useState } from 'react';

interface CheckboxOption {
    id: string;
    label: string;
    type: string;
}

interface FilterPanelProps {
    checkboxOptions: CheckboxOption[];
    servicesOptions: string[];
    onApplyFilters: (filters: { selectedAnomalies: string[], selectedServices: string[] }) => void; // Separate filters for anomalies and services
    onResetFilters: () => void;
    hasErrorFilterAnomaly: boolean;
    hasErrorFilterService: boolean;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ checkboxOptions, servicesOptions, onApplyFilters, onResetFilters, hasErrorFilterAnomaly, hasErrorFilterService }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedAnomalyOptions, setSelectedAnomalyOptions] = useState<string[]>([]);
    const [selectedServiceOptions, setSelectedServiceOptions] = useState<string[]>([]);
    const panelRef = useRef<HTMLDivElement>(null);

    const togglePanel = () => {
        setIsOpen(!isOpen);
    };

    const handleAnomalyChange = (value: string) => {
        setSelectedAnomalyOptions((prev) => (
            prev.includes(value)
                ? prev.filter((option) => option !== value)
                : [...prev, value]
        ));
    };

    const handleServiceChange = (value: string) => {
        setSelectedServiceOptions((prev) => (
            prev.includes(value)
                ? prev.filter((option) => option !== value)
                : [...prev, value]
        ));
    };

    const handleApply = () => {
        onApplyFilters({
            selectedAnomalies: selectedAnomalyOptions,
            selectedServices: selectedServiceOptions,
        });
        setIsOpen(false); // Close the panel after applying filters
    };

    const handleReset = () => {
        setSelectedAnomalyOptions([]);
        setSelectedServiceOptions([]);
        onResetFilters();
    };

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

    return (
        <div className="flex self-end">
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
                        <h2 className="text-xl font-semibold mb-10 text-center">Multiple Filter</h2>

                        <div>
                            <h3 className="font-semibold mb-3 text-lg">Anomaly</h3>
                            <div className="overflow-y-auto max-h-40">
                                {hasErrorFilterAnomaly ? (
                                    <p className="text-red-500">An error occurred while loading options. Please try again later.</p>
                                ) : (
                                    checkboxOptions.length > 0 ? (
                                        checkboxOptions.map((option) => (
                                            <label key={option.id} className="flex items-center justify-between mb-2">
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        value={option.id}
                                                        checked={selectedAnomalyOptions.includes(option.id)}
                                                        onChange={() => handleAnomalyChange(option.id)}
                                                        className="mr-2"
                                                    />
                                                    {option.label}
                                                </div>
                                            </label>
                                        ))
                                    ) : (
                                        <p>No options available</p>
                                    )
                                )}
                            </div>
                        </div>
                        <hr className="w-auto h-1 mx-auto bg-gray-700 border-0 rounded" />

                        <div>
                            <h3 className="font-semibold mb-3 text-lg">Services</h3>
                            <div className="overflow-y-auto max-h-40">
                                {hasErrorFilterService ? (
                                    <p className="text-red-500">An error occurred while fetching services. Please try again later.</p>
                                ) : servicesOptions.length > 0 ? (
                                    servicesOptions.map((service, index) => (
                                        <label key={index} className="flex items-center justify-between mb-2">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    value={service}
                                                    checked={selectedServiceOptions.includes(service)}
                                                    onChange={() => handleServiceChange(service)}
                                                    className="mr-2"
                                                />
                                                {service}
                                            </div>
                                        </label>
                                    ))
                                ) : (
                                    <p>No services available</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between mt-10 space-x-4">
                            <button className="bg-white text-blue-600 border border-primary-blue px-4 py-2 rounded-lg flex-1 text-center" onClick={handleReset}>
                                RESET
                            </button>
                            <button className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex-1 text-center" onClick={handleApply}>
                                TERAPKAN
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterPanel;
