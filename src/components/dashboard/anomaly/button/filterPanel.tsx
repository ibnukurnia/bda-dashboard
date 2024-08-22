import React, { useState } from 'react';

interface FilterOption {
    label: string;
    value: string;
    count: number;
}

const FilterPanel: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [selectedRadio, setSelectedRadio] = useState<string>('Score Tertinggi');

    const togglePanel = () => {
        setIsOpen(!isOpen);
    };

    const handleCheckboxChange = (value: string) => {
        setSelectedOptions(prev =>
            prev.includes(value) ? prev.filter(option => option !== value) : [...prev, value]
        );
    };

    const handleRadioChange = (value: string) => {
        setSelectedRadio(value);
    };

    const handleReset = () => {
        setSelectedOptions([]);
        setSelectedRadio('Score Tertinggi');
    };

    const handleApply = () => {
        console.log('Filters applied:', selectedOptions, selectedRadio);
        setIsOpen(false); // Close the panel after applying filters
    };

    const checkboxOptions: FilterOption[] = [
        { label: 'Internal BRI', value: 'internal-bri', count: 203520 },
        { label: 'PNM', value: 'pnm', count: 179749 },
        { label: 'Microsite', value: 'microsite', count: 0 },
        { label: 'Indogrosir', value: 'indogrosir', count: 804 },
        { label: 'Pojok Digital BRIRINS', value: 'pojok-digital-bririns', count: 0 },
    ];

    return (
        <div>
            <button
                className="bg-orange-500 text-white p-2 rounded-lg"
                onClick={togglePanel}
            >
                Filter
            </button>

            {isOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h2 className="text-xl font-semibold mb-4">Filter Pipeline Akuisisi</h2>

                        <div className="mb-4">
                            <h3 className="font-semibold mb-2">Urutkan</h3>
                            <div>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="sort"
                                        value="Jarak Terdekat"
                                        checked={selectedRadio === 'Jarak Terdekat'}
                                        onChange={(e) => handleRadioChange(e.target.value)}
                                        className="mr-2"
                                    />
                                    Jarak Terdekat
                                </label>
                                <label className="flex items-center mt-2">
                                    <input
                                        type="radio"
                                        name="sort"
                                        value="Score Tertinggi"
                                        checked={selectedRadio === 'Score Tertinggi'}
                                        onChange={(e) => handleRadioChange(e.target.value)}
                                        className="mr-2"
                                    />
                                    Score Tertinggi
                                </label>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h3 className="font-semibold mb-2">Sumber Data</h3>
                            {checkboxOptions.map(option => (
                                <label key={option.value} className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            value={option.value}
                                            checked={selectedOptions.includes(option.value)}
                                            onChange={() => handleCheckboxChange(option.value)}
                                            className="mr-2"
                                        />
                                        {option.label}
                                    </div>
                                    <span>{option.count}</span>
                                </label>
                            ))}
                        </div>

                        <div className="flex justify-between">
                            <button
                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
                                onClick={handleReset}
                            >
                                RESET
                            </button>
                            <button
                                className="bg-orange-500 text-white px-4 py-2 rounded-lg"
                                onClick={handleApply}
                            >
                                FILTER

                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterPanel;
