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
export type NLP = {
  resolution: string;
  action: string;
}
type ImpactedService = {
  service:  string;
  service_alias:  string;
  total:    number;
  impacted: string[];
  tooltips: Tooltip[];
  nlp?: NLP;
}
export interface RootCauseAnalysisTreeResponse {
  source: string;
  type: string;
  routes: Route[];
}
