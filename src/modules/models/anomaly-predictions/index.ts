export interface HistoricalAnomalyLogApmResponse {
  timestamp: string
  service_name: string
  tps_apm: string
  max_rt: string
  count_success_200: number
  count_errors_400: number
  count_errors_500: number
}

export interface MetricLogAnomalyResponse {
  title: string,
  anomalies: [
    Date,
    number,
  ][],
  data: [
    Date,
    number,
  ][],
}

export interface TimeRangeOption {
  label: string;
  value: number;
}

export interface Column {
  name: string;
  type: string;
  comment: string;
}

export interface AnomalyOptionResponse {
  columns: Column[];  // This represents the array of columns in the response
}

export interface ServicesOptionResponse {
  services: string[];  // This represents the array of columns in the response
}

export interface HistoricalAnomalyLogBrimoResponse {
  timestamp: string
  service: string
  response_code: string
  trx_type: string
  response_desc: string
}

export interface HistoricalAnomalyUtilizationResponse {
  event_triggered: number
  total_alerts: number
  on_going_situation: number
  avg_time_solved: number
}

export interface HistoricalAnomalyNetworkResponse {
  event_triggered: number
  total_alerts: number
  on_going_situation: number
  avg_time_solved: number

}
export interface HistoricalAnomalySecurityResponse {
  event_triggered: number
  total_alerts: number
  on_going_situation: number
  avg_time_solved: number
}

export interface MostRecentAnomalyResponse {
  name: string
  total: number
}

// export interface SeverityRationRepsonse {
//   severity: string
//   percentage: number
// }

export interface ClusterOptionResponse {
  label: string;
  name: string;
}

export interface ServiceOptionByClusterResponse {
  service_name: string
  cluster: string
}
