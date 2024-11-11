export const DEFAULT_DATA_SOURCE_NAMESPACE = "apm"

// export const DATA_SOURCE_NAMESPACE_REDIS = "redis"

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
        textLabel: "OCP",
        children: [
          {
            namespace: "k8s_prometheus",
            textLabel: "OCP",
          },
          {
            namespace: "cluster_operator",
            textLabel: "OCP Cluster Operator",
          },
          {
            namespace: "cluster_pod_capacity",
            textLabel: "OCP Cluster Pod Capacity",
          },

        ],
      },
      {
        namespace: "k8s_db",
        textLabel: "Database",
      },
      {
        textLabel: "Redis",
        children: [
          {
            namespace: "redis_node",
            textLabel: "Redis Node",
          },
          {
            namespace: "redis",
            textLabel: "Redis Cluster",
          },

        ],

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
        namespace: "compute_store",
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
          {
            namespace: "dns_infoblox",
            textLabel: "DNS Infloblox",
          },
          {
            namespace: "isp_node",
            textLabel: "ISP Node",
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
          {
            namespace: "isp_traffic",
            textLabel: "ISP Traffic",
          }
        ],
      },
      {

        textLabel: "Domain",
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
  'cluster_operator': 'OCP Cluster Operator',
  'cluster_pod_capacity': 'OCP Cluster Pod Capacity',
  'k8s_db': "Database",
  'redis': "Redis Cluster",
  'redis_node': 'Redis Node',
  'compute_vm': "Compute VM",
  'compute_host': "Compute Host",
  'compute_storage': "Compute Storage",
  'compute_store': "Compute Datastore",
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
  'dns_infoblox': 'DNS Infoblox',
  'isp_traffic': 'ISP Traffic',
  'isp_node': 'ISP Node'
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
