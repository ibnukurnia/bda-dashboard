import { useEffect, useState } from 'react'
import ScrollableNodeList from '../node/scrollable-node-list';
import { TreeNodeType } from './types';
import TopBar from '../bar/top-bar';
import { RootCauseAnalysisTreeResponse } from '@/modules/models/root-cause-analysis';
import { Typography } from '@mui/material';

const nodeHeight = 80

type ExpandedNodesType = {
  node: TreeNodeType;
  nodeIndex: number;
}

interface RCATreeProps {
  data: RootCauseAnalysisTreeResponse[] | null;
  handleDetail: () => void;
}
const RCATree: React.FC<RCATreeProps> = ({
  data,
  handleDetail,
}) => {
  // State to manage expanded nodes
  const [expandedNodes, setExpandedNodes] = useState<ExpandedNodesType[]>([]);
  const [scrollTopPositions, setScrollTopPositions] = useState<number[]>([])
  const [mappedData, setMappedData] = useState<TreeNodeType[]>([])

  useEffect(() => {
    if (!data) return
    setMappedData(data.map(s => ({
      name: s.source,
      anomalyCount: s.routes.reduce((count, r) => count + r.total, 0),
      children: s.routes.map(r => ({
        name: r.anomaly,
        anomalyCount: r.total,
        children: r.impacted_services.map(is => ({
          name: is.service,
          anomalyCount: is.total,
          children: is.impacted.map(i => ({
            name: i,
          }))
        })).sort((a, b) => b.anomalyCount - a.anomalyCount)
      })).sort((a, b) => b.anomalyCount - a.anomalyCount)
    })).sort((a, b) => b.anomalyCount - a.anomalyCount))
  }, [data])

  useEffect(() => {
    setExpandedNodes([])
  }, [mappedData])
  
  useEffect(() => {
    setScrollTopPositions(prev => {
      const newArray = [...prev]

      if (expandedNodes.length > prev.length - 1) {
        newArray.push(0)
      }
      if (expandedNodes.length < prev.length - 1) {
        newArray.splice(expandedNodes.length, prev.length-expandedNodes.length, 0)
      }

      return newArray
    })
  }, [expandedNodes])
  
  const handleOnClickNode = (depth: number, index: number, node: TreeNodeType) => {
    const item = {
      node: node,
      nodeIndex: index
    }
    
    setExpandedNodes(prev => {
      const newArray = [...prev]

      if (depth === newArray.length) {
        newArray[depth] = item
      } else if (depth > newArray.length) {
        newArray.push(item)
      } else {
        newArray.splice(depth-prev.length, prev.length-depth, item)
      }
      return newArray
    })
    
    if (depth ===3) {
      handleDetail()
    }
  }

  const handleOnScroll = (depth: number, scrollTop: number) => {
    setScrollTopPositions(prev => {
      const newArray: number[] = [...prev]

      newArray[depth] = scrollTop

      return newArray
    })
  }

  return (
    <div className='w-full px-6 pb-8 flex flex-col gap-8'>
      <div
        className="w-full grid gap-16 justify-center"
          style={{
            gridTemplateColumns: "repeat(4, 1fr)"
          }}
      >
        {mappedData &&
          <TopBar
            title={"Data Source"}
            subtitle={expandedNodes[0]?.node?.name}
          />
        }
        {expandedNodes[0] &&
          <TopBar
            title={"Matric Anomaly"}
            subtitle={expandedNodes[1]?.node?.name}
          />
        }
        {expandedNodes[1] &&
          <TopBar
            title={"Service"}
            subtitle={expandedNodes[2]?.node?.name}
          />
        }
        {expandedNodes[2] &&
          <TopBar
            title={"Impacted Service"}
            subtitle={expandedNodes[3]?.node?.name}
          />
        }
      </div>
      <div
        className="grid gap-16 justify-center items-center"
          style={{
            gridTemplateColumns: "repeat(4, 1fr)"
          }}
      >
        <ScrollableNodeList
          nodes={mappedData}
          handleOnClickNode={(index) => handleOnClickNode(0, index, mappedData[index])}
          expandedIndex={expandedNodes[0]?.nodeIndex}
          expandedChildIndex={expandedNodes[1]?.nodeIndex - scrollTopPositions[1] / nodeHeight}
          handleOnScroll={(scrollTop) => handleOnScroll(0, scrollTop)}
        />
        {expandedNodes.map((expNode, i) => {
          if (expNode.node.children != null && Array.isArray(expNode.node.children) && expNode.node.children.length > 0) {
            return (
              <ScrollableNodeList
                key={expNode.node.name}
                nodes={expNode.node.children}
                handleOnClickNode={(index) => handleOnClickNode(i + 1, index, expNode.node.children![index])}
                expandedIndex={expandedNodes[i+1]?.nodeIndex}
                expandedChildIndex={expandedNodes[i+2]?.nodeIndex - scrollTopPositions[i+2] / nodeHeight}
                handleOnScroll={(scrollTop) => handleOnScroll(i + 1, scrollTop)}
              />
            );
          }
          
          return (
            <Typography
              variant="subtitle1"
              color={'white'}
              align='center'
            >
              No Impacted Service
            </Typography>
          )
        })}
      </div>
    </div>
  )
}

export default RCATree
