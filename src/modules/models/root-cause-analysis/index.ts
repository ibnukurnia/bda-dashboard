type Route = {
  anomaly:           string;
  name:              string;
  impacted_services: ImpactedService[];
  total:             number;
}
type Tooltip = {
  status_code: string;
  total: number;
}
type ImpactedService = {
  service:  string;
  service_alias:  string;
  total:    number;
  impacted: string[];
  tooltips: Tooltip[]
}
export interface RootCauseAnalysisTreeResponse {
  source: string;
  type: string;
  routes: Route[];
}
