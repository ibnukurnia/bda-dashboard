export const DEFAULT_DATA_SOURCE_NAMESPACE = "apm"

export const TAB_DATA_SOURCE = [
  {
    textLabel: "Logs",
    children: [
      {
        namespace: "apm",
        textLabel: "Log APM Brimo",
      },
      {
        namespace: "brimo",
        textLabel: "Log Transaksi Brimo",
      },
    ],
  },
  {
    textLabel: "Utilization",
    children: [
      {
        namespace: "k8s_prometheus",
        textLabel: "OCP",
      },
      {
        namespace: "k8s_db",
        textLabel: "Database",
      },
    ],
  },
  {
    namespace: "ivat",
    textLabel: "Network",
  },
  {
    textLabel: "Security",
    children: [
      {
        textLabel: "PANW",
        namespace: "panw",
      },
      {
        textLabel: "Fortinet",
        namespace: "forti",
      },
      {
        textLabel: "WAF",
        namespace: "waf",
      },
      {
        textLabel: "PRTG",
        namespace: "prtg",
      },
      {
        textLabel: "Zabbix",
        namespace: "zabbix",
      },
    ],
  },
]
export const NAMESPACE_LABELS: Record<string, string> = {
  'apm': "Log APM Brimo",
  'brimo': "Log Transaksi Brimo",
  'k8s_prometheus': "OCP",
  'k8s_db': "Database",
  'ivat': "IVAT",
  'panw': "PANW",
  'fortinet': "Fortinet",
  'waf': "WAF",
  'prtg': "PRTG",
  'zabbix': "Zabbix",
}

export const SEVERITY_LABELS: Record<string, string> = {
  'critical': "Very High",
  'major': "High",
  'minor': "Medium",
}

export const DEFAULT_TIME_RANGE = 'Last 15 minutes'
export const PREDEFINED_TIME_RANGES: Record<string, number> = {
  'Last 5 minutes': 5,
  'Last 10 minutes': 10,
  'Last 15 minutes': 15,
  'Last 30 minutes': 30,
  'Last 1 hours': 60,
  'Last 3 hours': 180,
  'Last 6 hours': 360,
  'Last 24 hours': 1440,
  // 'Last 3 days': 4320,
  // 'Last 1 week': 10080,
  // 'Last 1 month': 43800,
}

export const ROWS_PER_PAGE_OPTIONS = [5, 10, 15, 25, 50]
