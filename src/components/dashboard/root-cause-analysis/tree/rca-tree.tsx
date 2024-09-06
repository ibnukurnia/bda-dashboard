import { useEffect, useState } from 'react'
import ScrollableNodeList from '../node/scrollable-node-list';
import { dummyTreeNodes } from './dummy';
import { TreeNodeType } from './types';
import TopBar from '../bar/top-bar';

const nodeHeight = 80

type ExpandedNodesType = {
  node: TreeNodeType;
  nodeIndex: number;
}

interface RCATreeProps {
  handleDetail: () => void;
}
const RCATree: React.FC<RCATreeProps> = ({
  handleDetail,
}) => {
  // State to manage expanded nodes
  const [expandedNodes, setExpandedNodes] = useState<ExpandedNodesType[]>([]);
  const [scrollTopPositions, setScrollTopPositions] = useState<number[]>([])

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
    
    if (!node.children || node.children.length <= 0) {
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
    <div className='m-auto pb-8 flex flex-col gap-8'>
      <div
        className="grid gap-16 justify-center"
          style={{
            gridTemplateColumns: "repeat(4, 1fr)"
          }}
      >
        {expandedNodes.length <= 0 &&
          <TopBar
            title={dummyTreeNodes[0].type ?? ''}
          />
        }
        {expandedNodes.map(expNode => 
          <TopBar
            key={`${expNode.node.type}-${expNode.node.name}`}
            title={expNode.node.type}
            subtitle={expNode.node.name}
          />
        )}
        {(expandedNodes[expandedNodes.length-1]?.node?.children?.length ?? -1 > 0) && 
          <TopBar
            title={expandedNodes[expandedNodes.length-1]?.node.childrenType ?? ''}
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
          nodes={dummyTreeNodes}
          handleOnClickNode={(index) => handleOnClickNode(0, index, dummyTreeNodes[index])}
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
          
          return null
        })}
      </div>
    </div>
  )
}

export default RCATree
