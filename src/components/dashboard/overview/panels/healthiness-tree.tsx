import './healthiness-tree.css'; // Import the custom CSS for styling paths
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { HealthScoreResponse } from '@/modules/models/overviews';
import { formatNumberWithCommas } from '@/helper';
import { Typography } from '@mui/material';
import CollapseIcon from '@/components/system/Icon/CollapseIcon';
import Link from 'next/link';

const getColor = (severity: number) => {
  if (severity === 0 || severity === 3) {
    return '22,163,74'
  }
  if (severity === 1) {
    return '210,54,54'
  }
  if (severity === 2) {
    return '255,128,45'
  }
  return '213,213,213'
}

interface ConditionalLinkProps {
  dataSource?: string;
  children: React.ReactNode
}
const ConditionalLink: React.FC<ConditionalLinkProps> = ({ dataSource, children }) => {
  return dataSource ? (
    <Link
      className='inline-block hover:bg-white hover:bg-opacity-20 rounded text-center'
      href={{
        pathname: '/dashboard/root-cause-analysis',
        query: {
          data_source: dataSource,
        },
      }}
    >
      {children}
    </Link>
  ) : (
    <>{children}</>
  );
};

interface NodeProps {
  className?: string;
  title: string;
  dataSource?: string;
  iconName: string;
  score: number;
  severity: number;
  handleOnClick?: () => void;
}
const Node = forwardRef<HTMLDivElement, NodeProps>(({
  className,
  title,
  dataSource,
  iconName,
  score,
  severity,
  handleOnClick,
}, ref) => (
  <div className={`${className} ${handleOnClick != null ? 'cursor-pointer hover:bg-white hover:bg-opacity-20 rounded' : ''} flex flex-col items-center`} onClick={handleOnClick}>
    <ConditionalLink
      dataSource={dataSource}
    >
      <div
        ref={ref}
        className={`w-[52px] h-[52px] m-auto flex justify-center items-center rounded-2xl ${severity === 1 ? "blinking-bg" : ""} bg-[rgb(${getColor(severity)})]`}
        style={{
          '--dynamic-color': getColor(severity),
          backgroundColor: 'rgb(var(--dynamic-color))',
        } as React.CSSProperties}
      >
        <img
          src={`/assets/dashboard/overview/${iconName}`}
          width={29}
          height={28}
          alt='logo'
        />
      </div>
      <Typography
        fontWeight={600}
        fontSize={16}
        color={'white'}
        lineHeight={'19.5px'}
        align='center'
        sx={{ whiteSpace: 'pre-wrap' }}
      >
        {title}
      </Typography>
      <Typography
        fontWeight={500}
        fontSize={14}
        color={'#FFFFFFBF'}
        lineHeight={'17.07px'}
      >
        {score ? formatNumberWithCommas(score, 2) : score}%
      </Typography>
    </ConditionalLink>
  </div>
))


interface GroupProps {
  children: React.ReactNode
  className?: string
  title: string
  score: number
  severity: number
  expanded: boolean
  iconName: string
  handleOnClick: () => void
}
const GroupNode: React.FC<GroupProps> = ({
  children,
  className,
  title,
  score,
  severity,
  expanded,
  iconName,
  handleOnClick,
}) => {
  if (!expanded) {
    return (
      <Node
        className='mt-10'
        title={title}
        iconName={iconName}
        score={score}
        severity={severity}
        handleOnClick={handleOnClick}
      />
    )
  }
  return (
    <div
      className={`${className} flex flex-col gap-4 border-[1px] border-white border-opacity-30 bg-white bg-opacity-5 rounded-2xl`}
      style={{
        '--dynamic-color': getColor(severity),
        borderColor: 'rgb(var(--dynamic-color))',
      } as React.CSSProperties}
    >
      <div className='py-3 px-5 w-full flex gap-4 items-center justify-between'>
        <div className='flex flex-col'>
          <Typography
            fontWeight={700}
            fontSize={16}
            color={'white'}
            lineHeight={'19.5px'}
          >
            {title}
          </Typography>
          <Typography
            fontWeight={500}
            fontSize={14}
            color={'#FFFFFFCC'}
            lineHeight={'17.07px'}
          >
            {formatNumberWithCommas(score)}%
          </Typography>
        </div>
        <button
          className=' py-1 px-3 flex gap-[5px] items-center rounded-md bg-white bg-opacity-10 hover:bg-opacity-20'
          onClick={handleOnClick}
        >
          <CollapseIcon />
          <Typography
            fontWeight={700}
            fontSize={12}
            color={'white'}
            lineHeight={'14.63px'}
          >
            Collapse
          </Typography>
        </button>
      </div>
      {children}
    </div>
  )
}

interface HealthinessTreeProps {
  data: HealthScoreResponse[];
}

const HealthinessTree: React.FC<HealthinessTreeProps> = ({
  data,
}) => {
  const containerRef = useRef<HTMLDivElement>(null); // Ref for the wrapper div

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const [firewallData, setFirewallData] = useState({
    title: 'Firewall',
    dataSource: 'firewall',
    iconName: 'node-icon-firewall.svg',
    score: 100,
    severity: 0,
  })
  const [ssloData, setSsloData] = useState({
    title: 'SSLO',
    dataSource: 'sslo',
    iconName: 'node-icon-sslo.svg',
    score: 100,
    severity: 0,
  })
  const [wafData, setWafData] = useState({
    title: 'WAF',
    dataSource: 'waf',
    iconName: 'node-icon-waf.svg',
    score: 100,
    severity: 0,
  })
  const [securityData, setSecurityData] = useState({
    title: 'Security',
    dataSource: 'security',
    iconName: 'node-icon-security.svg',
    score: 100,
    severity: 0,
  })

  const [storageData, setStorageData] = useState({
    title: 'Storage',
    dataSource: 'storage',
    iconName: 'node-icon-storage.svg',
    score: 100,
    severity: 0,
  })
  const [hostData, setHostData] = useState({
    title: 'Host',
    dataSource: 'host',
    iconName: 'node-icon-host.svg',
    score: 100,
    severity: 0,
  })
  const [vmData, setVmData] = useState({
    title: 'VM',
    dataSource: 'vm',
    iconName: 'node-icon-vm.svg',
    score: 100,
    severity: 0,
  })
  const [computeData, setComputeData] = useState({
    title: 'Compute',
    dataSource: 'compute',
    iconName: 'node-icon-compute.svg',
    score: 100,
    severity: 0,
  })

  const [f5Data, setF5Data] = useState({
    title: 'F5',
    dataSource: 'f5',
    iconName: 'node-icon-f5.svg',
    score: 100,
    severity: 0,
  })
  const [ivatData, setIvatData] = useState({
    title: 'IVAT',
    dataSource: 'ivat',
    iconName: 'node-icon-ivat.svg',
    score: 100,
    severity: 0,
  })
  const [dwdmData, setDwdmData] = useState({
    title: 'DWDM',
    dataSource: 'dwdm',
    iconName: 'node-icon-dwdm.svg',
    score: 100,
    severity: 0,
  })
  const [dnsData, setDnsData] = useState({
    title: 'DNS',
    dataSource: 'dns_rt',
    iconName: 'node-icon-dns.svg',
    score: 100,
    severity: 0,
  })
  const [perangkatInternalData, setInternalData] = useState({
    title: 'Perangkat\nInternal',
    dataSource: 'internal',
    iconName: 'node-icon-perangkat-internal.svg',
    score: 100,
    severity: 0,
  })
  const [totalNetworkData, setTotalNetworkData] = useState({
    title: 'Network',
    dataSource: 'network',
    iconName: 'node-icon-network.svg',
    score: 100,
    severity: 0,
  })

  const [apmData, setApmData] = useState({
    title: 'APM',
    dataSource: 'apm',
    iconName: 'node-icon-apm.svg',
    score: 100,
    severity: 0,
  })
  const [brimoData, setBrimoData] = useState({
    title: 'BRImo',
    dataSource: 'brimo',
    iconName: 'node-icon-brimo.svg',
    score: 100,
    severity: 0,
  })
  const [ocpData, setOcpData] = useState({
    title: 'OCP',
    dataSource: 'k8s_prometheus',
    iconName: 'node-icon-ocp.svg',
    score: 100,
    severity: 0,
  })
  const [databaseData, setDatabaseData] = useState({
    title: 'Database',
    dataSource: 'k8s_db',
    iconName: 'node-icon-database.svg',
    score: 100,
    severity: 0,
  })
  const [redisData, setRedisData] = useState({
    title: 'Redis',
    dataSource: 'k8s_redis',
    iconName: 'node-icon-redis.svg',
    score: 100,
    severity: 0,
  })
  const [totalAppsData, setTotalAppsData] = useState({
    title: 'Apps',
    iconName: 'node-icon-apps.svg',
    score: 100,
    severity: 0,
  })
  const [appsExpanded, setAppsExpanded] = useState(true)
  const [computeExpanded, setComputeExpanded] = useState(true)
  const [securityExpanded, setSecurityExpanded] = useState(true)
  const [networkExpanded, setNetworkExpanded] = useState(true)

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        setDimensions({ width: offsetWidth, height: offsetHeight });

      }
    };

    updateDimensions(); // Set initial dimensions
    window.addEventListener('resize', updateDimensions); // Update on resize
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [])

  useEffect(() => {
    const firewall = data.find(d => d.data_source === "firewall")
    const sslo = data.find(d => d.data_source === "sslo")
    const waf = data.find(d => d.data_source === "waf")
    const security = data.find(d => d.data_source === "security")

    const storage = data.find(d => d.data_source === "storage")
    const host = data.find(d => d.data_source === "host")
    const vm = data.find(d => d.data_source === "vm")
    const compute = data.find(d => d.data_source === "compute")

    const f5 = data.find(d => d.data_source === "f5")
    const ivat = data.find(d => d.data_source === "ivat")
    const dwdm = data.find(d => d.data_source === "dwdm")
    const dns = data.find(d => d.data_source === "dns_rt")
    const internal = data.find(d => d.data_source === "internal")

    const database = data.find(d => d.data_source === "k8s_db")
    const redis = data.find(d => d.data_source === "k8s_redis")
    const ocp = data.find(d => d.data_source === "k8s_prometheus")
    const apm = data.find(d => d.data_source === "apm")
    const brimo = data.find(d => d.data_source === "brimo")

    setFirewallData(prev => ({
      ...prev,
      ...firewall,
    }))
    setSsloData(prev => ({
      ...prev,
      ...sslo,
    }))
    setWafData(prev => ({
      ...prev,
      ...waf,
    }))
    setSecurityData(prev => ({
      ...prev,
      ...security,
    }))

    setStorageData(prev => ({
      ...prev,
      ...storage,
    }))
    setHostData(prev => ({
      ...prev,
      ...host,
    }))
    setVmData(prev => ({
      ...prev,
      ...vm,
    }))
    setComputeData(prev => ({
      ...prev,
      ...compute,
    }))

    setF5Data(prev => ({
      ...prev,
      ...f5,
    }))
    setIvatData(prev => ({
      ...prev,
      ...ivat,
    }))
    setDwdmData(prev => ({
      ...prev,
      ...dwdm,
    }))
    setDnsData(prev => ({
      ...prev,
      ...dns,
    }))
    setInternalData(prev => ({
      ...prev,
      ...internal,
    }))
    
    const network = [f5, ivat, dwdm, dns, internal]
    const totalNetworkScore = network.reduce((temp, app) => {
      return temp + (app?.score ?? 100)
    }, 0) / network.length

    const warnedNetwork = network.filter(app => app != null && app.severity !== 0)
    const totalNetworkSeverity = warnedNetwork.length !== 0
      ? Math.min(...warnedNetwork.map(app => app?.severity ?? 3))
      : 0
    setTotalNetworkData(prev => ({
      ...prev,
      score: totalNetworkScore,
      severity: totalNetworkSeverity
    }))

    setApmData(prev => ({
      ...prev,
      ...apm,
    }))
    setBrimoData(prev => ({
      ...prev,
      ...brimo,
    }))
    setOcpData(prev => ({
      ...prev,
      ...ocp,
    }))
    setDatabaseData(prev => ({
      ...prev,
      ...database,
    }))
    setRedisData(prev => ({
      ...prev,
      ...redis,
    }))

    const apps = [apm, brimo, ocp, database, redis]
    const totalAppsScore = apps.reduce((temp, app) => {
      return temp + (app?.score ?? 100)
    }, 0) / apps.length

    const warnedApps = apps.filter(app => app != null && app.severity !== 0)
    const totalAppsSeverity = warnedApps.length !== 0
      ? Math.min(...warnedApps.map(app => app?.severity ?? 3))
      : 0
    setTotalAppsData(prev => ({
      ...prev,
      score: totalAppsScore,
      severity: totalAppsSeverity
    }))
  }, [data])

  const getSecurityLinkWidth = () => {
    if (securityExpanded && computeExpanded) return 40
    if (securityExpanded) return 49
    if (computeExpanded) return 46
    return 55
  }
  const getVerticalLinkHeight = () => {
    if (computeExpanded) return 47
    if (securityExpanded || networkExpanded) return 126
    return 87
  }
  const getNetworkLinkWidth = () => {
    if (networkExpanded && computeExpanded) return 40
    if (networkExpanded) return 49
    if (computeExpanded) return 46
    return 57
  }

  return (
    <div
      className='w-full flex flex-col gap-[47px] justify-center items-center'
    >
      <GroupNode
        className='w-full'
        title={totalAppsData.title}
        iconName={totalAppsData.iconName}
        score={totalAppsData.score}
        severity={totalAppsData.severity}
        expanded={appsExpanded}
        handleOnClick={() => setAppsExpanded(prev => !prev)}
      >
        <div className='p-14 pt-0'>
          <div
            ref={containerRef}
            className='w-full grid justify-between items-center'
            style={{
              gridTemplateColumns: "repeat(5, 1fr)",
            }}
          >
            <div className='col-span-5 flex justify-center' >
              <div className='relative' >
                <svg
                  className='absolute top-0 right-14'
                  width={dimensions.width / 2.5 - 30}
                  height={dimensions.height / 2}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d={`M ${dimensions.width / 2.5} 26 C 0 26 0 26 0 84`} stroke="white" strokeWidth={2} opacity={0.3} fill="transparent" />
                  <path d={`M ${dimensions.width / 2.5 - 30} 26 C ${dimensions.width / 5} 26 ${dimensions.width / 5} 26 ${dimensions.width / 5} 84`} stroke="white" strokeWidth={2} opacity={0.3} fill="transparent" />
                </svg>
                <Node
                  title={ocpData.title}
                  dataSource={ocpData.dataSource}
                  iconName={ocpData.iconName}
                  score={ocpData.score}
                  severity={ocpData.severity}
                />
                <svg
                  className='absolute top-0 left-14'
                  width={dimensions.width / 2.5}
                  height={dimensions.height / 2}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d={`M 0 26 C ${dimensions.width / 5 - 30} 26 ${dimensions.width / 5 - 30} 26 ${dimensions.width / 5 - 30} 84`} stroke="white" strokeWidth={2} opacity={0.3} fill="transparent" />
                  <path d={`M 0 26 C ${dimensions.width / 2.5 - 30} 26 ${dimensions.width / 2.5 - 30} 26 ${dimensions.width / 2.5 - 30} 84`} stroke="white" strokeWidth={2} opacity={0.3} fill="transparent" />
                </svg>
              </div>
            </div>
            <Node
              title={apmData.title}
              dataSource={apmData.dataSource}
              iconName={apmData.iconName}
              score={apmData.score}
              severity={apmData.severity}
            />
            <Node
              title={brimoData.title}
              dataSource={brimoData.dataSource}
              iconName={brimoData.iconName}
              score={brimoData.score}
              severity={brimoData.severity}
            />
            <div />
            <Node
              title={databaseData.title}
              dataSource={databaseData.dataSource}
              iconName={databaseData.iconName}
              score={databaseData.score}
              severity={databaseData.severity}
            />
            <Node
              title={redisData.title}
              dataSource={redisData.dataSource}
              iconName={redisData.iconName}
              score={redisData.score}
              severity={redisData.severity}
            />
          </div>
        </div>
      </GroupNode>
      <div
        className='relative flex justify-center items-center gap-10'
      >
        <GroupNode
          className='w-auto'
          title={securityData.title}
          iconName={securityData.iconName}
          score={securityData.score}
          severity={securityData.severity}
          expanded={securityExpanded}
          handleOnClick={() => setSecurityExpanded(prev => !prev)}
        >
          <div className='pb-4 px-8 grid grid-cols-3 gap-4 justify-center'>
            <Node
              className='h-28'
              title={firewallData.title}
              dataSource={firewallData.dataSource}
              iconName={firewallData.iconName}
              score={firewallData.score}
              severity={firewallData.severity}
            />
            <Node
              className='h-28'
              title={ssloData.title}
              dataSource={ssloData.dataSource}
              iconName={ssloData.iconName}
              score={ssloData.score}
              severity={ssloData.severity}
            />
            <Node
              className='h-28'
              title={wafData.title}
              dataSource={wafData.dataSource}
              iconName={wafData.iconName}
              score={wafData.score}
              severity={wafData.severity}
            />
          </div>
        </GroupNode>
        <div className='relative'>
          <GroupNode
            className='w-auto'
            title={computeData.title}
            iconName={computeData.iconName}
            score={computeData.score}
            severity={computeData.severity}
            expanded={computeExpanded}
            handleOnClick={() => setComputeExpanded(prev => !prev)}
          >
            <div className='pb-4 px-8 grid grid-cols-3 gap-4 justify-center'>
              <Node
                className='h-28'
                title={storageData.title}
                dataSource={storageData.dataSource}
                iconName={storageData.iconName}
                score={storageData.score}
                severity={storageData.severity}
              />
              <Node
                className='h-28'
                title={hostData.title}
                dataSource={hostData.dataSource}
                iconName={hostData.iconName}
                score={hostData.score}
                severity={hostData.severity}
              />
              <Node
                className='h-28'
                title={vmData.title}
                dataSource={vmData.dataSource}
                iconName={vmData.iconName}
                score={vmData.score}
                severity={vmData.severity}
              />
            </div>
          </GroupNode>
          {!appsExpanded && securityExpanded && !networkExpanded && 
            <svg
              className={`absolute transform scale-x-[-1]`}
              height={66}
              width={83}
              xmlns="http://www.w3.org/2000/svg"
              style={{
                top: computeExpanded ? '-110px' : '-149px',
                left: `calc(50% - 81px)`,
              }}
            >
              <path d={`M 81 1 C 1 1 1 1 1 63.1`} stroke="white" strokeWidth={2} opacity={0.3} fill="transparent" />
            </svg>
          }
          {!appsExpanded && networkExpanded &&
            <svg
              className={`absolute`}
              height={66}
              width={!securityExpanded ? 205 : 99}
              xmlns="http://www.w3.org/2000/svg"
              style={{
                top: computeExpanded ? '-112px' : '-151px',
                left: `50%`,
              }}
            >
              <path d={`M ${!securityExpanded ? 205 : 99} 1 C 1 1 1 1 1 65.1`} stroke="white" strokeWidth={2} opacity={0.3} fill="transparent" />
            </svg>
          }
          <svg
            className={`absolute`}
            height={getVerticalLinkHeight()}
            width={2}
            xmlns="http://www.w3.org/2000/svg"
            style={{
              top: !computeExpanded && (securityExpanded || networkExpanded) ? '-86px' : '-47px',
              left: `50%`,
            }}
          >
            <path d={`M 0 ${getVerticalLinkHeight()} L 0 0`} stroke="white" strokeWidth={4} opacity={0.3} fill="transparent" />
          </svg>
          <svg
            className={`absolute`}
            width={getSecurityLinkWidth()}
            height={4}
            xmlns="http://www.w3.org/2000/svg"
            style={{
              top: '50%',
              left: `${-46 + (securityExpanded ? 6 : 0)}px`,
            }}
          >
            <path d={`M 0 0 L ${getSecurityLinkWidth()} 0`} stroke="white" strokeWidth={4} opacity={0.3} fill="transparent" />
          </svg>
          <svg
            className={`absolute`}
            width={getNetworkLinkWidth()}
            height={4}
            xmlns="http://www.w3.org/2000/svg"
            style={{
              top: '50%',
              right: `${-47 + (networkExpanded ? 7 : 0)}px`,
            }}
          >
            <path d={`M 0 0 L ${getNetworkLinkWidth()} 0`} stroke="white" strokeWidth={4} opacity={0.3} fill="transparent" />
          </svg>
        </div>
        <GroupNode
          className='w-auto'
          title={totalNetworkData.title}
          iconName={totalNetworkData.iconName}
          score={totalNetworkData.score}
          severity={totalNetworkData.severity}
          expanded={networkExpanded}
          handleOnClick={() => setNetworkExpanded(prev => !prev)}
        >
          <div className='pb-4 px-8 grid grid-cols-5 gap-4 justify-center'>
            <Node
              className='h-28'
              title={f5Data.title}
              dataSource={f5Data.dataSource}
              iconName={f5Data.iconName}
              score={f5Data.score}
              severity={f5Data.severity}
            />
            <Node
              className='h-28'
              title={ivatData.title}
              dataSource={ivatData.dataSource}
              iconName={ivatData.iconName}
              score={ivatData.score}
              severity={ivatData.severity}
            />
            <Node
              className='h-28'
              title={dwdmData.title}
              dataSource={dwdmData.dataSource}
              iconName={dwdmData.iconName}
              score={dwdmData.score}
              severity={dwdmData.severity}
            />
            <Node
              className='h-28'
              title={dnsData.title}
              dataSource={dnsData.dataSource}
              iconName={dnsData.iconName}
              score={dnsData.score}
              severity={dnsData.severity}
            />
            <Node
              className='h-28'
              title={perangkatInternalData.title}
              dataSource={perangkatInternalData.dataSource}
              iconName={perangkatInternalData.iconName}
              score={perangkatInternalData.score}
              severity={perangkatInternalData.severity}
            />
          </div>
        </GroupNode>
      </div>
    </div>
  );
};

export default HealthinessTree;
