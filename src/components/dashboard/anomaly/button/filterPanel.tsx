import useUpdateEffect from '@/hooks/use-update-effect';
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
    datasourceIdentifiers: {
        title: string;
        key: string;
    }[];
    listIdentifiers: string[][];
    hasErrorListIdentifier: boolean[];
    onApplyFilters: (
        filters: {
            selectedAnomalies: string[],
            selectedOperation: string
            selectedSeverities: number[],
            selectedListIdentifiers: string[][],
        }
    ) => void;
    hasErrorFilterAnomaly: boolean;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
    checkboxOptions,
    severityOptions,
    datasourceIdentifiers,
    listIdentifiers,
    hasErrorListIdentifier,
    onApplyFilters,
    hasErrorFilterAnomaly,
}) => {
    const searchParams = useSearchParams();
    const [selectedOperation, setSelectedOperation] = useState<string>(''); // default to 'OR'
    const [isOpen, setIsOpen] = useState(false);
    const [selectedAnomalyOptions, setSelectedAnomalyOptions] = useState<string[]>([]);
    const [selectedSeverityOptions, setSelectedSeverityOptions] = useState<number[]>([]);
    const [selectedListIdentifiers, setSelectedListIdentifiers] = useState<string[][]>(datasourceIdentifiers.map(identifier => searchParams.getAll(identifier.key)))
    const [searchValues, setSearchValues] = useState<string[]>(Array.from({ length: datasourceIdentifiers.length }, () => ""))
    const [resetMessage, setResetMessage] = useState<boolean>(false); // State for temporary reset message
    const panelRef = useRef<HTMLDivElement>(null);

    // // Filter services based on the search input
    const filteredListIdentifiers = listIdentifiers.map((list, listIdx) => list?.filter(item =>
        item.toLowerCase().includes(searchValues[listIdx]?.toLowerCase())
    ) ?? []);

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

    const handleSelectedChange = (identifierIndex: number, value: string) => {
        setSelectedListIdentifiers(prev => {
            const newNestedArr = [...prev]
            let newArr = [...newNestedArr[identifierIndex]]
            if (newArr.includes(value)) {
                newArr = newArr.filter((option) => option !== value)
            } else {
                newArr = [...newArr, value]
            }
            newNestedArr[identifierIndex] = newArr

            return newNestedArr
        })
    };

    const handleApply = () => {
        onApplyFilters({
            selectedAnomalies: selectedAnomalyOptions,
            selectedOperation: selectedOperation,
            selectedSeverities: selectedSeverityOptions,
            selectedListIdentifiers: selectedListIdentifiers,
        });
        setIsOpen(false); // Close the panel after applying filters
    };

    const handleReset = () => {
        setSelectedAnomalyOptions([]);
        setSelectedOperation('');
        setSelectedSeverityOptions([]);
        setSelectedListIdentifiers(Array.from({ length: datasourceIdentifiers.length }, () => []))
        setSearchValues(Array.from({ length: datasourceIdentifiers.length }, () => ""))

        // Show reset confirmation message
        setResetMessage(true);
        setTimeout(() => setResetMessage(false), 2000);
    };

    const handleSearch = (identifierIndex: number, value: string) => {
        setSearchValues(prev => {
            const newArr = [ ...prev ]
            newArr[identifierIndex] = value
            return newArr
        });
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

    const handleSelectAll = (identifierIndex: number) => {
        if (selectedListIdentifiers[identifierIndex].length === listIdentifiers[identifierIndex].length) {
            // Unselect all
            setSelectedListIdentifiers(prev => {
                const newArr = [...prev]
                newArr[identifierIndex] = []
                return newArr
            });
        } else {
            // Select all
            setSelectedListIdentifiers(prev => {
                const newArr = [...prev]
                newArr[identifierIndex] = listIdentifiers[identifierIndex]
                return newArr
            });
        }
    };

    useEffect(() => {
        const anomalies = searchParams.getAll("anomaly");

        setSelectedAnomalyOptions(
            anomalies.filter((anomaly) =>
                checkboxOptions.some((option) => option.id === anomaly)
            )
        );
    }, [searchParams, checkboxOptions]);

    useEffect(() => {
        const severities = searchParams.getAll("severity");

        setSelectedSeverityOptions(
            severities
                .map(Number)
                .filter((severityId) =>
                    severityOptions.some((option) => option.id === severityId)
                )
        );
    }, [searchParams, severityOptions]);

    useEffect(() => {
        setSelectedListIdentifiers(datasourceIdentifiers.map(identifier => searchParams.getAll(identifier.key)))
    }, [searchParams, datasourceIdentifiers]);

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

    useUpdateEffect(() => {
        setSearchValues(Array.from({ length: datasourceIdentifiers.length }, () => ""))
    }, [listIdentifiers])
    
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
                        <div className={`grid gap-4 w-full`} style={{ gridTemplateColumns: `repeat(${2 + listIdentifiers.length}, 1fr)` }}>

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
                                    {severityOptions.length > 0 ? (
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

                            {datasourceIdentifiers.map((identifier, identifierIdx) =>
                                <div key={identifier.key} className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-2">
                                        <h3 className="font-semibold text-lg">{identifier.title}</h3>
                                        <p className="text-sm text-gray-600">
                                            Selected {identifier.title}: <span className="text-blue-600">{selectedListIdentifiers[identifierIdx]?.length}</span>
                                        </p>


                                        {/* Select All Services button */}
                                        <button onClick={() => handleSelectAll(identifierIdx)} className="text-blue-500 text-sm text-left">
                                            {selectedListIdentifiers[identifierIdx]?.length === listIdentifiers[identifierIdx]?.length ? 'Unselect All' : 'Select All'}
                                        </button>
                                    </div>

                                    {/* Search input for services */}
                                    {listIdentifiers[identifierIdx]?.length > 10 &&
                                        <input
                                            className="w-full text-black border border-gray-300 bg-light-700 hover:bg-light-800 focus:outline-none font-medium rounded-lg text-sm flex justify-between items-center p-2 mb-2"
                                            placeholder={`Search ${identifier.title}`}
                                            value={searchValues[identifierIdx]}
                                            onChange={(e) => handleSearch(identifierIdx, e.target.value)}
                                        />
                                    }

                                    {/* Services with filtered results */}
                                    <div className="overflow-y-auto max-h-40">
                                        {hasErrorListIdentifier[identifierIdx] ? (
                                            <p className="text-red-500 whitespace-nowrap">An error occurred while fetching services. Please try again later.</p>
                                        ) : filteredListIdentifiers[identifierIdx]?.length > 0 ? (
                                            filteredListIdentifiers[identifierIdx].map((item, itemIdx) => (
                                                <label key={itemIdx} className="flex items-center justify-between mb-1">
                                                    <div className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            value={item}
                                                            checked={selectedListIdentifiers[identifierIdx]?.includes(item)}
                                                            onChange={() => handleSelectedChange(identifierIdx, item)}
                                                            className="mr-2"
                                                        />
                                                        {item}
                                                    </div>
                                                </label>
                                            ))
                                        ) : (
                                            <p>No {identifier.title} Available</p>
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
