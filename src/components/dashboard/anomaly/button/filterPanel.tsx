import { DATA_SOURCE_NAMESPACE_REDIS } from '@/constants';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState, ChangeEvent } from 'react';

interface CheckboxOption {
    id: string;
    label: string;
    type: string;
}

interface SeverityOption {
    id: number;
    label: string;
    type: string;
}

interface FilterPanelProps {
    checkboxOptions: CheckboxOption[];
    servicesOptions: string[];
    severityOptions: SeverityOption[];
    onApplyFilters: (filters: { selectedAnomalies: string[], selectedSeverities: number[], selectedServices: string[] }) => void;
    onResetFilters: () => void;
    hasErrorFilterAnomaly: boolean;
    hasErrorFilterService: boolean;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
    checkboxOptions,
    servicesOptions,
    severityOptions,
    onApplyFilters,
    onResetFilters,
    hasErrorFilterAnomaly,
    hasErrorFilterService
}) => {
    const searchParams = useSearchParams();
    const selectedDataSource = searchParams.get("data_source");

    const [isOpen, setIsOpen] = useState(false);
    const [selectedAnomalyOptions, setSelectedAnomalyOptions] = useState<string[]>([]);
    const [selectedServiceOptions, setSelectedServiceOptions] = useState<string[]>([]);
    const [selectedSeverityOptions, setSelectedSeverityOptions] = useState<number[]>([]);
    const [searchValue, setSearchValue] = useState<string>(''); // For search input
    const [resetMessage, setResetMessage] = useState<boolean>(false); // State for temporary reset message
    const panelRef = useRef<HTMLDivElement>(null);

    // Filter services based on the search input
    const filteredServicesOptions = servicesOptions.filter(service =>
        service.toLowerCase().includes(searchValue.toLowerCase())
    );

    const togglePanel = () => {
        setIsOpen(!isOpen);
    };

    const handleAnomalyChange = (value: string) => {
        setSelectedAnomalyOptions((prev) =>
            prev.includes(value) ? prev.filter((option) => option !== value) : [...prev, value]
        );
    };

    const handleSeverityChange = (id: number) => {
        setSelectedSeverityOptions((prev) =>
            prev.includes(id) ? prev.filter((option) => option !== id) : [...prev, id]
        );
    };

    const handleServiceChange = (value: string) => {
        setSelectedServiceOptions((prev) =>
            prev.includes(value) ? prev.filter((option) => option !== value) : [...prev, value]
        );
    };

    const handleApply = () => {
        onApplyFilters({
            selectedAnomalies: selectedAnomalyOptions,
            selectedServices: selectedServiceOptions,
            selectedSeverities: selectedSeverityOptions
        });
        setIsOpen(false); // Close the panel after applying filters
    };

    const handleReset = () => {
        setSelectedAnomalyOptions([]);
        setSelectedSeverityOptions([]);
        setSelectedServiceOptions([]);
        setSearchValue('');
        onResetFilters();

        // Show reset confirmation message
        setResetMessage(true);
        setTimeout(() => setResetMessage(false), 2000);
    };

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const handleSelectAllAnomalies = () => {
        if (selectedAnomalyOptions.length === checkboxOptions.length) {
            setSelectedAnomalyOptions([]); // Unselect all
        } else {
            setSelectedAnomalyOptions(checkboxOptions.map((option) => option.id)); // Select all
        }
    };

    const handleSelectAllSeverities = () => {
        if (selectedSeverityOptions.length === severityOptions.length) {
            setSelectedSeverityOptions([]); // Unselect all
        } else {
            setSelectedSeverityOptions(severityOptions.map((option) => option.id)); // Select all
        }
    };

    const handleSelectAllServices = () => {
        if (selectedServiceOptions.length === servicesOptions.length) {
            setSelectedServiceOptions([]); // Unselect all
        } else {
            setSelectedServiceOptions(servicesOptions); // Select all
        }
    };

    useEffect(() => {
        const anomalies = searchParams.getAll("anomaly");
        const severities = searchParams.getAll("severity");
        const services = searchParams.getAll("service");

        setSelectedAnomalyOptions(
            anomalies.filter((anomaly) =>
                checkboxOptions.some((option) => option.id === anomaly)
            )
        );

        setSelectedSeverityOptions(
            severities
                .map(Number)
                .filter((severityId) =>
                    severityOptions.some((option) => option.id === severityId)
                )
        );

        setSelectedServiceOptions(
            services.filter((service) =>
                servicesOptions.some((option) => option === service)
            )
        );
    }, [searchParams, checkboxOptions, servicesOptions, severityOptions]);

    // Close the filter panel when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                setIsOpen(false); // Close the panel when clicking outside
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
        <div className="flex self-start z-50">
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
                    <div
                        ref={panelRef}
                        className="bg-white rounded-lg p-6 w-full max-w-max mx-auto flex flex-col gap-4 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    >
                        <h2 className="text-xl font-semibold text-center mb-2">Multiple Filter</h2>

                        <div
                            className={`grid gap-4`}
                            style={{
                                gridTemplateColumns: `repeat(${selectedDataSource !== DATA_SOURCE_NAMESPACE_REDIS ? '3' : '2'}, 1fr)`
                            }}
                        >
                            {/* Anomaly Section */}
                            <div className='flex flex-col gap-3'>
                                <div className='flex flex-col gap-2'>
                                    <h3 className="font-semibold text-lg">Anomaly</h3>
                                    <p className="text-sm text-gray-600">
                                        Selected Anomalies: <span className='text-blue-600'>{selectedAnomalyOptions.length}</span>
                                    </p>
                                    <button
                                        onClick={handleSelectAllAnomalies}
                                        className="text-blue-500 text-sm text-left"
                                    >
                                        {selectedAnomalyOptions.length === checkboxOptions.length ? 'Unselect All' : 'Select All'}
                                    </button>
                                </div>

                                <div className="overflow-y-auto max-h-56">
                                    {hasErrorFilterAnomaly ? (
                                        <p className="text-red-500">
                                            An error occurred while loading options. Please try again later.
                                        </p>
                                    ) : checkboxOptions.length > 0 ? (
                                        checkboxOptions.map((option) => (
                                            <label
                                                key={option.id}
                                                className="flex items-center justify-between mb-1"
                                            >
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
                                    )}
                                </div>
                            </div>

                            {/* Severity Section */}
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col gap-2">
                                    <h3 className="font-semibold text-lg">Severity</h3>
                                    <p className="text-sm text-gray-600">
                                        Selected Severities: <span className="text-blue-600">{selectedSeverityOptions.length}</span>
                                    </p>
                                    <button
                                        onClick={handleSelectAllSeverities}
                                        className="text-blue-500 text-sm text-blue-500 text-sm text-left"
                                    >
                                        {selectedSeverityOptions.length === severityOptions.length ? 'Unselect All' : 'Select All'}
                                    </button>
                                </div>

                                <div className="overflow-y-auto max-h-48">
                                    {hasErrorFilterAnomaly ? (
                                        <p className="text-red-500">
                                            An error occurred while loading options. Please try again later.
                                        </p>
                                    ) : severityOptions.length > 0 ? (
                                        severityOptions.map((option) => (
                                            <label key={option.id} className="flex items-center justify-between mb-1">
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        value={option.id}
                                                        checked={selectedSeverityOptions.includes(option.id)}
                                                        onChange={() => handleSeverityChange(option.id)}
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

                            {/* Services Section */}
                            {selectedDataSource !== DATA_SOURCE_NAMESPACE_REDIS && (
                                <div className='flex flex-col gap-3'>
                                    <div className='flex flex-col gap-2'>
                                        <h3 className="font-semibold text-lg">Services</h3>
                                        <p className="text-sm text-gray-600">
                                            Selected Services: <span className='text-blue-600'>{selectedServiceOptions.length}</span>
                                        </p>
                                        <button
                                            onClick={handleSelectAllServices}
                                            className="text-blue-500 text-sm text-blue-500 text-sm text-left"
                                        >
                                            {selectedServiceOptions.length === servicesOptions.length ? 'Unselect All' : 'Select All'}
                                        </button>
                                    </div>

                                    <div className='flex flex-col gap-2'>
                                        <input
                                            className="w-full text-black border border-gray-300 bg-light-700 hover:bg-light-800 focus:outline-none font-medium rounded-lg text-sm flex justify-between items-center p-2 mb-2"
                                            placeholder="Search service"
                                            value={searchValue}
                                            onChange={handleSearch}
                                        />
                                        <div className="overflow-y-auto max-h-48">
                                            {hasErrorFilterService ? (
                                                <p className="text-red-500">
                                                    An error occurred while fetching services. Please try again later.
                                                </p>
                                            ) : filteredServicesOptions.length > 0 ? (
                                                filteredServicesOptions.map((service, index) => (
                                                    <label
                                                        key={index}
                                                        className="flex items-center justify-between mb-1"
                                                    >
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
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between space-x-4">
                            <button
                                className="bg-white text-blue-600 border border-primary-blue px-4 py-2 rounded-lg flex-1 text-center"
                                onClick={handleReset}
                            >
                                RESET
                            </button>
                            <button
                                className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex-1 text-center"
                                onClick={handleApply}
                            >
                                APPLY
                            </button>
                        </div>

                        {resetMessage && (
                            <p className="text-center text-blue-500 mt-4 font-semibold">
                                Filters have been reset!
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterPanel;
