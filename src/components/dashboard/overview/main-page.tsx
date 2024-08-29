'use client'

import React, { useState } from 'react'

// Define your data
const sourceData = [
    {
        name: "APM",
        count: 1865,
        services: [
            { name: "Windows", count: 1625, data: [28, 133, 124, 127, 132, 129, 134] },
            { name: "Linux", count: 1240, data: [28, 133, 124, 127, 132, 129, 134] },
            { name: "MacOS", count: 780, data: [28, 133, 124, 127, 132, 129, 134] },
        ],
    },
    {
        name: "BRIMO",
        count: 1862,
        services: [
            { name: "Windows", count: 1102, data: [28, 133, 124, 127, 132, 129, 134] }, // Same service name as APM
            { name: "XY", count: 1580, data: [28, 133, 124, 127, 132, 129, 134] },
        ],
    },
    {
        name: "PROMETHEUS API",
        count: 1567,
        services: [
            { name: "Winqowdkoqk", count: 980, data: [28, 133, 124, 127, 132, 129, 134] },
            { name: "Z/OS System", count: 587, data: [28, 133, 124, 127, 132, 129, 134] },
        ],
    },
    {
        name: "PANW",
        count: 684,
        services: [
            { name: "Server", count: 450, data: [28, 133, 124, 127, 132, 129, 134] },
            { name: "Processor", count: 234, data: [28, 133, 124, 127, 132, 129, 134] },
        ],
    },
];

const dates = ['Jan 21', 'Jan 22', 'Jan 23', 'Jan 24', 'Jan 25', 'Jan 26', 'Jan 27'];

const FilterPanel = ({ onSelectServices }: { onSelectServices: (services: { name: string; data: number[] }[]) => void }) => {
    const [selectedSourceIndices, setSelectedSourceIndices] = useState<number[]>([]);
    const [selectedServiceOptions, setSelectedServiceOptions] = useState<string[]>([]);

    const handleSourceClick = (index: number) => {
        setSelectedSourceIndices((prevIndices) =>
            prevIndices.includes(index)
                ? prevIndices.filter((i) => i !== index)
                : [...prevIndices, index]
        );
    };

    const handleServiceChange = (service: { name: string; data: number[] }) => {
        setSelectedServiceOptions((prevServices) =>
            prevServices.includes(service.name)
                ? prevServices.filter((s) => s !== service.name)
                : [...prevServices, service.name]
        );

        // Update the selected services
        onSelectServices((prevServices: { name: string; data: number[] }[]) => {
            const serviceExists = prevServices.some((s) => s.name === service.name);

            // Calculate the new array of services
            const updatedServices = serviceExists
                ? prevServices.filter((s) => s.name !== service.name)
                : [...prevServices, service];

            // Directly pass the updated array to onSelectServices
            return updatedServices;
        });
    };

    const selectedServices = selectedSourceIndices
        .flatMap((index) =>
            sourceData[index].services.map((service) => ({
                ...service,
                name: `${sourceData[index].name} - ${service.name}`, // Append source name to service name
            }))
        )
        .reduce((acc, service) => {
            const existingService = acc.find((s) => s.name === service.name);
            if (existingService) {
                existingService.count += service.count;
            } else {
                acc.push({ ...service });
            }
            return acc;
        }, [] as { name: string; count: number; data: number[] }[]);

    return (
        <div className="bg-gray-900 text-white w-64 p-4 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <h3 className="text-lg font-bold">SOURCE DATA</h3>
                <ul>
                    {sourceData.map((item, index) => (
                        <li
                            key={index}
                            className={`flex items-center gap-3 my-3 cursor-pointer`}
                            onClick={() => handleSourceClick(index)}
                        >
                            <input
                                type="checkbox"
                                value={item.name}
                                checked={selectedSourceIndices.includes(index)}
                                onChange={() => handleSourceClick(index)}
                                className="mr-2"
                            />
                            <span>{item.name}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex flex-col gap-3">
                <h3 className="text-lg font-bold">Service</h3>
                <ul>
                    {selectedServices.map((service, index) => (
                        <li key={index} className="flex items-center gap-3 my-3">
                            <input
                                type="checkbox"
                                value={service.name}
                                checked={selectedServiceOptions.includes(service.name)}
                                onChange={() => handleServiceChange(service)}
                                className="mr-2"
                            />
                            <span>{service.name}</span>
                            <span className="bg-blue-500 text-white rounded-full px-2">
                                {service.count}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const TablePanel = ({ selectedServices }: { selectedServices: { name: string; data: number[] }[] }) => {
    return (
        <div className="flex-1 p-4 overflow-auto">
            <div className="flex justify-between items-center mb-4 text-white">
                <span className="font-bold">Showing {selectedServices.length} Services</span>
                <span className="font-bold">Updated at 5:21:11 PM</span>
            </div>
            <table className="w-full table-auto text-white">
                <thead className="border-2">
                    <tr>
                        <th className="text-left p-2">Service Name</th>
                        {dates.map((date) => (
                            <th key={date} className="p-2">
                                {date}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {selectedServices.map((service, index) => (
                        <tr key={index} className="bg-gray-800 odd:bg-gray-700">
                            <td className="p-2">{service.name}</td>
                            {service.data.map((cell, cellIndex) => (
                                <td key={cellIndex} className="p-2 text-center">
                                    <span className="bg-red-600 text-white px-2 py-1 rounded-full">
                                        {cell}
                                    </span>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const MainPageOverview = () => {
    const [selectedServices, setSelectedServices] = useState<{ name: string; data: number[] }[]>([]);

    return (
        <div className="flex flex-row">
            <FilterPanel onSelectServices={setSelectedServices} />
            <TablePanel selectedServices={selectedServices} />
        </div>
    );
};

export default MainPageOverview;
