import { ClusterOptionResponse } from '@/modules/models/anomaly-predictions';
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
    severityOptions: SeverityOption[];
    clusterOptions: ClusterOptionResponse[] | null | undefined;
    servicesOptions: string[] | null | undefined;
    solarWindsNetworkOptions: string[] | null | undefined;
    solarWindsNodeOptions: string[] | null | undefined;
    solarWindsInterfaceOptions: string[] | null | undefined;
    dnsDomainOptions: string[] | null | undefined;
    dnsCategoryOptions: string[] | null | undefined;
    prtgTrafficDeviceOptions: string[] | null | undefined;
    prtgTrafficSensorOptions: string[] | null | undefined;
    onApplyFilters: (
        filters: {
            selectedAnomalies: string[],
            selectedOperation: string
            selectedSeverities: number[],
            selectedClusters: ClusterOptionResponse[],
            selectedServices: string[],
            selectedNetwork: string[],
            selectedNode: string[],
            selectedInterface: string[],
            selectedCategory: string[],
            selectedDomain: string[],
        }
    ) => void;
    onResetFilters: () => void;
    hasErrorFilterAnomaly: boolean;
    hasErrorFilterCluster: boolean;
    hasErrorFilterService: boolean;
    hasErrorFilterSeverity: boolean;
    hasErrorFilterSolarWindsNetwork: boolean;
    hasErrorFilterSolarWindsNode: boolean;
    hasErrorFilterSolarWindsInterface: boolean;
    hasErrorFilterDnsCategory: boolean;
    hasErrorFilterDnsDomain: boolean;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
    checkboxOptions,
    severityOptions,
    clusterOptions,
    servicesOptions,
    solarWindsNetworkOptions,
    solarWindsNodeOptions,
    solarWindsInterfaceOptions,
    dnsDomainOptions,
    dnsCategoryOptions,
    prtgTrafficDeviceOptions,
    prtgTrafficSensorOptions,
    onApplyFilters,
    onResetFilters,
    hasErrorFilterAnomaly,
    hasErrorFilterCluster,
    hasErrorFilterService,
    hasErrorFilterSeverity,
    hasErrorFilterSolarWindsNetwork,
    hasErrorFilterSolarWindsNode,
    hasErrorFilterSolarWindsInterface,
    hasErrorFilterDnsCategory,
    hasErrorFilterDnsDomain,
}) => {
    const searchParams = useSearchParams();
    const [selectedOperation, setSelectedOperation] = useState<string>(''); // default to 'OR'
    const [isOpen, setIsOpen] = useState(false);
    const [selectedAnomalyOptions, setSelectedAnomalyOptions] = useState<string[]>([]);
    const [selectedSeverityOptions, setSelectedSeverityOptions] = useState<number[]>([]);
    const [selectedClusterOptions, setSelectedClusterOptions] = useState<ClusterOptionResponse[]>([]);
    const [selectedServiceOptions, setSelectedServiceOptions] = useState<string[]>([]);
    const [selectedNetworkOptions, setSelectedNetworkOptions] = useState<string[]>([]);
    const [selectedInterfaceOptions, setSelectedInterfaceOptions] = useState<string[]>([]);
    const [selectedNodeOptions, setSelectedNodeOptions] = useState<string[]>([]);
    const [selectedCategoryOptions, setSelectedCategoryOptions] = useState<string[]>([]);
    const [selectedDomainOptions, setSelectedDomainOptions] = useState<string[]>([]);
    const [selectedDeviceOptions, setSelectedDeviceOptions] = useState<string[]>([]);
    const [selectedSensorOptions, setSelectedSensorOptions] = useState<string[]>([]);
    const [searchServiceValue, setSearchServiceValue] = useState<string>(''); // For search input
    const [searchNodeValue, setSearchNodeValue] = useState<string>(''); // For search input
    const [searchInterfaceValue, setSearchInterfaceValue] = useState<string>(''); // For search input
    const [searchDomainValue, setSearchDomainValue] = useState<string>(''); // For search input
    const [resetMessage, setResetMessage] = useState<boolean>(false); // State for temporary reset message
    const panelRef = useRef<HTMLDivElement>(null);

    // Filter services based on the search input
    const filteredServicesOptions = servicesOptions?.filter(service =>
        service.toLowerCase().includes(searchServiceValue.toLowerCase())
    ) ?? [];

    const filteredSolarWindsNodeOptions = solarWindsNodeOptions?.filter(service =>
        service.toLowerCase().includes(searchNodeValue.toLowerCase())
    ) ?? [];
    const filteredSolarWindsInterfaceOptions = solarWindsInterfaceOptions?.filter(service =>
        service.toLowerCase().includes(searchInterfaceValue.toLowerCase())
    ) ?? [];

    const filteredDnsDomainOptions = dnsDomainOptions?.filter(service =>
        service.toLowerCase().includes(searchDomainValue.toLowerCase())
    ) ?? [];

    const togglePanel = () => {
        setIsOpen(!isOpen);
    };

    const handleAnomalyChange = (value: string) => {
        if (selectedSeverityOptions.length > 0) {
            // If severity is selected, do not allow anomaly selection
            return;
        }
        setSelectedAnomalyOptions((prev) =>
            prev.includes(value) ? prev.filter((option) => option !== value) : [...prev, value]
        );
    };

    const handleSeverityChange = (id: number) => {
        if (selectedAnomalyOptions.length > 0) {
            // If anomaly is selected, do not allow severity selection
            return;
        }
        setSelectedSeverityOptions((prev) =>
            prev.includes(id) ? prev.filter((option) => option !== id) : [...prev, id]
        );
    };

    const handleOperationChange = (operation: string) => {
        setSelectedOperation(operation);
    };

    const handleClusterChange = (value: ClusterOptionResponse) => {
        setSelectedClusterOptions((prev) =>
            prev.includes(value) ? prev.filter((option) => option.name !== value.name) : [...prev, value]
        );
    };

    const handleServiceChange = (value: string) => {
        setSelectedServiceOptions((prev) =>
            prev.includes(value) ? prev.filter((option) => option !== value) : [...prev, value]
        );
    };

    const handleNetworkChange = (value: string) => {
        setSelectedNetworkOptions((prev) =>
            prev.includes(value) ? prev.filter((option) => option !== value) : [...prev, value]
        );
    };
    const handleNodeChange = (value: string) => {
        setSelectedNodeOptions((prev) =>
            prev.includes(value) ? prev.filter((option) => option !== value) : [...prev, value]
        );
    };
    const handleInterfaceChange = (value: string) => {
        setSelectedInterfaceOptions((prev) =>
            prev.includes(value) ? prev.filter((option) => option !== value) : [...prev, value]
        );
    };

    const handleCategoryChange = (value: string) => {
        setSelectedCategoryOptions((prev) =>
            prev.includes(value) ? prev.filter((option) => option !== value) : [...prev, value]
        );
    };
    const handleDomainChange = (value: string) => {
        setSelectedDomainOptions((prev) =>
            prev.includes(value) ? prev.filter((option) => option !== value) : [...prev, value]
        );
    };

    const handleApply = () => {
        console.log({
            selectedAnomalies: selectedAnomalyOptions,
            selectedOperation: selectedOperation,
            selectedSeverities: selectedSeverityOptions,
            selectedClusters: selectedClusterOptions,
            selectedServices: selectedServiceOptions,
            selectedNetwork: selectedNetworkOptions,
            selectedNode: selectedNodeOptions,
            selectedInterface: selectedInterfaceOptions,
            selectedCategory: selectedCategoryOptions,
            selectedDomain: selectedDomainOptions,
        });
        
        onApplyFilters({
            selectedAnomalies: selectedAnomalyOptions,
            selectedOperation: selectedOperation,
            selectedSeverities: selectedSeverityOptions,
            selectedClusters: selectedClusterOptions,
            selectedServices: selectedServiceOptions,
            selectedNetwork: selectedNetworkOptions,
            selectedNode: selectedNodeOptions,
            selectedInterface: selectedInterfaceOptions,
            selectedCategory: selectedCategoryOptions,
            selectedDomain: selectedDomainOptions,
        });
        setIsOpen(false); // Close the panel after applying filters
    };

    const handleReset = () => {
        setSelectedAnomalyOptions([]);
        setSelectedOperation('');
        setSelectedSeverityOptions([]);
        setSelectedServiceOptions([]);
        setSelectedNetworkOptions([]);
        setSelectedNodeOptions([]);
        setSelectedInterfaceOptions([]);
        setSelectedCategoryOptions([]);
        setSelectedDomainOptions([]);
        setSearchServiceValue('');
        setSearchNodeValue('');
        setSearchInterfaceValue('');
        setSearchDomainValue('');
        onResetFilters();

        // Show reset confirmation message
        setResetMessage(true);
        setTimeout(() => setResetMessage(false), 2000);
    };

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchServiceValue(e.target.value);
    };
    const handleSearchSolarWindsNode = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchNodeValue(e.target.value);
    };
    const handleSearchSolarWindsInterface = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchInterfaceValue(e.target.value);
    };
    const handleSearchDnsDomain = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchDomainValue(e.target.value);
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

    const handleSelectAllCluster = () => {
        if (clusterOptions == null) return;
        if (selectedClusterOptions.length === clusterOptions.length) {
            setSelectedClusterOptions([]); // Unselect all
        } else {
            setSelectedClusterOptions(clusterOptions); // Select all
        }
    };

    const handleSelectAllServices = () => {
        if (servicesOptions == null) return;
        if (selectedServiceOptions.length === servicesOptions.length) {
            setSelectedServiceOptions([]); // Unselect all
        } else {
            setSelectedServiceOptions(servicesOptions); // Select all
        }
    };

    const handleSelectAllSolarWindsNetwork = () => {
        if (solarWindsNetworkOptions == null) return;
        if (selectedServiceOptions.length === solarWindsNetworkOptions.length) {
            setSelectedServiceOptions([]); // Unselect all
        } else {
            setSelectedServiceOptions(solarWindsNetworkOptions); // Select all
        }
    };
    const handleSelectAllSolarWindsNode = () => {
        if (solarWindsNodeOptions == null) return;
        if (selectedServiceOptions.length === solarWindsNodeOptions.length) {
            setSelectedServiceOptions([]); // Unselect all
        } else {
            setSelectedServiceOptions(solarWindsNodeOptions); // Select all
        }
    };
    const handleSelectAllSolarWindsInterface = () => {
        if (solarWindsInterfaceOptions == null) return;
        if (selectedServiceOptions.length === solarWindsInterfaceOptions.length) {
            setSelectedServiceOptions([]); // Unselect all
        } else {
            setSelectedServiceOptions(solarWindsInterfaceOptions); // Select all
        }
    };

    const handleSelectAllDnsCategory = () => {
        if (dnsCategoryOptions == null) return;
        if (selectedServiceOptions.length === dnsCategoryOptions.length) {
            setSelectedServiceOptions([]); // Unselect all
        } else {
            setSelectedServiceOptions(dnsCategoryOptions); // Select all
        }
    };
    const handleSelectAllDnsDomain = () => {
        if (dnsDomainOptions == null) return;
        if (selectedServiceOptions.length === dnsDomainOptions.length) {
            setSelectedServiceOptions([]); // Unselect all
        } else {
            setSelectedServiceOptions(dnsDomainOptions); // Select all
        }
    };

    useEffect(() => {
        const anomalies = searchParams.getAll("anomaly");
        const severities = searchParams.getAll("severity");
        const services = searchParams.getAll("service");
        const clusters = searchParams.getAll("cluster");

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

        setSelectedClusterOptions(
            clusterOptions?.filter(option => clusters.includes(option.name)) ?? []
        );

        setSelectedServiceOptions(
            services.filter((service) =>
                servicesOptions?.some((option) => option === service)
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

    const gridCount = 2 +
        (clusterOptions ? 1 : 0) +
        (servicesOptions ? 1 : 0) +
        (solarWindsNetworkOptions && solarWindsInterfaceOptions && solarWindsNodeOptions ? 3 : 0) +
        (dnsDomainOptions && dnsCategoryOptions ? 2 : 0) +
        (prtgTrafficDeviceOptions && prtgTrafficSensorOptions ? 2 : 0)

    return (
        <div className="flex self-start z-99999">
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
                        className="bg-white rounded-lg p-6 w-full max-w-screen-lg flex flex-col gap-4 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-y-auto max-h-screen"
                    >
                        <h2 className="text-xl font-semibold text-center mb-2">Multiple Filter</h2>

                        {/* Responsive Grid Section */}
                        <div className={`grid gap-4 w-full`} style={{ gridTemplateColumns: `repeat(${gridCount}, 1fr)` }}>

                            <div className='flex flex-col gap-3'> {/* Anomaly Section */}
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-2">
                                        <h3 className="font-semibold text-lg">Anomaly</h3>
                                        <p className="text-sm text-gray-600">
                                            Selected Anomalies: <span className="text-blue-600">{selectedAnomalyOptions.length}</span>
                                        </p>
                                        <button
                                            onClick={handleSelectAllAnomalies}
                                            className="text-blue-500 text-sm text-left "
                                            disabled={selectedSeverityOptions.length > 0}
                                        >
                                            {selectedAnomalyOptions.length === checkboxOptions.length ? 'Unselect All' : 'Select All'}
                                        </button>
                                    </div>
                                    <div className="overflow-y-auto max-h-36">
                                        {hasErrorFilterAnomaly ? (
                                            <p className="text-red-500 whitespace-break-spaces">An error occurred. Please try again later.</p>
                                        ) : checkboxOptions.length > 0 ? (
                                            checkboxOptions.map((option) => (
                                                <label key={option.id} className="flex items-center justify-between mb-1">
                                                    <div className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            value={option.id}
                                                            checked={selectedAnomalyOptions.includes(option.id)}
                                                            onChange={() => handleAnomalyChange(option.id)}
                                                            className="mr-2"
                                                            disabled={selectedSeverityOptions.length > 0}
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

                                {/* Operation Section */}
                                <div className="flex flex-col gap-3 mt-6">
                                    <div className="flex flex-col gap-2">
                                        <h3 className="font-semibold text-lg">Operation</h3>
                                        <p className="text-sm text-gray-600">
                                            Select an operation type
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="flex items-center justify-between mb-1">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    value="OR"
                                                    checked={selectedOperation === 'OR'} // Handle state for selected operation
                                                    onChange={() => handleOperationChange('OR')} // Update operation change handler
                                                    className="mr-2"
                                                />
                                                OR
                                            </div>
                                        </label>
                                        <label className="flex items-center justify-between mb-1">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    value="AND"
                                                    checked={selectedOperation === 'AND'} // Handle state for selected operation
                                                    onChange={() => handleOperationChange('AND')} // Update operation change handler
                                                    className="mr-2"
                                                />
                                                AND
                                            </div>
                                        </label>
                                    </div>
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
                                        className="text-blue-500 text-sm text-left"
                                        disabled={selectedAnomalyOptions.length > 0}
                                    >
                                        {selectedSeverityOptions.length === severityOptions.length ? 'Unselect All' : 'Select All'}
                                    </button>
                                </div>
                                <div className="overflow-y-auto max-h-40">
                                    {hasErrorFilterAnomaly ? (
                                        <p className="text-red-500 whitespace-break-spaces">An error occurred. Please try again later.</p>
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
                                                        disabled={selectedAnomalyOptions.length > 0}
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

                            {/* Cluster Section */}
                            {clusterOptions != null && (
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-2">
                                        <h3 className="font-semibold text-lg">Cluster</h3>
                                        <p className="text-sm text-gray-600">
                                            Selected Cluster: <span className="text-blue-600">{selectedClusterOptions.length}</span>
                                        </p>
                                        <button onClick={handleSelectAllCluster} className="text-blue-500 text-sm text-left">
                                            {selectedClusterOptions.length === clusterOptions.length ? 'Unselect All' : 'Select All'}
                                        </button>
                                    </div>

                                    <div className='flex flex-col gap-2'>
                                        <div className="overflow-y-auto max-h-40">
                                            {hasErrorFilterCluster ? (
                                                <p className="text-red-500">
                                                    An error occurred while fetching cluster. Please try again later.
                                                </p>
                                            ) : clusterOptions.length > 0 ? (
                                                clusterOptions.map((cluster, index) => (
                                                    <label
                                                        key={index}
                                                        className="flex items-center justify-between mb-1"
                                                    >
                                                        <div className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                value={cluster.name}
                                                                checked={selectedClusterOptions.includes(cluster)}
                                                                onChange={() => handleClusterChange(cluster)}
                                                                className="mr-2"
                                                            />
                                                            {cluster.label}
                                                        </div>
                                                    </label>
                                                ))
                                            ) : (
                                                <p>No cluster available</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Services Section */}
                            {servicesOptions != null && (
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-2">
                                        <h3 className="font-semibold text-lg">Services</h3>
                                        <p className="text-sm text-gray-600">
                                            Selected Services: <span className="text-blue-600">{selectedServiceOptions.length}</span>
                                        </p>


                                        {/* Select All Services button */}
                                        <button onClick={handleSelectAllServices} className="text-blue-500 text-sm text-left">
                                            {selectedServiceOptions.length === servicesOptions.length ? 'Unselect All' : 'Select All'}
                                        </button>
                                    </div>

                                    {/* Search input for services */}
                                    <input
                                        className="w-full text-black border border-gray-300 bg-light-700 hover:bg-light-800 focus:outline-none font-medium rounded-lg text-sm flex justify-between items-center p-2 mb-2"
                                        placeholder="Search service"
                                        value={searchServiceValue}
                                        onChange={handleSearch}
                                    />

                                    {/* Services with filtered results */}
                                    <div className="overflow-y-auto max-h-40">
                                        {hasErrorFilterService ? (
                                            <p className="text-red-500 whitespace-nowrap">An error occurred while fetching services. Please try again later.</p>
                                        ) : filteredServicesOptions.length > 0 ? (
                                            filteredServicesOptions.map((service, index) => (
                                                <label key={index} className="flex items-center justify-between mb-1">
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
                            )}

                            {/* Others Section */}
                            {solarWindsNetworkOptions != null && (
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-2">
                                        <h3 className="font-semibold text-lg">Network</h3>
                                        <p className="text-sm text-gray-600">
                                            Selected Network: <span className="text-blue-600">{selectedNetworkOptions.length}</span>
                                        </p>

                                        {/* Select All Network button */}
                                        <button onClick={handleSelectAllSolarWindsNetwork} className="text-blue-500 text-sm text-left">
                                            {selectedNetworkOptions.length === solarWindsNetworkOptions.length ? 'Unselect All' : 'Select All'}
                                        </button>
                                    </div>

                                    <div className="overflow-y-auto max-h-40">
                                        {hasErrorFilterSolarWindsNetwork ? (
                                            <p className="text-red-500 whitespace-nowrap">An error occurred while fetching network. Please try again later.</p>
                                        ) : solarWindsNetworkOptions.length > 0 ? (
                                            solarWindsNetworkOptions.map((network, index) => (
                                                <label key={index} className="flex items-center justify-between mb-1">
                                                    <div className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            value={network}
                                                            checked={selectedNetworkOptions.includes(network)}
                                                            onChange={() => handleNetworkChange(network)}
                                                            className="mr-2"
                                                        />
                                                        {network}
                                                    </div>
                                                </label>
                                            ))
                                        ) : (
                                            <p>No network available</p>
                                        )}
                                    </div>
                                </div>
                            )}
                            {solarWindsInterfaceOptions != null && (
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-2">
                                        <h3 className="font-semibold text-lg">Interface</h3>
                                        <p className="text-sm text-gray-600">
                                            Selected Interface: <span className="text-blue-600">{selectedInterfaceOptions.length}</span>
                                        </p>

                                        {/* Select All Interface button */}
                                        <button onClick={handleSelectAllSolarWindsInterface} className="text-blue-500 text-sm text-left">
                                            {selectedInterfaceOptions.length === solarWindsInterfaceOptions.length ? 'Unselect All' : 'Select All'}
                                        </button>
                                    </div>

                                    <input
                                        className="w-full text-black border border-gray-300 bg-light-700 hover:bg-light-800 focus:outline-none font-medium rounded-lg text-sm flex justify-between items-center p-2 mb-2"
                                        placeholder="Search interface"
                                        value={searchInterfaceValue}
                                        onChange={handleSearchSolarWindsInterface}
                                    />

                                    <div className="overflow-y-auto max-h-40">
                                        {hasErrorFilterSolarWindsInterface ? (
                                            <p className="text-red-500 whitespace-nowrap">An error occurred while fetching interface. Please try again later.</p>
                                        ) : filteredSolarWindsInterfaceOptions.length > 0 ? (
                                            filteredSolarWindsInterfaceOptions.map((interace_name, index) => (
                                                <label key={index} className="flex items-center justify-between mb-1">
                                                    <div className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            value={interace_name}
                                                            checked={selectedInterfaceOptions.includes(interace_name)}
                                                            onChange={() => handleInterfaceChange(interace_name)}
                                                            className="mr-2"
                                                        />
                                                        {interace_name}
                                                    </div>
                                                </label>
                                            ))
                                        ) : (
                                            <p>No interface available</p>
                                        )}
                                    </div>
                                </div>
                            )}
                            {solarWindsNodeOptions != null && (
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-2">
                                        <h3 className="font-semibold text-lg">Node</h3>
                                        <p className="text-sm text-gray-600">
                                            Selected Node: <span className="text-blue-600">{selectedNodeOptions.length}</span>
                                        </p>

                                        {/* Select All Node button */}
                                        <button onClick={handleSelectAllSolarWindsNode} className="text-blue-500 text-sm text-left">
                                            {selectedNodeOptions.length === solarWindsNodeOptions.length ? 'Unselect All' : 'Select All'}
                                        </button>
                                    </div>

                                    {/* Search input for nodes */}
                                    <input
                                        className="w-full text-black border border-gray-300 bg-light-700 hover:bg-light-800 focus:outline-none font-medium rounded-lg text-sm flex justify-between items-center p-2 mb-2"
                                        placeholder="Search node"
                                        value={searchNodeValue}
                                        onChange={handleSearchSolarWindsNode}
                                    />

                                    <div className="overflow-y-auto max-h-40">
                                        {hasErrorFilterSolarWindsNode ? (
                                            <p className="text-red-500 whitespace-nowrap">An error occurred while fetching node. Please try again later.</p>
                                        ) : filteredSolarWindsNodeOptions.length > 0 ? (
                                            filteredSolarWindsNodeOptions.map((node, index) => (
                                                <label key={index} className="flex items-center justify-between mb-1">
                                                    <div className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            value={node}
                                                            checked={selectedNodeOptions.includes(node)}
                                                            onChange={() => handleNodeChange(node)}
                                                            className="mr-2"
                                                        />
                                                        {node}
                                                    </div>
                                                </label>
                                            ))
                                        ) : (
                                            <p>No node available</p>
                                        )}
                                    </div>
                                </div>
                            )}
                            {dnsCategoryOptions != null && (
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-2">
                                        <h3 className="font-semibold text-lg">Category</h3>
                                        <p className="text-sm text-gray-600">
                                            Selected Category: <span className="text-blue-600">{selectedCategoryOptions.length}</span>
                                        </p>

                                        {/* Select All Category button */}
                                        <button onClick={handleSelectAllDnsCategory} className="text-blue-500 text-sm text-left">
                                            {selectedCategoryOptions.length === dnsCategoryOptions.length ? 'Unselect All' : 'Select All'}
                                        </button>
                                    </div>

                                    <div className="overflow-y-auto max-h-40">
                                        {hasErrorFilterDnsCategory ? (
                                            <p className="text-red-500 whitespace-nowrap">An error occurred while fetching category. Please try again later.</p>
                                        ) : dnsCategoryOptions.length > 0 ? (
                                            dnsCategoryOptions.map((category, index) => (
                                                <label key={index} className="flex items-center justify-between mb-1">
                                                    <div className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            value={category}
                                                            checked={selectedCategoryOptions.includes(category)}
                                                            onChange={() => handleCategoryChange(category)}
                                                            className="mr-2"
                                                        />
                                                        {category}
                                                    </div>
                                                </label>
                                            ))
                                        ) : (
                                            <p>No category available</p>
                                        )}
                                    </div>
                                </div>
                            )}
                            {dnsDomainOptions != null && (
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-2">
                                        <h3 className="font-semibold text-lg">Domain</h3>
                                        <p className="text-sm text-gray-600">
                                            Selected Domain: <span className="text-blue-600">{selectedDomainOptions.length}</span>
                                        </p>

                                        {/* Select All Domain button */}
                                        <button onClick={handleSelectAllDnsDomain} className="text-blue-500 text-sm text-left">
                                            {selectedDomainOptions.length === dnsDomainOptions.length ? 'Unselect All' : 'Select All'}
                                        </button>
                                    </div>

                                    <input
                                        className="w-full text-black border border-gray-300 bg-light-700 hover:bg-light-800 focus:outline-none font-medium rounded-lg text-sm flex justify-between items-center p-2 mb-2"
                                        placeholder="Search interface"
                                        value={searchDomainValue}
                                        onChange={handleSearchDnsDomain}
                                    />

                                    <div className="overflow-y-auto max-h-40">
                                        {hasErrorFilterDnsDomain ? (
                                            <p className="text-red-500 whitespace-nowrap">An error occurred while fetching domain. Please try again later.</p>
                                        ) : filteredDnsDomainOptions.length > 0 ? (
                                            filteredDnsDomainOptions.map((domain, index) => (
                                                <label key={index} className="flex items-center justify-between mb-1">
                                                    <div className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            value={domain}
                                                            checked={selectedDomainOptions.includes(domain)}
                                                            onChange={() => handleDomainChange(domain)}
                                                            className="mr-2"
                                                        />
                                                        {domain}
                                                    </div>
                                                </label>
                                            ))
                                        ) : (
                                            <p>No domain available</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Reset and Apply Buttons */}
                        <div className="flex justify-between space-x-4 mt-4">
                            <button className="bg-white text-blue-600 border border-primary-blue px-4 py-2 rounded-lg flex-1 text-center" onClick={handleReset}>
                                RESET
                            </button>
                            <button className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex-1 text-center" onClick={handleApply}>
                                APPLY
                            </button>
                        </div>

                        {resetMessage && <p className="text-center text-blue-500 mt-4 font-semibold">Filters have been reset!</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterPanel;
