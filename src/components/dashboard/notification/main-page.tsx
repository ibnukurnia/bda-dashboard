'use client';

import React, { useEffect, useState } from 'react';
import { GetNotificationList } from '@/modules/usecases/notification';

interface Anomaly {
    source: string;
    anomaly_description: string;
    identifier: string;
    timestamp: string;
    site: string;
}

interface Column {
    title: string;
    key: string;
}

const AnomalyNotificationPage = () => {
    const [columns, setColumns] = useState<Column[]>([]);
    const [rows, setRows] = useState<Anomaly[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setIsLoading(true);
                const response = await GetNotificationList();
                const data = response.data;
                setColumns(data.columns); // Setting columns from the API
                setRows(data.rows); // Setting rows from the API
                setIsError(false);
            } catch (error) {
                console.error('Error fetching notifications:', error);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    if (isLoading) {
        return <div className="text-white p-8">Loading...</div>;
    }

    if (isError) {
        return <div className="text-red-500 p-8">Failed to load notifications.</div>;
    }

    return (
        <div className="min-h-screen bg-[#0816358F] text-white p-8">

            <table className="table-auto w-full rounded-lg text-sm">
                <thead className="border-b border-gray-700">
                    <tr className="text-left text-gray-300">
                        {columns.map((col) => (
                            <th key={col.key} className="px-6 py-3">
                                {col.title}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={index} className="border-b border-gray-700">
                            {columns.map((col) => (
                                <td key={col.key} className="px-6 py-4 text-white">
                                    {row[col.key as keyof Anomaly] || '-'} {/* Handle missing values */}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AnomalyNotificationPage;
