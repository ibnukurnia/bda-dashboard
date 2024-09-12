type Route = {
  anomaly:           string;
  impacted_services: ImpactedService[];
  total:             number;
}
type ImpactedService = {
  service:  string;
  total:    number;
  impacted: string[];
}
export interface RootCauseAnalysisTreeResponse {
  source: string;
  routes: Route[];
}
