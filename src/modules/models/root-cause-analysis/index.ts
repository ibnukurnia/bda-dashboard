type Route = {
  anomaly: string
  name: string
  impacted_services: ImpactedService[]
  total: number
}
type Tooltip = {
  status_code: string
  total: number
}
export type NLP = {
  resolution: string
  action: string
  name: string
  description: string | null
  lesson_learned: string | null
}
type ImpactedService = {
  cluster: string
  service: string
  service_alias: string
  total: number
  impacted: string[]
  function: string
  tooltips: Tooltip[]
  nlp?: NLP
}
export interface RootCauseAnalysisTreeResponse {
  source: string
  type: string
  routes: Route[]
}
