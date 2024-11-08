import { GetListIdentifier } from '@/modules/usecases/anomaly-predictions';
import { ColumnOption } from '@/types/anomaly';
import { format } from 'date-fns';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';

interface FilterGraphAnomalyProps {
    selectedDataSource: string;
    datasourceIdentifiers: {
        title: string;
        key: string;
    }[];
    timeRanges: Record<string, number>;
    selectedTimeRange: string;
    scaleOptions: ColumnOption[];
    currentSelectedIdentifiers: string[];
    currentSelectedScales: ColumnOption[];
    onApplyFilters: (
        selectedScales: ColumnOption[],
        selectedIdentifiers: string[],
    ) => void; // Separate filters for anomalies and services
}

const FilterGraphAnomaly: React.FC<FilterGraphAnomalyProps> = ({
    selectedDataSource,
    datasourceIdentifiers,
    timeRanges,
    selectedTimeRange,
    scaleOptions,
    currentSelectedScales,
    currentSelectedIdentifiers,
    onApplyFilters,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [listIdentifiers, setListIdentifiers] = useState<string[][]>([])
    const [selectedIdentifiers, setSelectedIdentifiers] = useState<string[]>(currentSelectedIdentifiers)
    const [selectedScaleOptions, setSelectedScaleOptions] = useState<ColumnOption[]>(currentSelectedScales);
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

        const listIdentifiers: string[][] = []
        const errorListIdentifiers: boolean[] = []
        datasourceIdentifiers.forEach(identifier => {
            GetListIdentifier(
                selectedDataSource,
                identifier.key, {
                start_time: startTime,
                end_time: endTime,
            }).then(res => {
                if (res.data) {
                    listIdentifiers.push(res.data)
                    errorListIdentifiers.push(false)
                } else {
                    errorListIdentifiers.push(true)
                }
            })
        })
        setListIdentifiers(listIdentifiers)
    };

    // Filter services based on the search input
    // const filteredServicesOptions = servicesOptions?.filter(service =>
    //     service.toLowerCase().includes(searchServiceValue.toLowerCase())
    // ) ?? [];

    // const filteredNodeOptions = nodeOptions?.filter(service =>
    //     service.toLowerCase().includes(searchNodeValue.toLowerCase())
    // ) ?? [];
    // const filteredInterfaceOptions = interfaceOptions?.filter(service =>
    //     service.toLowerCase().includes(searchInterfaceValue.toLowerCase())
    // ) ?? [];

    // const filteredDomainOptions = domainOptions?.filter(service =>
    //     service.toLowerCase().includes(searchDomainValue.toLowerCase())
    // ) ?? [];

    const togglePanel = () => {
        setIsOpen(!isOpen);
    };

    const handleSelectedChange = (identifierIndex: number, value: string) => {
        setSelectedIdentifiers(prev => {
            const newArr = [...prev]
            newArr[identifierIndex] = value

            return newArr
        })
    };

    const handleScaleChange = (value: ColumnOption) => {
        setSelectedScaleOptions((prev) => (
            prev.includes(value)
                ? prev.filter((option) => option.name !== value.name)
                : [...prev, value]
        ));
    };

    const handleApply = () => {
        onApplyFilters(
            selectedScaleOptions,
            selectedIdentifiers,
        );
        setIsOpen(false); // Close the panel after applying filters
    };

    const handleReset = () => {
        setSelectedScaleOptions([]);
        setSelectedIdentifiers([])
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
    }, [datasourceIdentifiers, selectedTimeRange])

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
        setSelectedScaleOptions(currentSelectedScales)
    }, [currentSelectedScales])

    useEffect(() => {
        setSelectedIdentifiers(currentSelectedIdentifiers)
    }, [currentSelectedIdentifiers])

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
                                gridTemplateColumns: `repeat(${1 + listIdentifiers.length}, 1fr)`
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

                            {datasourceIdentifiers.map((identifier, identifierIdx) =>
                                <div className="flex flex-col" key={identifier.key}>
                                    <h3 className="font-semibold mb-3 text-lg">{identifier.title}</h3>
                                    {listIdentifiers[identifierIdx].length > 0 ?
                                        <>
                                            {/* <input
                                                className="w-full text-black border border-gray-300 bg-light-700 hover:bg-light-800 focus:outline-none font-medium rounded-lg text-sm flex justify-between items-center p-2 mb-2"
                                                placeholder='Search service'
                                                value={searchServiceValue}
                                                onChange={handleSearchService}
                                            /> */}
                                            <div className="overflow-y-auto max-h-40">
                                                {listIdentifiers[identifierIdx].map(item => (
                                                    <label key={item} className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center">
                                                            <input
                                                                type="radio"
                                                                value={item}
                                                                checked={selectedIdentifiers[identifierIdx] === item}
                                                                onChange={() => handleSelectedChange(identifierIdx, item)}
                                                                className="mr-2"
                                                            />
                                                            {item}
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </>
                                        : <p>No {identifier.title} available</p>
                                    }
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
                                    datasourceIdentifiers.length !== selectedIdentifiers.length
                                }
                                onClick={handleApply}
                            >
                                TERAPKAN
                            </button>
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    );
};

export default FilterGraphAnomaly;
