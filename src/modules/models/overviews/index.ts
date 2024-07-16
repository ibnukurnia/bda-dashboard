export interface CurrentSituation {
  id: number
  created_date: string
  severity: string
  service: string
  description: string
  total_alerts: number
  status: string
  assignees: { email: string }[]
}

export interface InsightOverviewResponse {
  event_triggered: number
  total_alerts: number
  on_going_situation: number
  avg_time_solved: number
  current_situations: CurrentSituation[]
}

export interface TeamOverviewResponse {
  solved: number
  on_progress: number
  team_member: number
  overviews: Overviews[]
}

export interface ServiceOverviewResponse {
  situation_ids: number[]
  service_name: string
  open_issues: number
  contributor: number
  current_condition: string
  last_impacted: string
}

export interface MetricsOverviewResponse {
  series: { name: string; data: number[] }[],
  categories: string;
}

interface Overviews {
  id: number
  service_name: string
  impacted_duration: string
  open_issues: number
  contributor: number
  alert_attempt: number
}
