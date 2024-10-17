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
    firewall: 'firewall',
    sslo: 'sslo',
    waf: 'waf',
  },
  compute: {
    storage: 'storage',
    host: 'host',
    vm: 'vm',
  },
  network: {
    f5: 'f5',
    ivat: 'ivat',
    dwdm: 'dwdm',
    dns: 'dns_rt',
    internal: 'internal',
  },
}