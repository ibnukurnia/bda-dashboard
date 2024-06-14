export type AnomalyPrediction = {
    id: number,
    impacted_date: string,
    severity: string,
    service: string,
    description: string,
    total_alerts: number
}