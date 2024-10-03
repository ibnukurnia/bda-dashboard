import './healthiness-tree.css'; // Import the custom CSS for styling paths
import React, { useEffect, useRef, useState } from 'react';
import Tree from 'react-d3-tree';
import { HealthScoreResponse } from '@/modules/models/overviews';
import { toFixed } from '@/helper';
import Image from 'next/image';

const treeData = [
  {
    name: 'DB',
    attributes: {
      // score: 100,
      // severity: 0,
      iconSrc: 'node-icon-database.svg',
    },
    nodeSvgShape: { shape: 'circle', shapeProps: { r: 20 } },
    children: [
      {
        name: 'OCP',
        attributes: {
          // score: 100,
          // severity: 0,
          iconSrc: 'node-icon-ocp.svg',
        },
        nodeSvgShape: { shape: 'circle', shapeProps: { r: 20 } },
        children: [
          {
            name: 'APM',
            attributes: {
              // score: 100,
              // severity: 0,
              iconSrc: 'node-icon-apm.svg',
            },
            nodeSvgShape: { shape: 'circle', shapeProps: { r: 20 } },
          },
          {
            name: 'BRIMO',
            attributes: {
              // score: 100,
              // severity: 0,
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
    return '220,38,38'
  }
  if (severity === 2) {
    return '234,88,12'
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
          <Image
            className='scale-x-[-1]'
            src={`/assets/dashboard/overview/${nodeDatum.attributes.iconSrc}`}
            width={50}
            height={50}
            unoptimized
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

interface HealthinessTreeProps {
  data: HealthScoreResponse[];
}

const HealthinessTree: React.FC<HealthinessTreeProps> = ({
  data,
}) => {
  const containerRef = useRef<HTMLDivElement>(null); // Ref for the wrapper div
  const treeRef = useRef(null); // Ref for the wrapper div

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
      className='w-full flex justify-center items-center'
    >
      <div
        className='w-full border-[3px] border-blue-400 rounded-2xl overflow-hidden'
      >
        <div className='flex flex-col'>
          <div
              className={`w-20 h-20 flex justify-center items-center rounded-xl ${securityData.severity === 1 ? "blinking-bg" : ""} bg-[rgb(${getColor(securityData.severity)})]`}
              style={{
                '--dynamic-color': getColor(securityData.severity),
                backgroundColor: 'rgb(var(--dynamic-color))'
              } as React.CSSProperties}
          >
            <Image
              src={`/assets/dashboard/overview/node-icon-security.svg`}
              width={50}
              height={50}
              unoptimized
              alt='logo'
            />
          </div>
          <span className='ml-1 text-white'>
            Security
          </span>
          <span className='ml-1 text-white'>
            {securityData.score ? toFixed(securityData.score, 2) : securityData.score}%
          </span>
          <div className='px-20 -mt-12 mb-20'>
            <div
              className='w-full border-[3px] border-blue-400 rounded-2xl overflow-hidden'
            >
              <div className='flex flex-col'>
                <div
                    className={`w-20 h-20 flex justify-center items-center rounded-xl ${networkData.severity === 1 ? "blinking-bg" : ""} bg-[rgb(${getColor(networkData.severity)})]`}
                    style={{
                      '--dynamic-color': getColor(networkData.severity),
                      backgroundColor: 'rgb(var(--dynamic-color))'
                    } as React.CSSProperties}
                >
                  <Image
                    src={`/assets/dashboard/overview/node-icon-network.svg`}
                    width={50}
                    height={50}
                    unoptimized
                    alt='logo'
                  />
                </div>
                <span className='ml-1 text-white'>
                  Network
                </span>
                <span className='ml-1 text-white'>
                  {networkData.score ? toFixed(networkData.score, 2) : networkData.score}%
                </span>
              </div>
              <div
                ref={containerRef}
                className='w-full h-[400px] scale-x-[-1]'
              >
                <Tree
                  svgClassName='!cursor-default'
                  leafNodeClassName='!cursor-default'
                  rootNodeClassName='!cursor-default'
                  branchNodeClassName='!cursor-default'
                  ref={treeRef}
                  data={mappedData}
                  renderCustomNodeElement={renderCustomNode}
                  translate={{
                    x: dimensions.width / 6,
                    y: dimensions.height / 2 - 30,
                  }}
                  nodeSize={nodeSize}
                  pathFunc={'elbow'}
                  zoomable={false}
                  draggable={false}
                  collapsible={false}
                  pathClassFunc={() => 'custom-link-path'}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthinessTree;
