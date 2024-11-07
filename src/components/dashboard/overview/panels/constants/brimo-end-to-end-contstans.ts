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
    redis: 'redis',
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
    dns_domain: 'dns_domain',
    dns_infobox: 'dns_infoblox',
    internal: 'solarwinds_internal',
    isp: 'isp',
  },
}
