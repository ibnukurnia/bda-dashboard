export const HEALTHINESS_LEGEND = [
  {
    color: '#D23636',
    label: 'Very High',
  },
  {
    color: '#FF802D',
    label: 'High',
  },
  // {
  //   color: '#08B96D',
  //   label: 'Low',
  // },
]

// Section configuration
export const SECTIONS_CONFIG = {
  apps: {
    apm: 'apm',
    brimo: 'brimo',
    ocp: 'k8s_prometheus',
    database: 'k8s_db',
  },
  redis: {
    redis: 'redis',
    redis_node: 'redis_node',
  },
  security: {
    firewall: 'prtg_firewall',
    sslo: 'prtg_sslo',
    waf: 'prtg_waf',
  },
  compute: {
    storage: 'compute_storage',
    host: 'compute_host',
    vm: 'compute_vm',
  },
  network: {
    f5: 'f5',
    ivat: 'ivat',
    dwdm: 'solarwinds_dwdm',
    internal: 'solarwinds_internal',
  },
  dns: {
    dns_domain: 'dns_domain',
    dns_infobox: 'dns_infobox',
  },
}
