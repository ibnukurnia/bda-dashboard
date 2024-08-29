export interface Anomaly {
    timestamp: string;
    service_name: string;
    status_code: string;
    response_time: string;
    pod_name: string;
}

export type ColumnOption = {
    name: string;
    type: string;
    comment: string;
}
