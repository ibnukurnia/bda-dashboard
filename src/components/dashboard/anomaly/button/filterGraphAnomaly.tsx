import { fetchDnsCategoryOption, fetchDnsDomainOption, fetchPrtgTrafficDeviceOption, fetchPrtgTrafficSensorOption, fetchServicesOption, fetchSolarWindsInterfaceOption, fetchSolarWindsNetworkOption, fetchSolarWindsNodeOption } from '@/lib/api';
import { ClusterOptionResponse } from '@/modules/models/anomaly-predictions';
import { GetClusterOption } from '@/modules/usecases/anomaly-predictions';
import { ColumnOption } from '@/types/anomaly';
import { format } from 'date-fns';
import React, { ChangeEvent, Fragment, useEffect, useRef, useState } from 'react';

interface FilterGraphAnomalyProps {
    selectedDataSource: string;
    timeRanges: Record<string, number>;
    selectedTimeRange: string;
    scaleOptions: ColumnOption[];
    currentSelectedScales: ColumnOption[];
    currentSelectedCluster: ClusterOptionResponse[];
    currentSelectedService: string | null;
    currentSelectedNetwork: string | null;
    currentSelectedInterface: string | null;
    currentSelectedNode: string | null;
    currentSelectedCategory: string | null;
    currentSelectedDomain: string | null;
    onApplyFilters: (
        selectedScales: ColumnOption[],
        selectedCluster: ClusterOptionResponse[],
        selectedService: string | null,
        selectedNetwork: string | null,
        selectedInterface: string | null,
        selectedNode: string | null,
        selectedCategory: string | null,
        selectedDomain: string | null,
    ) => void; // Separate filters for anomalies and services
}

const FilterGraphAnomaly: React.FC<FilterGraphAnomalyProps> = ({
    selectedDataSource,
    timeRanges,
    selectedTimeRange,
    scaleOptions,
    currentSelectedScales,
    currentSelectedCluster,
    currentSelectedService,
    currentSelectedNetwork,
    currentSelectedInterface,
    currentSelectedNode,
    currentSelectedCategory,
    currentSelectedDomain,
    onApplyFilters,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [clusterOptions, setClusterOptions] = useState<ClusterOptionResponse[] | null | undefined>(null)
    const [servicesOptions, setServicesOptions] = useState<string[] | null | undefined>(null)
    const [networkOptions, setNetworkOptions] = useState<string[] | null | undefined>(null)
    const [nodeOptions, setNodeOptions] = useState<string[] | null | undefined>(null)
    const [interfaceOptions, setInterfaceOptions] = useState<string[] | null | undefined>(null)
    const [domainOptions, setDomainOptions] = useState<string[] | null | undefined>(null)
    const [categoryOptions, setCategoryOptions] = useState<string[] | null | undefined>(null)
    const [deviceOptions, setDeviceOptions] = useState<string[] | null | undefined>(null)
    const [sensorOptions, setSensorOptions] = useState<string[] | null | undefined>(null)
    const [selectedScaleOptions, setSelectedScaleOptions] = useState<ColumnOption[]>(currentSelectedScales);
    const [selectedClusterOptions, setSelectedClusterOptions] = useState<ClusterOptionResponse[]>(currentSelectedCluster);
    const [filteredServicesOptions, setFilteredServicesOptions] = useState(servicesOptions)
    const [selectedServiceOptions, setSelectedServiceOptions] = useState<string | null>(currentSelectedService);
    const [selectedNetworkOptions, setSelectedNetworkOptions] = useState<string | null>(currentSelectedNetwork);
    const [selectedInterfaceOptions, setSelectedInterfaceOptions] = useState<string | null>(currentSelectedInterface);
    const [selectedNodeOptions, setSelectedNodeOptions] = useState<string | null>(currentSelectedNode);
    const [selectedCategoryOptions, setSelectedCategoryOptions] = useState<string | null>(currentSelectedCategory);
    const [selectedDomainOptions, setSelectedDomainOptions] = useState<string | null>(currentSelectedDomain);
    const [searchServiceValue, setSearchServiceValue] = useState<string>('')
    const [searchInterfaceValue, setSearchInterfaceValue] = useState<string>('')
    const [searchNodeValue, setSearchNodeValue] = useState<string>('')
    const [searchDomainValue, setSearchDomainValue] = useState<string>('')
    const panelRef = useRef<HTMLDivElement>(null);

    const getTimeRange = () => {
        let startTime: string;
        let endTime: string;

        // Check if a custom range in the format 'start - end' is provided
        if (selectedTimeRange.includes(' - ')) {
            const [start, end] = selectedTimeRange.split(' - ');
            if (!start || !end) {
                throw new Error(`Invalid custom range: ${selectedTimeRange}`);
            }
            startTime = start;
            endTime = end;
        } else {
            // Handle predefined time ranges
            const predefinedRange = timeRanges[selectedTimeRange];
            if (!predefinedRange) {
                throw new Error(`Invalid time range: ${selectedTimeRange}`);
            }

            const endDate = new Date();
            endDate.setSeconds(0, 0); // Round down to the nearest minute
            const startDate = new Date(endDate.getTime() - predefinedRange * 60000); // Subtract the range in minutes

            startTime = format(startDate, 'yyyy-MM-dd HH:mm:ss');
            endTime = format(endDate, 'yyyy-MM-dd HH:mm:ss');
        }

        return { startTime, endTime };
    };

    const loadFiltersOptions = async () => {
        const { startTime, endTime } = getTimeRange();

        // Map each filter to its respective loading function with error handling
        const filtersMap: { [key: string]: () => Promise<void> } = {
            cluster: async () => {
                const response = await GetClusterOption({ type: selectedDataSource, start_time: startTime, end_time: endTime });
                setClusterOptions(response.data);
            },

            services: async () => {
                const response = await fetchServicesOption({ type: selectedDataSource, start_time: startTime, end_time: endTime });
                setServicesOptions(response.data?.services);
            },

            solarWindsNetwork: async () => {
                const response = await fetchSolarWindsNetworkOption({ start_time: startTime, end_time: endTime });
                setNetworkOptions(response.data);
            },

            solarWindsNode: async () => {
                const response = await fetchSolarWindsNodeOption({ start_time: startTime, end_time: endTime });
                setNodeOptions(response.data);
            },

            solarWindsInterface: async () => {
                const response = await fetchSolarWindsInterfaceOption({ start_time: startTime, end_time: endTime });
                setInterfaceOptions(response.data);
            },

            dnsDomain: async () => {
                const response = await fetchDnsDomainOption({ start_time: startTime, end_time: endTime });
                setDomainOptions(response.data);
            },

            dnsCategory: async () => {
                const response = await fetchDnsCategoryOption({ start_time: startTime, end_time: endTime });
                setCategoryOptions(response.data);
            },

            prtgTrafficDevice: async () => {
                const response = await fetchPrtgTrafficDeviceOption({ start_time: startTime, end_time: endTime });
                setDeviceOptions(response.data);
            },

            prtgTrafficSensor: async () => {
                const response = await fetchPrtgTrafficSensorOption({ start_time: startTime, end_time: endTime });
                setSensorOptions(response.data);
            },
        };

        // Load specific filters based on `selectedDataSource`
        switch (selectedDataSource) {
            case 'solarwinds':
                filtersMap.solarWindsNetwork();
                filtersMap.solarWindsNode();
                filtersMap.solarWindsInterface();
                break;

            case 'dns_rt':
                filtersMap.cluster();
                filtersMap.dnsDomain();
                filtersMap.dnsCategory();
                break;

            case 'prtg_traffic':
                filtersMap.prtgTrafficDevice();
                filtersMap.prtgTrafficSensor();
                break;

            default:
                filtersMap.cluster();
                filtersMap.services();
        }
    };

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
    const handleNetworkChange = (value: string) => {
        setSelectedNetworkOptions(value);
    };
    const handleInterfaceChange = (value: string) => {
        setSelectedInterfaceOptions(value);
    };
    const handleNodeChange = (value: string) => {
        setSelectedNodeOptions(value);
    };
    const handleCategoryChange = (value: string) => {
        setSelectedCategoryOptions(value);
    };
    const handleDomainChange = (value: string) => {
        setSelectedDomainOptions(value);
    };

    const handleApply = () => {
        onApplyFilters(
            selectedScaleOptions,
            selectedClusterOptions,
            selectedServiceOptions,
            selectedNetworkOptions,
            selectedInterfaceOptions,
            selectedNodeOptions,
            selectedCategoryOptions,
            selectedDomainOptions,
        );
        setIsOpen(false); // Close the panel after applying filters
    };

    const handleReset = () => {
        setSelectedScaleOptions([]);
        setSelectedServiceOptions(null);
    };

    const handleSearchService = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchServiceValue(e.target.value)
    }
    const handleSearchInterface = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchInterfaceValue(e.target.value)
    }
    const handleSearchNode = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchNodeValue(e.target.value)
    }
    const handleSearchDomain = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchDomainValue(e.target.value)
    }

    useEffect(() => {
        loadFiltersOptions()
    }, [selectedDataSource, selectedTimeRange])
    
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
                option.toLowerCase().includes(searchServiceValue.toLowerCase()) // Convert both to lowercase
        ) ?? []);
    }, [searchServiceValue]);

    useEffect(() => {
        setFilteredServicesOptions(servicesOptions)
    }, [servicesOptions])

    useEffect(() => {
        setSelectedScaleOptions(currentSelectedScales)
    }, [currentSelectedScales])

    useEffect(() => {
        setSelectedClusterOptions(currentSelectedCluster)
    }, [currentSelectedCluster])

    useEffect(() => {
        setSelectedServiceOptions(currentSelectedService)
    }, [currentSelectedService])

    const gridCount = 1 +
        (clusterOptions ? 1 : 0) +
        (servicesOptions ? 1 : 0) +
        (networkOptions && interfaceOptions && nodeOptions ? 3 : 0) +
        (domainOptions && categoryOptions ? 2 : 0) +
        (deviceOptions && sensorOptions ? 2 : 0)

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
                                                value={searchServiceValue}
                                                onChange={handleSearchService}
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

                            {networkOptions && (
                                <div className="flex flex-col">
                                    <h3 className="font-semibold mb-3 text-lg">Network</h3>
                                    {networkOptions && networkOptions.length > 0 ? (
                                        <div className="overflow-y-auto max-h-40">
                                            {networkOptions && networkOptions.map((network, index) => (
                                                <label key={index} className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            value={network}
                                                            checked={selectedNetworkOptions === network}
                                                            onChange={() => handleNetworkChange(network)}
                                                            className="mr-2"
                                                        />
                                                        {network}
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>No network available</p>
                                    )}
                                </div>
                            )}

                            {interfaceOptions && (
                                <div className="flex flex-col">
                                    <h3 className="font-semibold mb-3 text-lg">Interface</h3>
                                    {interfaceOptions && interfaceOptions.length > 0 ? (
                                        <Fragment>
                                            <input
                                                className="w-full text-black border border-gray-300 bg-light-700 hover:bg-light-800 focus:outline-none font-medium rounded-lg text-sm flex justify-between items-center p-2 mb-2"
                                                placeholder='Search interface'
                                                value={searchInterfaceValue}
                                                onChange={handleSearchInterface}
                                            />
                                            <div className="overflow-y-auto max-h-40">
                                                {interfaceOptions && interfaceOptions.map((interface_name, index) => (
                                                    <label key={index} className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center">
                                                            <input
                                                                type="radio"
                                                                value={interface_name}
                                                                checked={selectedInterfaceOptions === interface_name}
                                                                onChange={() => handleInterfaceChange(interface_name)}
                                                                className="mr-2"
                                                            />
                                                            {interface_name}
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </Fragment>
                                    ) : (
                                        <p>No interface available</p>
                                    )}
                                </div>
                            )}

                            {nodeOptions && (
                                <div className="flex flex-col">
                                    <h3 className="font-semibold mb-3 text-lg">Node</h3>
                                    {nodeOptions && nodeOptions.length > 0 ? (
                                        <Fragment>
                                            <input
                                                className="w-full text-black border border-gray-300 bg-light-700 hover:bg-light-800 focus:outline-none font-medium rounded-lg text-sm flex justify-between items-center p-2 mb-2"
                                                placeholder='Search node'
                                                value={searchNodeValue}
                                                onChange={handleSearchNode}
                                            />
                                            <div className="overflow-y-auto max-h-40">
                                                {nodeOptions && nodeOptions.map((node, index) => (
                                                    <label key={index} className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center">
                                                            <input
                                                                type="radio"
                                                                value={node}
                                                                checked={selectedNodeOptions === node}
                                                                onChange={() => handleNodeChange(node)}
                                                                className="mr-2"
                                                            />
                                                            {node}
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </Fragment>
                                    ) : (
                                        <p>No node available</p>
                                    )}
                                </div>
                            )}

                            {categoryOptions && (
                                <div className="flex flex-col">
                                    <h3 className="font-semibold mb-3 text-lg">Category</h3>
                                    {categoryOptions && categoryOptions.length > 0 ? (
                                        <div className="overflow-y-auto max-h-40">
                                            {categoryOptions && categoryOptions.map((category, index) => (
                                                <label key={index} className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            value={category}
                                                            checked={selectedCategoryOptions === category}
                                                            onChange={() => handleCategoryChange(category)}
                                                            className="mr-2"
                                                        />
                                                        {category}
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>No category available</p>
                                    )}
                                </div>
                            )}

                            {domainOptions && (
                                <div className="flex flex-col">
                                    <h3 className="font-semibold mb-3 text-lg">Domain</h3>
                                    {domainOptions && domainOptions.length > 0 ? (
                                        <Fragment>
                                            <input
                                                className="w-full text-black border border-gray-300 bg-light-700 hover:bg-light-800 focus:outline-none font-medium rounded-lg text-sm flex justify-between items-center p-2 mb-2"
                                                placeholder='Search domain'
                                                value={searchDomainValue}
                                                onChange={handleSearchDomain}
                                            />
                                            <div className="overflow-y-auto max-h-40">
                                                {domainOptions && domainOptions.map((domain, index) => (
                                                    <label key={index} className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center">
                                                            <input
                                                                type="radio"
                                                                value={domain}
                                                                checked={selectedDomainOptions === domain}
                                                                onChange={() => handleDomainChange(domain)}
                                                                className="mr-2"
                                                            />
                                                            {domain}
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </Fragment>
                                    ) : (
                                        <p>No domain available</p>
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
                                    (servicesOptions != null && selectedServiceOptions == null) ||
                                    (networkOptions != null && selectedNetworkOptions == null) ||
                                    (interfaceOptions != null && selectedInterfaceOptions == null) ||
                                    (nodeOptions != null && selectedNodeOptions == null) ||
                                    (categoryOptions != null && selectedCategoryOptions == null) ||
                                    (domainOptions != null && selectedDomainOptions == null)
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
