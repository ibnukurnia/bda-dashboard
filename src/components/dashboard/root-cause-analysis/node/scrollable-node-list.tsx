import React, { useEffect, useRef, useState } from 'react';
import { TreeNodeType } from '../tree/types';
import Node from './node';
import './scrollable-node-list.css'
import Path from '../path/path';
import { ChevronDown, ChevronUp } from 'react-feather';

const nodeHeight = 80

interface ScrollableNodeListProps {
  nodes: TreeNodeType[];
  handleOnClickNode: (index: number) => void;
  expandedIndex: number;
  expandedChildIndex: number;
  handleOnScroll: (scrollTop: number) => void;
  handleOpenDetail?: () => void;
}

const ScrollableNodeList: React.FC<ScrollableNodeListProps> = ({
  nodes,
  handleOnClickNode,
  expandedIndex,
  expandedChildIndex,
  handleOnScroll,
  handleOpenDetail,
}) => {
  const [hideButtonUp, setHideButtonUp] = useState<boolean>(true);
  const [hideButtonDown, setHideButtonDown] = useState<boolean>(true);
  const [sliderHeight, setSliderHeight] = useState<number>(0);
  const [scrollTopPositions, setScrollTopPositions] = useState<number>(0)
  const [maxCount, setMaxCount] = useState<number>(0)
  const [containerWidth, setContainerWidth] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.addEventListener('resize', handleSliderHeight);
    window.addEventListener('resize', handleContainerWidth);
    return () => {
        window.removeEventListener('resize', handleSliderHeight);
        window.removeEventListener('resize', handleContainerWidth);
    };
  }, [])

  useEffect(() => {
    handleSliderHeight()
    handleContainerWidth()
    setMaxCount(nodes.reduce((count, node) => {
      if (!node.anomalyCount) return count
      return node.anomalyCount > count ? node.anomalyCount : count
    }, 0))
  }, [nodes])

  useEffect(() => {
    handleScrollButtonVisibility()
  }, [sliderHeight])

  const handleContainerWidth = () => {
    if (!containerRef.current) return 
    setContainerWidth(containerRef.current?.clientWidth)
  }

  const handleSliderHeight = () => {
    if (!containerRef.current) return 
    
    setSliderHeight(
      containerRef.current.scrollHeight -
        containerRef.current.offsetHeight
    )
  }

  const handleScrollButtonVisibility = () => {
    if (!containerRef.current) return 
    
    if (containerRef.current.scrollTop > 0) {
      setHideButtonUp(false);
    } else {
      setHideButtonUp(true);
    }
    if (containerRef.current.scrollTop < sliderHeight) {
      setHideButtonDown(false);
    } else {
      setHideButtonDown(true);
    }
  }

  const scrollDown = () => {
    if (!containerRef.current) return 
    containerRef.current.scrollTop += 200;
  };
  
  const scrollUp = () => {
    if (!containerRef.current) return 
    containerRef.current.scrollTop -= 200;
  };

  const onScroll = (event: React.UIEvent<HTMLDivElement>) => {
    handleScrollButtonVisibility()
    setScrollTopPositions(event.currentTarget.scrollTop)
    handleOnScroll(event.currentTarget.scrollTop)
  };

  return (
    <div className='relative'>
      {!hideButtonUp &&
        <div
          className='absolute -top-8 w-full flex justify-center'
        >
          <button
            className='hover:bg-gray-600 active:bg-gray-500 rounded-lg'
            onMouseDown={scrollUp}
          >
            <ChevronUp color='white' size={24}/>
          </button>
        </div>
      }
      <div
        ref={containerRef}
        className="w-full no-scrollbar scroll-smooth overflow-y-auto grid grid-flow-row snap-y snap-mandatory"
        style={{
          height: "560px",
          gridTemplateRows: "repeat(7, 1fr)"
        }}
        onScroll={onScroll}
      >
        {nodes.map((node, index) => (
          <Node
            key={node.name}
            title={node.name}
            percentage={node.anomalyCount ? node.anomalyCount / maxCount * 100 : 100}
            count={node.anomalyCount}
            expanded={expandedIndex === index}
            handleOnClickNode={()=> handleOnClickNode(index)}
            handleOpenDetail={handleOpenDetail}
          />
        ))}
      </div>
      <Path
        sourceIndex={expandedIndex - scrollTopPositions / nodeHeight}
        expandedIndex={expandedChildIndex}
        childCount={nodes[expandedIndex]?.children?.length}
        nodeWidth={containerWidth}
      />
      {!hideButtonDown &&
        <div
          className='absolute -bottom-4 w-full flex justify-center'
        >
          <button
            className='hover:bg-gray-600 active:bg-gray-500 rounded-lg'
            onMouseDown={scrollDown}
          >
            <ChevronDown color='white' size={24}/>
          </button>
        </div>
      }
    </div>
  );
};

export default ScrollableNodeList;
