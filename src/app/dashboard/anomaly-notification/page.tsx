import React from 'react';

interface Anomaly {
    id: number;
    source: string;
    anomaly: string;
    severity: 'Very High' | 'High' | 'Medium'; // Define severity strictly
    identifier: string;
    timestamp: string;
}

const anomalies: Anomaly[] = [
    { id: 1, source: 'Log APM', anomaly: 'Error Rate APM', severity: 'Very High', identifier: 'primorsk', timestamp: '25 September 2024 03:25' },
    { id: 2, source: 'Log APM', anomaly: 'Error Rate APM', severity: 'High', identifier: 'primorsk', timestamp: '25 September 2024 03:25' },
    { id: 3, source: 'Log APM', anomaly: 'Error Rate APM', severity: 'Medium', identifier: 'primorsk', timestamp: '25 September 2024 03:25' },
    { id: 4, source: 'Log APM', anomaly: 'Error Rate APM', severity: 'Very High', identifier: 'primorsk', timestamp: '25 September 2024 03:25' },
    { id: 5, source: 'Log APM', anomaly: 'Error Rate APM', severity: 'Very High', identifier: 'primorsk', timestamp: '25 September 2024 03:25' },
];

const severityColors: Record<'Very High' | 'High' | 'Medium', string> = {
    'Very High': 'text-red-500',
    High: 'text-orange-500',
    Medium: 'text-yellow-500',
};

const AnomalyNotificationPage = () => {
    return (
        <div className="min-h-screen bg-[#0816358F] text-white p-8">

            <table className="table-auto w-full rounded-lg">
                <thead className='border-b'>
                    <tr className="text-left text-gray-300">
                        <th className="px-6 py-3">Source</th>
                        <th className="px-6 py-3">Anomaly</th>
                        <th className="px-6 py-3">Severity</th>
                        <th className="px-6 py-3">Identifier</th>
                        <th className="px-6 py-3">Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {anomalies.map((anomaly) => (
                        <tr key={anomaly.id} className="border-b">
                            <td className="px-6 py-4">{anomaly.source}</td>
                            <td className="px-6 py-4">{anomaly.anomaly}</td>
                            <td className="px-6 py-4">
                                <span
                                    className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${severityColors[anomaly.severity]}`}
                                >
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill={anomaly.severity === 'Very High' ? 'red' : anomaly.severity === 'High' ? 'orange' : 'yellow'}
                                        viewBox="0 0 8 8"
                                    >
                                        <circle cx="4" cy="4" r="3" />
                                    </svg>
                                    {anomaly.severity}
                                </span>
                            </td>
                            <td className="px-6 py-4">{anomaly.identifier}</td>
                            <td className="px-6 py-4">{anomaly.timestamp}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AnomalyNotificationPage;
