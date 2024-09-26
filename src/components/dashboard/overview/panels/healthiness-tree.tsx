import './healthiness-tree.css'; // Import the custom CSS for styling paths
import React, { useEffect, useRef, useState } from 'react';
import Tree from 'react-d3-tree';
import { HealthScoreResponse } from '@/modules/models/overviews';
import { toFixed } from '@/helper';

const treeData = [
  {
    name: 'Virtual Root',
    attributes: { },
    nodeSvgShape: { shape: 'circle', shapeProps: { r: 20 } },
    children: [
      {
        name: 'Security',
        attributes: {
          score: 0,
          iconSrc: 'node-icon-security.svg',
        },
        nodeSvgShape: { shape: 'circle', shapeProps: { r: 20 } },
      },
      {
        name: 'DB',
        attributes: {
          score: 0,
          iconSrc: 'node-icon-database.svg',
        },
        nodeSvgShape: { shape: 'circle', shapeProps: { r: 20 } },
        children: [
          {
            name: 'OCP',
            attributes: {
              score: 0,
              iconSrc: 'node-icon-ocp.svg',
            },
            nodeSvgShape: { shape: 'circle', shapeProps: { r: 20 } },
            children: [
              {
                name: 'APM',
                attributes: {
                  score: 0,
                  iconSrc: 'node-icon-apm.svg',
                },
                nodeSvgShape: { shape: 'circle', shapeProps: { r: 20 } },
              },
              {
                name: 'BRIMO',
                attributes: {
                  score: 0,
                  iconSrc: 'node-icon-brimo.svg',
                },
                nodeSvgShape: { shape: 'circle', shapeProps: { r: 20 } },
              },
            ],
          },
        ],
      },
      {
        name: 'Network',
        attributes: {
          score: 0,
          iconSrc: 'node-icon-network.svg',
        },
        nodeSvgShape: { shape: 'circle', shapeProps: { r: 20 } },
      },
    ]
  }
];

const getColor = (score: number) => {
  if (score <= 99) {
    return '#dc2626'
  }
  if (score > 99 && score < 99.5) {
    return '#facc15'
  }
  if (score >= 99.5) {
    return '#16a34a'
  }
  return 'grey'
}

const renderCustomNode = ({ nodeDatum }: any) => {
  if (nodeDatum.name === 'Virtual Root') {
    return <></>;
  }
  
  if (['Security', 'Network'].includes(nodeDatum.name)) {
    return (
      <g
        transform={`translate(-200, ${nodeDatum.name === 'Network' ? '-125' : '50'})`}
      >
        <rect
          className={nodeDatum.attributes.score <= 99 ? "blinking-node" : ""}
          width={80}
          height={80}
          rx={20}
          ry={20}
          fill={getColor(nodeDatum.attributes.score)}
          stroke='transparent'
        />
        <foreignObject x="15" y="15" width="160" height="160">
          <img
            src={`/assets/dashboard/overview/${nodeDatum.attributes.iconSrc}`}
            width={'50px'}
            height={'50px'}
            alt='logo'
          />
        </foreignObject>
        <text fill='white' stroke='white' x={0} y={95}>
          {nodeDatum.name}
        </text>
        <text fill='white' stroke='white' x={0} y={120}>
          {nodeDatum.attributes.score ? toFixed(nodeDatum.attributes.score, 2) : nodeDatum.attributes.score}
        </text>
      </g>
    )
  }
  
  return (
    <g
      transform="translate(-40, -40)"
    >
      <rect
        className={nodeDatum.attributes.score <= 99 ? "blinking-node" : ""}
        width={80}
        height={80}
        rx={20}
        ry={20}
        fill={getColor(nodeDatum.attributes.score)}
        stroke='transparent'
      />
      <foreignObject x="15" y="15" width="160" height="160">
          <img
            src={`/assets/dashboard/overview/${nodeDatum.attributes.iconSrc}`}
            width={'50px'}
            height={'50px'}
            alt='logo'
          />
        </foreignObject>
      <text fill='white' stroke='white' x={0} y={95}>
        {nodeDatum.name}
      </text>
      <text fill='white' stroke='white' x={0} y={120}>
        {nodeDatum.attributes.score ? toFixed(nodeDatum.attributes.score, 2) : nodeDatum.attributes.score}
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

  const [translate, setTranslate] = useState({ x: -200, y: 175})
  const [nodeSize, setNodeSize] = useState({x: 200, y: 180})
  const [mappedData, setMappedData] = useState(treeData)

  useEffect(() => {
    window.addEventListener('resize', handleResizeNode);
    return () => {
      window.removeEventListener('resize', handleResizeNode);
    };
  }, [])

  useEffect(() => {
    handleResizeNode()
  }, [containerRef])
  
  useEffect(() => {
    if (!treeRef.current) return
    
    for (let i = 0; i < 3; i++) {
      // hides first i links
      const elements = document.getElementsByClassName('rd3t-link custom-link-path');
       
      if (i >= 0 && i < elements.length) {
        const element = elements[i] as HTMLElement;  // Type assertion to HTMLElement
      
        // Now, you can safely access the style property
        element.style.opacity = '0';
      } else {
        console.error('Index out of bounds');
      }
    }
  }, [treeRef])

  useEffect(() => {
    setMappedData([
      {
        name: 'Virtual Root',
        attributes: { },
        nodeSvgShape: { shape: 'circle', shapeProps: { r: 20 } },
        children: [
          {
            name: 'Security',
            attributes: {
              score: data.find(d => d.data_source === "security")?.score ?? 0,
              iconSrc: 'node-icon-security.svg',
            },
            nodeSvgShape: { shape: 'circle', shapeProps: { r: 20 } },
          },
          {
            name: 'DB',
            attributes: {
              score: data.find(d => d.data_source === "k8s_db")?.score ?? 0,
              iconSrc: 'node-icon-database.svg',
            },
            nodeSvgShape: { shape: 'circle', shapeProps: { r: 20 } },
            children: [
              {
                name: 'OCP',
                attributes: {
                  score: data.find(d => d.data_source === "k8s_prometheus")?.score ?? 0,
                  iconSrc: 'node-icon-ocp.svg',
                },
                nodeSvgShape: { shape: 'circle', shapeProps: { r: 20 } },
                children: [
                  {
                    name: 'APM',
                    attributes: {
                      score: data.find(d => d.data_source === "apm")?.score ?? 0,
                      iconSrc: 'node-icon-apm.svg',
                    },
                    nodeSvgShape: { shape: 'circle', shapeProps: { r: 20 } },
                  },
                  {
                    name: 'BRIMO',
                    attributes: {
                      score: data.find(d => d.data_source === "brimo")?.score ?? 0,
                      iconSrc: 'node-icon-brimo.svg',
                    },
                    nodeSvgShape: { shape: 'circle', shapeProps: { r: 20 } },
                  },
                ],
              },
            ],
          },
          {
            name: 'Network',
            attributes: {
              score: data.find(d => d.data_source === "network")?.score ?? 0,
              iconSrc: 'node-icon-network.svg',
            },
            nodeSvgShape: { shape: 'circle', shapeProps: { r: 20 } },
          },
        ]
      }
    ])
  }, [data])
  
  const handleResizeNode = () => {
    if (!containerRef.current?.clientWidth) return

    let newX = containerRef.current?.clientWidth*0.325
    
    setNodeSize(prev => ({ ...prev, x: newX }))
    setTranslate(prev => ({ ...prev, x: -newX*0.275 }))
  }

  return (
    <div
      ref={containerRef}
      className='w-full h-[400px] flex justify-center items-center'
    >
      <Tree
        svgClassName='!cursor-default'
        leafNodeClassName='!cursor-default'
        rootNodeClassName='!cursor-default'
        branchNodeClassName='!cursor-default'
        ref={treeRef}
        data={mappedData}
        renderCustomNodeElement={renderCustomNode}
        translate={translate}
        nodeSize={nodeSize}
        pathFunc={'elbow'}
        zoomable={false}
        draggable={false}
        collapsible={false}
        pathClassFunc={() => 'custom-link-path'}
      />
    </div>
  );
};

export default HealthinessTree;
