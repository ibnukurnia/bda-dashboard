import { useEffect, useState } from 'react';
import ScrollableNodeList from '../node/scrollable-node-list';
import { TreeNodeType } from './types';
import TopBar from '../bar/top-bar';
import { NLP } from '@/modules/models/root-cause-analysis';
import { Typography } from '@mui/material';
import { FullScreenHandle } from 'react-full-screen';
import { useRouter, useSearchParams } from 'next/navigation';

// Height of each node in the tree for scroll calculations
const nodeHeight = 80;

type ExpandedNodesType = {
  node: TreeNodeType; // Represents a specific node in the tree
  nodeIndex: number;  // Index of the node in its current level
};

interface RCATreeProps {
  isLoading: boolean; // Indicates if data is loading
  data?: TreeNodeType[]; // The tree data
  timeRange: string; // Selected time range
  fullScreenHandle: FullScreenHandle; // Fullscreen handle from react-full-screen
  handleSelectNLP: (value: {
    data_source: string;
    service: string;
    nlps: NLP[];
  } | null) => void; // Callback to handle NLP selection
}

const RCATree: React.FC<RCATreeProps> = ({
  isLoading,
  data = [],
  timeRange,
  fullScreenHandle,
  handleSelectNLP,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Stores currently expanded nodes and their indices
  const [expandedNodes, setExpandedNodes] = useState<ExpandedNodesType[]>([]);
  // Keeps track of scroll positions for each tree level
  const [scrollTopPositions, setScrollTopPositions] = useState<number[]>([]);
  // Total count of anomalies across nodes
  const [totalAnomaly, setTotalAnomaly] = useState<number>(0);

  // Effect to initialize or update expanded nodes based on data and query parameters
  useEffect(() => {
    const dataSource = searchParams.get('data_source');

    // Calculate the total anomaly count
    setTotalAnomaly(data.reduce((total, node) => total + (node.anomalyCount ?? 0), 0));

    // Update expanded nodes based on query parameters or current state
    setExpandedNodes((prev) => {
      const newArr: ExpandedNodesType[] = [];
      let tempNode: TreeNodeType;

      if (dataSource && prev.length === 0) {
        const newExpandedNodeIndex = data.findIndex((node) => node.namespace === dataSource);
        if (newExpandedNodeIndex === -1) return newArr;
        newArr.push({ node: data[newExpandedNodeIndex], nodeIndex: newExpandedNodeIndex });
        return newArr;
      }

      prev.forEach((expNode, prevIdx) => {
        const prevExpName = prevIdx === 0 && dataSource ? dataSource : expNode.node.namespace;
        const list = tempNode?.children ?? data;
        if (!list) return;

        const newExpandedNodeIndex = list.findIndex((node) => node.namespace === prevExpName);
        if (newExpandedNodeIndex === -1) return newArr;

        newArr.push({ node: list[newExpandedNodeIndex], nodeIndex: newExpandedNodeIndex });
        tempNode = { ...list[newExpandedNodeIndex] };
      });
      return newArr;
    });
  }, [data, searchParams]);

  // Effect to synchronize scroll positions with expanded nodes
  useEffect(() => {
    setScrollTopPositions((prev) => {
      const newArray = [...prev];
      if (expandedNodes.length > prev.length - 1) {
        newArray.push(0);
      }
      if (expandedNodes.length < prev.length - 1) {
        newArray.splice(expandedNodes.length, prev.length - expandedNodes.length, 0);
      }
      return newArray;
    });
  }, [expandedNodes]);

  // Handles node click events to expand or navigate to a specific node
  const handleOnClickNode = (depth: number, index: number, node: TreeNodeType) => {
    const item = { node, nodeIndex: index };

    if (depth === 0) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("data_source", node.namespace ?? node.name);
      router.replace(`/dashboard/root-cause-analysis?${params.toString()}`);
      return;
    }

    setExpandedNodes((prev) => {
      const newArray = [...prev];
      if (depth === newArray.length) {
        newArray[depth] = item;
      } else if (depth > newArray.length) {
        newArray.push(item);
      } else {
        newArray.splice(depth - prev.length, prev.length - depth, item);
      }
      return newArray;
    });
  };

  // Updates scroll positions for a specific tree level
  const handleOnScroll = (depth: number, scrollTop: number) => {
    setScrollTopPositions((prev) => {
      const newArray = [...prev];
      newArray[depth] = scrollTop;
      return newArray;
    });
  };

  return (
    <div className="w-full px-6 pb-8 flex flex-col gap-8">
      {/* TopBar to display context at different levels */}
      <div className="w-full grid grid-cols-4 gap-16 justify-center">
        {data && <TopBar title="Data Source" subtitle={expandedNodes[0]?.node?.name} isLoading={isLoading} />}
        {expandedNodes[0] && <TopBar title="Metric Anomaly" subtitle={expandedNodes[1]?.node?.name} isLoading={isLoading} />}
        {expandedNodes[1] && <TopBar title={expandedNodes[1].node.children_fieldname ?? "Service"} subtitle={expandedNodes[2]?.node?.name} isLoading={isLoading} />}
        {expandedNodes[2] && <TopBar title="Impacted Service" subtitle={expandedNodes[3]?.node?.name} isLoading={isLoading} />}
      </div>

      {/* ScrollableNodeList displays nodes and their children */}
      <div className="grid grid-cols-4 gap-16 justify-center items-center">
        <ScrollableNodeList
          nodes={data}
          handleOnClickNode={(index) => handleOnClickNode(0, index, data[index])}
          expandedIndex={expandedNodes[0]?.nodeIndex}
          expandedChildIndex={expandedNodes[1]?.nodeIndex - scrollTopPositions[1] / nodeHeight}
          handleOnScroll={(scrollTop) => handleOnScroll(0, scrollTop)}
          fullScreenHandle={fullScreenHandle}
          maxCount={totalAnomaly}
          isLoading={isLoading}
          handleSelectNLP={handleSelectNLP}
        />

        {expandedNodes.map((expNode, i) => {
          if (i >= 3) return null;

          if (expNode.node.children?.length) {
            return (
              <ScrollableNodeList
                key={expNode.node.name}
                dataSourceLabel={expandedNodes[0].node.name}
                nodes={expNode.node.children}
                handleOnClickNode={(index) => handleOnClickNode(i + 1, index, expNode.node.children![index])}
                expandedIndex={expandedNodes[i + 1]?.nodeIndex}
                expandedChildIndex={expandedNodes[i + 2]?.nodeIndex - scrollTopPositions[i + 2] / nodeHeight}
                handleOnScroll={(scrollTop) => handleOnScroll(i + 1, scrollTop)}
                hasDetail={i === 1}
                fieldname={expNode.node.children_fieldname}
                toUppercase={i === 1}
                time_range={timeRange}
                fullScreenHandle={fullScreenHandle}
                maxCount={expNode.node.anomalyCount ?? 0}
                isLoading={isLoading}
                handleSelectNLP={handleSelectNLP}
              />
            );
          }

          return (
            <Typography key="placeholder-no-impacted-service" variant="subtitle1" color="white" align="center">
              No Impacted Service
            </Typography>
          );
        })}
      </div>
    </div>
  );
};

export default RCATree;
