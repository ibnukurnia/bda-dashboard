export interface HistoricalAnomalyResponse {
  id: number
  impacted_date: string
  severity: string
  service: string
  description: string
  total_alerts: number
  // status: string
  // assignees: string
}

export interface MostRecentAnomalyResponse {
  name: string
  total: number
}

export interface SeverityRationRepsonse {
  severity: string
  percentage: number
}
