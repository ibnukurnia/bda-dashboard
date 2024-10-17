import './healthiness-tree.css'; // Import the custom CSS for styling paths
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { formatNumberWithCommas } from '@/helper';
import { Typography } from '@mui/material';
import CollapseIcon from '@/components/system/Icon/CollapseIcon';
import Link from 'next/link';
import { MappedHealthinessTree } from './brimo-end-to-end-panel';
import { SECTIONS_CONFIG } from './constants/brimo-end-to-end-contstans';

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
  data: MappedHealthinessTree;
}

const HealthinessTree: React.FC<HealthinessTreeProps> = ({
  data,
}) => {
  const containerRef = useRef<HTMLDivElement>(null); // Ref for the wrapper div

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

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
        title={'Apps'}
        iconName={'node-icon-apps.svg'}
        score={data.apps.score}
        severity={data.apps.severity}
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
                  title={'OCP'}
                  dataSource={SECTIONS_CONFIG.apps.ocp}
                  iconName={'node-icon-ocp.svg'}
                  score={data.apps.nodes.find(node => node.dataSource === SECTIONS_CONFIG.apps.ocp)?.score ?? 100}
                  severity={data.apps.nodes.find(node => node.dataSource === SECTIONS_CONFIG.apps.ocp)?.severity ?? 0}
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
              title={'APM'}
              dataSource={SECTIONS_CONFIG.apps.apm}
              iconName={'node-icon-apm.svg'}
              score={data.apps.nodes.find(node => node.dataSource === SECTIONS_CONFIG.apps.apm)?.score ?? 100}
              severity={data.apps.nodes.find(node => node.dataSource === SECTIONS_CONFIG.apps.apm)?.severity ?? 0}
            />
            <Node
              title={'BRImo'}
              dataSource={SECTIONS_CONFIG.apps.brimo}
              iconName={'node-icon-brimo.svg'}
              score={data.apps.nodes.find(node => node.dataSource === SECTIONS_CONFIG.apps.brimo)?.score ?? 100}
              severity={data.apps.nodes.find(node => node.dataSource === SECTIONS_CONFIG.apps.brimo)?.severity ?? 0}
            />
            <div />
            <Node
              title={'Database'}
              dataSource={SECTIONS_CONFIG.apps.database}
              iconName={'node-icon-database.svg'}
              score={data.apps.nodes.find(node => node.dataSource === SECTIONS_CONFIG.apps.database)?.score ?? 100}
              severity={data.apps.nodes.find(node => node.dataSource === SECTIONS_CONFIG.apps.database)?.severity ?? 0}
            />
            <Node
              title={'Redis'}
              dataSource={SECTIONS_CONFIG.apps.redis}
              iconName={'node-icon-redis.svg'}
              score={data.apps.nodes.find(node => node.dataSource === SECTIONS_CONFIG.apps.redis)?.score ?? 100}
              severity={data.apps.nodes.find(node => node.dataSource === SECTIONS_CONFIG.apps.redis)?.severity ?? 0}
            />
          </div>
        </div>
      </GroupNode>
      <div
        className='relative flex justify-center items-center gap-10'
      >
        <GroupNode
          className='w-auto'
          title={'Security'}
          iconName={'node-icon-security.svg'}
          score={data.security.score}
          severity={data.security.severity}
          expanded={securityExpanded}
          handleOnClick={() => setSecurityExpanded(prev => !prev)}
        >
          <div className='pb-4 px-8 grid grid-cols-3 gap-4 justify-center'>
            <Node
              className='h-28'
              title={'Firewall'}
              dataSource={SECTIONS_CONFIG.security.firewall}
              iconName={'node-icon-firewall.svg'}
              score={data.security.nodes.find(node => node.dataSource === SECTIONS_CONFIG.security.firewall)?.score ?? 100}
              severity={data.security.nodes.find(node => node.dataSource === SECTIONS_CONFIG.security.firewall)?.severity ?? 0}
            />
            <Node
              className='h-28'
              title={'SSLO'}
              dataSource={SECTIONS_CONFIG.security.sslo}
              iconName={'node-icon-sslo.svg'}
              score={data.security.nodes.find(node => node.dataSource === SECTIONS_CONFIG.security.sslo)?.score ?? 100}
              severity={data.security.nodes.find(node => node.dataSource === SECTIONS_CONFIG.security.sslo)?.severity ?? 0}
            />
            <Node
              className='h-28'
              title={'WAF'}
              dataSource={SECTIONS_CONFIG.security.waf}
              iconName={'node-icon-waf.svg'}
              score={data.security.nodes.find(node => node.dataSource === SECTIONS_CONFIG.security.waf)?.score ?? 100}
              severity={data.security.nodes.find(node => node.dataSource === SECTIONS_CONFIG.security.waf)?.severity ?? 0}
            />
          </div>
        </GroupNode>
        <div className='relative'>
          <GroupNode
            className='w-auto'
            title={'Compute'}
            iconName={'node-icon-compute.svg'}
            score={data.compute.score}
            severity={data.compute.severity}
            expanded={computeExpanded}
            handleOnClick={() => setComputeExpanded(prev => !prev)}
          >
            <div className='pb-4 px-8 grid grid-cols-3 gap-4 justify-center'>
              <Node
                className='h-28'
                title={'Storage'}
                dataSource={SECTIONS_CONFIG.compute.storage}
                iconName={'node-icon-storage.svg'}
                score={data.compute.nodes.find(node => node.dataSource === SECTIONS_CONFIG.compute.storage)?.score ?? 100}
                severity={data.compute.nodes.find(node => node.dataSource === SECTIONS_CONFIG.compute.storage)?.severity ?? 0}
              />
              <Node
                className='h-28'
                title={'Host'}
                dataSource={SECTIONS_CONFIG.compute.host}
                iconName={'node-icon-host.svg'}
                score={data.compute.nodes.find(node => node.dataSource === SECTIONS_CONFIG.compute.host)?.score ?? 100}
                severity={data.compute.nodes.find(node => node.dataSource === SECTIONS_CONFIG.compute.host)?.severity ?? 0}
              />
              <Node
                className='h-28'
                title={'VM'}
                dataSource={SECTIONS_CONFIG.compute.vm}
                iconName={'node-icon-vm.svg'}
                score={data.compute.nodes.find(node => node.dataSource === SECTIONS_CONFIG.compute.vm)?.score ?? 100}
                severity={data.compute.nodes.find(node => node.dataSource === SECTIONS_CONFIG.compute.vm)?.severity ?? 0}
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
          title={'Network'}
          iconName={'node-icon-network.svg'}
          score={data.network.score}
          severity={data.network.severity}
          expanded={networkExpanded}
          handleOnClick={() => setNetworkExpanded(prev => !prev)}
        >
          <div className='pb-4 px-8 grid grid-cols-5 gap-4 justify-center'>
            <Node
              className='h-28'
              title={'F5'}
              dataSource={SECTIONS_CONFIG.network.f5}
              iconName={'node-icon-f5.svg'}
              score={data.network.nodes.find(node => node.dataSource === SECTIONS_CONFIG.network.f5)?.score ?? 100}
              severity={data.network.nodes.find(node => node.dataSource === SECTIONS_CONFIG.network.f5)?.severity ?? 0}
            />
            <Node
              className='h-28'
              title={'IVAT'}
              dataSource={SECTIONS_CONFIG.network.ivat}
              iconName={'node-icon-ivat.svg'}
              score={data.network.nodes.find(node => node.dataSource === SECTIONS_CONFIG.network.ivat)?.score ?? 100}
              severity={data.network.nodes.find(node => node.dataSource === SECTIONS_CONFIG.network.ivat)?.severity ?? 0}
            />
            <Node
              className='h-28'
              title={'DWDM'}
              dataSource={SECTIONS_CONFIG.network.dwdm}
              iconName={'node-icon-dwdm.svg'}
              score={data.network.nodes.find(node => node.dataSource === SECTIONS_CONFIG.network.dwdm)?.score ?? 100}
              severity={data.network.nodes.find(node => node.dataSource === SECTIONS_CONFIG.network.dwdm)?.severity ?? 0}
            />
            <Node
              className='h-28'
              title={'DNS'}
              dataSource={SECTIONS_CONFIG.network.dns}
              iconName={'node-icon-host.svg'}
              score={data.network.nodes.find(node => node.dataSource === SECTIONS_CONFIG.network.dns)?.score ?? 100}
              severity={data.network.nodes.find(node => node.dataSource === SECTIONS_CONFIG.network.dns)?.severity ?? 0}
            />
            <Node
              className='h-28'
              title={'Perangkat\nInternal'}
              dataSource={SECTIONS_CONFIG.network.internal}
              iconName={'node-icon-host.svg'}
              score={data.network.nodes.find(node => node.dataSource === SECTIONS_CONFIG.network.internal)?.score ?? 100}
              severity={data.network.nodes.find(node => node.dataSource === SECTIONS_CONFIG.network.internal)?.severity ?? 0}
            />
          </div>
        </GroupNode>
      </div>
    </div>
  );
};

export default HealthinessTree;
