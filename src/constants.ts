export const DEFAULT_DATA_SOURCE_NAMESPACE = "apm"

// export const DATA_SOURCE_NAMESPACE_REDIS = "redis"

export const TAB_DATA_SOURCE = [
  {
    textLabel: 'Apps',
    children: [
      {
        namespace: 'apm',
        textLabel: 'Log APM Brimo',
      },
      {
        namespace: 'brimo',
        textLabel: 'Log Transaksi Brimo',
      },
    ],
  },
  {
    textLabel: 'Platform',
    children: [
      {
        namespace: 'k8s_prometheus',
        textLabel: 'OCP',
      },
      {
        namespace: 'cluster_operator',
        textLabel: 'OCP Cluster Operator',
      },
      {
        namespace: 'cluster_pod_capacity',
        textLabel: 'OCP Cluster Pod Capacity',
      },
    ],
  },
  {
    textLabel: 'Database',
    children: [
      {
        namespace: 'k8s_db',
        textLabel: 'Database',
      },
      {
        textLabel: 'Redis',
        children: [
          {
            namespace: 'redis_node',
            textLabel: 'Redis Node',
          },
          {
            namespace: 'redis',
            textLabel: 'Redis Cluster',
          },
        ],
      },
    ],
  },
  {
    textLabel: "Compute",
    children: [
      {
        namespace: 'compute_vm',
        textLabel: 'VM',
      },
      {
        namespace: 'compute_host',
        textLabel: 'Host',
      },
      {
        namespace: 'compute_store',
        textLabel: 'Datastore',
      },
    ],
  },
  {
    textLabel: 'Network',
    children: [
      {
        textLabel: 'IVAT',
        namespace: 'ivat',
      },

      {
        textLabel: 'Perangkat DWDM',
        children: [
          {
            namespace: 'solarwinds_dwdm',
            textLabel: 'Node',
          },
          {
            namespace: 'solarwinds_traffic_dwdm',
            textLabel: 'Interface',
          },
        ],
      },

      {
        textLabel: 'Perangkat Internal',
        children: [
          {
            namespace: 'solarwinds_internal',
            textLabel: 'Node',
          },
          {
            namespace: 'solarwinds_traffic_internal',
            textLabel: 'Interface',
          },
        ],
      },

      {
        textLabel: 'Perangkat Internet',
        children: [
          {
            namespace: 'isp_node',
            textLabel: 'Node',
          },
          {
            namespace: 'isp_traffic',
            textLabel: 'Interface',
          },
        ],
      },
      {
        textLabel: 'Perangkat F5',
        namespace: 'f5',
      },
      {
        textLabel: 'DNS',
        children: [
          {
            textLabel: 'Domain Nslookup',
            namespace: 'dns_rt',
          },
          {
            namespace: 'dns_infoblox',
            textLabel: 'Infoblox (Query rate & Latency)',
          },
        ],
      },
    ],
  },
  {
    textLabel: 'Security',
    children: [
      {
        textLabel: 'Log Security',
        children: [
          {
            namespace: 'panw',
            textLabel: 'PANW',
          },
          {
            namespace: 'forti',
            textLabel: 'FORTI',
          },
          {
            namespace: 'waf',
            textLabel: 'WAF',
          },
        ],
      },
      {
        textLabel: 'Perangkat SSLO',
        children: [
          {
            namespace: 'prtg_sslo',
            textLabel: 'Utilization',
          },
          {
            namespace: 'prtg_traffic_sslo',
            textLabel: 'Interface',
          },
        ],
      },
      {
        textLabel: 'Perangkat WAF',
        children: [
          {
            namespace: 'prtg_waf',
            textLabel: 'Utilization',
          },
          {
            namespace: 'prtg_traffic_waf',
            textLabel: 'Interface',
          },
        ],
      },
      {
        textLabel: 'Perangkat Firewall',
        children: [
          {
            namespace: 'prtg_firewall',
            textLabel: 'Utilization',
          },
          {
            namespace: 'prtg_traffic_firewall',
            textLabel: 'Interface',
          },
        ],
      },
      {
        textLabel: 'Respones Time (Erangel)',
        namespace: 'zabbix',
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
