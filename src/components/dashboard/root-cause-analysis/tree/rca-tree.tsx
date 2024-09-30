import { useEffect, useState } from 'react'
import ScrollableNodeList from '../node/scrollable-node-list';
import { TreeNodeType } from './types';
import TopBar from '../bar/top-bar';
import { RootCauseAnalysisTreeResponse } from '@/modules/models/root-cause-analysis';
import { Typography } from '@mui/material';
import { FullScreenHandle } from 'react-full-screen';
import { replaceWordingDataSource } from '../helper';
import { useRouter, useSearchParams } from 'next/navigation';

const nodeHeight = 80

type ExpandedNodesType = {
  node: TreeNodeType;
  nodeIndex: number;
}

interface RCATreeProps {
  isLoading: boolean;
  data: RootCauseAnalysisTreeResponse[] | null;
  timeRange: string;
  fullScreenHandle: FullScreenHandle; // From react-full-screen
}
const RCATree: React.FC<RCATreeProps> = ({
  isLoading,
  data,
  timeRange,
  fullScreenHandle, // Use handle from react-full-screen
}) => {
  const router = useRouter();
  const searchParams = useSearchParams()
  
  const [expandedNodes, setExpandedNodes] = useState<ExpandedNodesType[]>([]);
  const [scrollTopPositions, setScrollTopPositions] = useState<number[]>([])
  const [mappedData, setMappedData] = useState<TreeNodeType[]>([])
  const [totalAnomaly, setTotalAnomaly] = useState<number>(0)

  useEffect(() => {
    if (!data) return
    setMappedData(data.map(s => ({
      name: s.source,
      namespace: s.type,
      anomalyCount: s.routes.reduce((count, r) => count + r.total, 0),
      children: s.routes.map(r => ({
        name: r.name,
        namespace: r.anomaly,
        anomalyCount: r.total,
        children: r.impacted_services.map(is => ({
          name: is.service_alias,
          namespace: is.service,
          anomalyCount: is.total,
          tooltips: is.tooltips,
          children: is.impacted.map(i => ({
            name: i,
          }))
        })).sort((a, b) => b.anomalyCount - a.anomalyCount)
      })).sort((a, b) => b.anomalyCount - a.anomalyCount)
    })).sort((a, b) => b.anomalyCount - a.anomalyCount))
  }, [data])

  useEffect(() => {
    const dataSource = searchParams.get('data_source');

    setTotalAnomaly(mappedData.reduce((total, data) => total + (data.anomalyCount ?? 0), 0))
    setExpandedNodes(prev => {
      const newArr: ExpandedNodesType[] = []
      let tempNode: TreeNodeType

      if (dataSource && prev.length === 0) {
        const newExpandedNodeIndex = mappedData.findIndex(node => node.namespace === dataSource)
        newArr.push({ node: mappedData[newExpandedNodeIndex], nodeIndex: newExpandedNodeIndex})
        return newArr
      }
      
      prev.forEach((expNode, prevIdx) => {
        const prevExpName = prevIdx === 0 && dataSource ? dataSource : expNode.node.namespace
        const list = tempNode?.children ?? mappedData
        if (list == null) return

        const newExpandedNodeIndex = list.findIndex(node => node.namespace === prevExpName)
        if (newExpandedNodeIndex === -1) return newArr

        newArr.push({ node: list[newExpandedNodeIndex], nodeIndex: newExpandedNodeIndex})
        tempNode = {...list[newExpandedNodeIndex]}
      })
      return newArr
    })
  }, [mappedData, searchParams])
  
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
        const params = new URLSearchParams(searchParams.toString());
        params.set("data_source", node.namespace ?? node.name)
        router.replace(`/dashboard/root-cause-analysis?${params.toString()}`);
      }
      return newArray
    })
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
            subtitle={replaceWordingDataSource(expandedNodes[0]?.node?.name)}
            isLoading={isLoading}
          />
        }
        {expandedNodes[0] &&
          <TopBar
            title={"Matric Anomaly"}
            subtitle={expandedNodes[1]?.node?.name}
            isLoading={isLoading}
          />
        }
        {expandedNodes[1] &&
          <TopBar
            title={"Service"}
            subtitle={expandedNodes[2]?.node?.name}
            isLoading={isLoading}
          />
        }
        {expandedNodes[2] &&
          <TopBar
            title={"Impacted Service"}
            subtitle={expandedNodes[3]?.node?.name}
            isLoading={isLoading}
          />
        }
      </div>
      <div
        className="grid gap-16 justify-center items-center"
          style={{
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))"
          }}
      >
        <ScrollableNodeList
          nodes={mappedData}
          handleOnClickNode={(index) => handleOnClickNode(0, index, mappedData[index])}
          expandedIndex={expandedNodes[0]?.nodeIndex}
          expandedChildIndex={expandedNodes[1]?.nodeIndex - scrollTopPositions[1] / nodeHeight}
          handleOnScroll={(scrollTop) => handleOnScroll(0, scrollTop)}
          fullScreenHandle={fullScreenHandle}
          maxCount={totalAnomaly}
          isLoading={isLoading}
        />
        {expandedNodes.map((expNode: ExpandedNodesType, i: number) => {
          if (i >= 3) return null
          if (expNode.node.children != null && Array.isArray(expNode.node.children) && expNode.node.children.length > 0) {
            return (
              <ScrollableNodeList
                key={expNode.node.name}
                nodes={expNode.node.children}
                handleOnClickNode={(index) => handleOnClickNode(i + 1, index, expNode.node.children![index])}
                expandedIndex={expandedNodes[i+1]?.nodeIndex}
                expandedChildIndex={expandedNodes[i+2]?.nodeIndex - scrollTopPositions[i+2] / nodeHeight}
                handleOnScroll={(scrollTop) => handleOnScroll(i + 1, scrollTop)}
                hasDetail={i === 1}
                queryParams={{
                  time_range: timeRange,
                  data_source: expandedNodes[0].node.namespace ?? expandedNodes[0].node.name,
                  metric_anomaly: expandedNodes[1]?.node.namespace ?? expandedNodes[1]?.node.name,
                }}
                fullScreenHandle={fullScreenHandle}
                maxCount={totalAnomaly}
                isLoading={isLoading}
              />
            );
          }
          
          return (
            <Typography
              key={"placeholder-no-impacted-service"}
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
