export const DEFAULT_DATA_SOURCE_NAMESPACE = "apm"

export const DATA_SOURCE_NAMESPACE_REDIS = "redis"

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
      {
        namespace: DATA_SOURCE_NAMESPACE_REDIS,
        textLabel: "Redis",
      },
      {
        namespace: "compute_vm",
        textLabel: "Compute VM",
      },
      {
        namespace: "compute_host",
        textLabel: "Compute Host",
      },
      {
        namespace: "compute_datastore",
        textLabel: "Compute Datastore",
      },
    ],
  },
  {
    textLabel: "Network",
    children: [
      {
        textLabel: "Ivat",
        namespace: "ivat"
      },

      {
        textLabel: "Solarwinds", // New group for PANW, FORTI, and WAF
        children: [
          {
            namespace: "solarwinds_dwdm",
            textLabel: "DWDM",
          },
          {
            namespace: "solarwinds_internal",
            textLabel: "Internal",
          },

        ],
      },

      {
        textLabel: "SolarWinds Traffic", // New group for PANW, FORTI, and WAF
        children: [
          {
            namespace: "solarwinds_traffic_dwdm",
            textLabel: "DWDM",
          },
          {
            namespace: "solarwinds_traffic_internal",
            textLabel: "Internal",
          },

        ],
      },
      {

        textLabel: "DNS",
        namespace: "dns_rt"
      },
      {

        textLabel: "F5",
        namespace: "f5"
      }
    ]
  },
  {
    textLabel: "Security",
    children: [
      {
        textLabel: "Log Security", // New group for PANW, FORTI, and WAF
        children: [
          {
            namespace: "panw",
            textLabel: "PANW",
          },
          {
            namespace: "forti",
            textLabel: "FORTI",
          },
          {
            namespace: "waf",
            textLabel: "WAF",
          },
        ],
      },
      {
        textLabel: "PRTG", // New group for PANW, FORTI, and WAF
        children: [
          {
            namespace: "prtg_sslo",
            textLabel: "SSLO",
          },
          {
            namespace: "prtg_waf",
            textLabel: "WAF",
          },
          {
            namespace: "prtg_firewall",
            textLabel: "Firewall",
          },
        ],
      },
      {
        textLabel: "PRTG Traffic", // New group for PANW, FORTI, and WAF
        children: [
          {
            namespace: "prtg_traffic_sslo",
            textLabel: "SSLO",
          },
          {
            namespace: "prtg_traffic_waf",
            textLabel: "WAF",
          },
          {
            namespace: "prtg_traffic_firewall",
            textLabel: "Firewall",
          },
        ],
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
  'redis': "Redis",
  'compute_vm': "Compute VM",
  'compute_host': "Compute Host",
  'compute_storage': "Compute Storage",
  'compute_datastore': "Compute Datastore",
  'ivat': "IVAT",
  'solarwinds': "Solar Winds",
  'dns_rt': "DNS",
  'f5': "F5",
  'panw': "PANW",
  'forti': "FORTI",
  'waf': "WAF",
  'prtg': "PRTG",
  'prtg_sslo': "PRTG SSLO",
  'prtg_waf': 'PRTG WAF',
  'prtg_firewall': 'PRTG Firewall',
  'prtg_traffic_sslo': "PRTG Traffic SSLO",
  'prtg_traffic_waf': 'PRTG Traffic WAF',
  'prtg_traffic_firewall': 'PRTG Firewall',
  'solarwinds_dwdm': 'Solarwinds DWDM',
  'solarwinds_internal': 'Solarwinds Internal',
  'solarwinds_traffic_dwdm': 'Solarwinds Traffic DWDM',
  'solarwinds_traffic_internal': 'Solarwinds Traffic Internal',
  'zabbix': "Zabbix",
}

export const SEVERITY_LABELS: Record<string, string> = {
  'very_high': "Very High",
  'high': "High",
  'medium': "Medium",
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
