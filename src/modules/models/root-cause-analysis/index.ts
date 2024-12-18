type Route = {
  anomaly: string
  name: string
  impacted_services: ImpactedService[]
  total: number
}
export type Tooltip = {
  status_code: string
  total: number
}
export type Param = {
  key: string
  value: string
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
  nlp?: NLP[]
  detail_params: Param[]
}
export interface RootCauseAnalysisTreeResponse {
  source: string
  type: string
  routes: Route[]
}
export interface RootCauseAnalysisSearchIncidentResponse {
  action_item: string
  resolusi_root_cause: string
  nama_insiden: string
  deskripsi_insiden: string
  lesson_learned: string
}

