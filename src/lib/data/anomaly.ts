// lib/data/anomalyData.ts
import anomalyData from './anomalyDummy.json';

interface Anomaly {
    timestamp: string;
    service_name: string;
    status_code: string;
    response_time: string;
    pod_name: string;
}

function updateTimestamps(dataArray: Anomaly[], newDate: string): Anomaly[] {
    return dataArray.map(item => {
        const timePart = item.timestamp.split(' ')[1].split('+')[0];
        const newTimestamp = `${newDate} ${timePart}+00:00`;
        return {
            ...item,
            timestamp: newTimestamp
        };
    });
}

// Apply the transformation
const updatedAnomalyData = updateTimestamps(anomalyData, '2024-08-06');

export default updatedAnomalyData;
