import './healthiness-tree.css'; // Import the custom CSS for styling paths
import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import Tree from 'react-d3-tree';
import { HealthScoreResponse } from '@/modules/models/overviews';
import { toFixed } from '@/helper';
import { Typography } from '@mui/material';

const treeData = [
  {
    name: 'DB',
    attributes: {
      iconSrc: 'node-icon-database.svg',
    },
    nodeSvgShape: { shape: 'circle', shapeProps: { r: 20 } },
    children: [
      {
        name: 'OCP',
        attributes: {
          iconSrc: 'node-icon-ocp.svg',
        },
        nodeSvgShape: { shape: 'circle', shapeProps: { r: 20 } },
        children: [
          {
            name: 'APM',
            attributes: {
              iconSrc: 'node-icon-apm.svg',
            },
            nodeSvgShape: { shape: 'circle', shapeProps: { r: 20 } },
          },
          {
            name: 'BRIMO',
            attributes: {
              iconSrc: 'node-icon-brimo.svg',
            },
            nodeSvgShape: { shape: 'circle', shapeProps: { r: 20 } },
          },
        ],
      },
    ],
  },
];

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

const renderCustomNode = ({ nodeDatum }: any) => {
  return (
    <g
      transform={`translate(${nodeDatum.name === 'OCP' ? '-40' : '-40'}, -40)`}
    >
      <rect
        className={`${nodeDatum.attributes.severity === 1 ? "blinking-node" : ""}`}
        width={80}
        height={80}
        rx={15}
        ry={15}
        fill={`rgb(${getColor(nodeDatum.attributes.severity)})`}
        stroke='transparent'
      />
      <foreignObject x="15" y="15" width="50" height="50">
          <img
            className='scale-x-[-1]'
            src={`/assets/dashboard/overview/${nodeDatum.attributes.iconSrc}`}
            width={50}
            height={50}
            alt='logo'
          />
        </foreignObject>
      <text
        className='scale-x-[-1]'
        fill='white'
        stroke='transparent'
        x={nodeDatum.name === 'OCP' ? -100 : -80}
        y={95}
      >
        {nodeDatum.name}
      </text>
      <text
        className='scale-x-[-1]'
        fill='white'
        stroke='transparent'
        x={nodeDatum.name === 'OCP' ? -100 : -80}
        y={120}
      >
        {nodeDatum.attributes.score ? toFixed(nodeDatum.attributes.score, 2) : nodeDatum.attributes.score}%
      </text>
    </g>
  )
}

const initialNodes = [
  { id: '1', data: { label: 'APM' }, position: { x: 0, y: 0 }, style: { background: '#FFC107', color: '#000' } },
  { id: '2', data: { label: 'BRIMO' }, position: { x: 0, y: 100 }, style: { background: '#00C853', color: '#000' } },
  { id: '3', data: { label: 'OCP' }, position: { x: 200, y: 50 }, style: { background: '#FFEB3B', color: '#000' } },
  { id: '4', data: { label: 'Database' }, position: { x: 400, y: 0 }, style: { background: '#D32F2F', color: '#FFF' } },
  { id: '5', data: { label: 'Redis' }, position: { x: 400, y: 100 }, style: { background: '#D32F2F', color: '#FFF' } },
];

const initialEdges = [
  {
    id: 'e1-3',
    source: '1',
    target: '3',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#fff', strokeWidth: 2 },
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#fff', strokeWidth: 2 },
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#fff', strokeWidth: 2 },
  },
  {
    id: 'e3-5',
    source: '3',
    target: '5',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#fff', strokeWidth: 2 },
  },
];

interface NodeProps {
  title: string;
  iconName: string;
  score: number;
  severity: number;
}
const Node = forwardRef<HTMLDivElement, NodeProps>(({
  title,
  iconName,
  score,
  severity,
}, ref) => (
  <div className='flex flex-col items-center'>
    <div
      ref={ref}
      className
      ={`w-[52px] h-[52px] flex justify-center items-center rounded-2xl ${severity === 1 ? "blinking-bg" : ""} bg-[rgb(${getColor(severity)})]`}
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
      fontWeight={700}
      fontSize={14}
      color={'white'}
      lineHeight={'17.07px'}
    >
      {title}
    </Typography>
    <Typography 
      fontWeight={700}
      fontSize={14}
      color={'white'}
      lineHeight={'17.07px'}
    >
      {score ? toFixed(score, 2) : score}%
    </Typography>
  </div>
))

interface HealthinessTreeProps {
  data: HealthScoreResponse[];
}

const HealthinessTree: React.FC<HealthinessTreeProps> = ({
  data,
}) => {
  const containerRef = useRef<HTMLDivElement>(null); // Ref for the wrapper div
  const treeRef = useRef(null); // Ref for the wrapper div
  const nodeApmRef = useRef<HTMLDivElement>(null);
  const nodeBrimoRef = useRef<HTMLDivElement>(null);
  const nodeOcpRef = useRef<HTMLDivElement>(null);
  const nodeDatabaseRef = useRef<HTMLDivElement>(null);
  const nodeRedisRef = useRef<HTMLDivElement>(null);
  const nodeNetworkRef = useRef<HTMLDivElement>(null);
  const nodeSecurityRef = useRef<HTMLDivElement>(null);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [nodeSize, setNodeSize] = useState({x: 200, y: 180})
  const [mappedData, setMappedData] = useState(treeData)
  const [securityData, setSecurityData] = useState({
    score: 100,
    severity: 0,
  })
  const [networkData, setNetworkData] = useState({
    score: 100,
    severity: 0,
  })
  const [apmData, setApmData] = useState({
    score: 100,
    severity: 0,
  })
  const [brimoData, setBrimoData] = useState({
    score: 100,
    severity: 0,
  })
  const [ocpData, setOcpData] = useState({
    score: 100,
    severity: 0,
  })
  const [databaseData, setDatabaseData] = useState({
    score: 100,
    severity: 0,
  })
  const [redisData, setRedisData] = useState({
    score: 100,
    severity: 0,
  })

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        setDimensions({ width: offsetWidth, height: offsetHeight });

      }
    };

    updateDimensions(); // Set initial dimensions
    window.addEventListener('resize', updateDimensions); // Update on resize
    window.addEventListener('resize', handleResizeNode);
    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('resize', handleResizeNode);
    };
  }, [])

  useEffect(() => {
    handleResizeNode()
  }, [containerRef])
  
  useEffect(() => {
    const security = data.find(d => d.data_source === "security")
    const network = data.find(d => d.data_source === "network")
    const database = data.find(d => d.data_source === "k8s_db")
    const redis = data.find(d => d.data_source === "k8s_redis")
    const ocp = data.find(d => d.data_source === "k8s_prometheus")
    const apm = data.find(d => d.data_source === "apm")
    const brimo = data.find(d => d.data_source === "brimo")

    setSecurityData(prev => ({
      ...prev,
      ...security,
    }))
    setNetworkData(prev => ({
      ...prev,
      ...network,
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
    setMappedData([
      {
        name: 'Database',
        attributes: {
          ...database,
          iconSrc: 'node-icon-database.svg',
        },
        nodeSvgShape: { shape: 'circle', shapeProps: { r: 20 } },
        children: [
          {
            name: 'OCP',
            attributes: {
              ...ocp,
              iconSrc: 'node-icon-ocp.svg',
            },
            nodeSvgShape: { shape: 'circle', shapeProps: { r: 20 } },
            children: [
              {
                name: 'APM',
                attributes: {
                  ...apm,
                  iconSrc: 'node-icon-apm.svg',
                },
                nodeSvgShape: { shape: 'circle', shapeProps: { r: 20 } },
              },
              {
                name: 'BRImo',
                attributes: {
                  ...brimo,
                  iconSrc: 'node-icon-brimo.svg',
                },
                nodeSvgShape: { shape: 'circle', shapeProps: { r: 20 } },
              },
            ],
          },
        ],
      },
    ])
  }, [data])
  
  const handleResizeNode = () => {
    if (!containerRef.current?.clientWidth) return

    let newX = containerRef.current?.clientWidth/3
    
    setNodeSize(prev => ({ ...prev, x: newX }))
  }

  return (
    <div
      className='w-full flex flex-col gap-[47px] justify-center items-center'
    >
      <div
        className='w-full border-[1px] border-white border-opacity-30 bg-white bg-opacity-5 rounded-2xl'
      >
        <div className='p-14'>
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
                  width={dimensions.width/2.5 - 30}
                  height={dimensions.height}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d={`M ${dimensions.width / 2.5} 26 C 0 26 0 26 0 84`} stroke="white" strokeWidth={2} opacity={0.3} fill="transparent" />
                  <path d={`M ${dimensions.width/ 2.5 - 30} 26 C ${dimensions.width / 5} 26 ${dimensions.width / 5} 26 ${dimensions.width / 5} 84`} stroke="white" strokeWidth={2} opacity={0.3} fill="transparent" />
                </svg>
                <Node
                  ref={nodeOcpRef}
                  title='OCP'
                  iconName='node-icon-ocp.svg'
                  score={ocpData.score}
                  severity={ocpData.severity}
                />
                <svg
                  className='absolute top-0 left-14'
                  width={dimensions.width/2.5}
                  height={dimensions.height}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d={`M 0 26 C ${dimensions.width / 5 - 30} 26 ${dimensions.width / 5 - 30} 26 ${dimensions.width / 5 - 30} 84`} stroke="white" strokeWidth={2} opacity={0.3} fill="transparent" />
                  <path d={`M 0 26 C ${dimensions.width / 2.5 - 30} 26 ${dimensions.width / 2.5 - 30} 26 ${dimensions.width / 2.5 - 30} 84`} stroke="white" strokeWidth={2} opacity={0.3} fill="transparent" />
                </svg>
              </div>
            </div>
            <Node
              ref={nodeApmRef}
              title='APM'
              iconName='node-icon-apm.svg'
              score={apmData.score}
              severity={apmData.severity}
            />
            <Node
              ref={nodeBrimoRef}
              title='BRImo'
              iconName='node-icon-brimo.svg'
              score={brimoData.score}
              severity={brimoData.severity}
            />
            <div />
            <Node
              ref={nodeDatabaseRef}
              title='Database'
              iconName='node-icon-database.svg'
              score={databaseData.score}
              severity={databaseData.severity}
            />
            <Node
              ref={nodeRedisRef}
              title='Redis'
              iconName='node-icon-redis.svg'
              score={redisData.score}
              severity={redisData.severity}
            />
          </div>
        </div>
      </div>
      <div
        className='px-14 relative w-full grid justify-between items-center'
        style={{
          gridTemplateColumns: "repeat(5, 1fr)",
        }}
      >
        <div />
        <Node
          ref={nodeNetworkRef}
          title='Network'
          iconName='node-icon-network.svg'
          score={networkData.score}
          severity={networkData.severity}
        />
        <div
          className={'relative h-full'}
          style={{
            width: `calc(100% + ${dimensions.width/10 - 30}px`,
          }}
        >
          <svg
            className={`absolute`}
            xmlns="http://www.w3.org/2000/svg"
            style={{
              top: '-44px',
              left: `-${dimensions.width/10 - 30}px`,
              width: `calc(100% + ${dimensions.width/10 - 30}px`,
            }}
          >
            <path d={`M ${dimensions.width/5-30} 0 L ${dimensions.width/5-30} 64`} stroke="white" strokeWidth={2} opacity={0.3} fill="transparent" />
            <path d={`M 0 70 L ${dimensions.width/2.5} 70`} stroke="white" strokeWidth={2} opacity={0.3} fill="transparent" />
          </svg>
        </div>
        <Node
          ref={nodeSecurityRef}
          title='Security'
          iconName='node-icon-security.svg'
          score={securityData.score}
          severity={securityData.severity}
        />
        <div />
      </div>
    </div>
  );
};

export default HealthinessTree;
