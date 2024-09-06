import React, { useEffect, useRef, useState } from 'react';
import { TreeNodeType } from '../tree/types';
import Node from './node';
import './scrollable-node-list.css'
import Path from '../path/path';
import { ChevronDown, ChevronUp } from 'react-feather';

interface ScrollableNodeListProps {
  nodes: TreeNodeType[];
  handleOnClickNode: (index: number) => void;
  expandedIndex: number;
  expandedChildIndex: number;
  handleOnScroll: (scrollTop: number) => void;
}

const ScrollableNodeList: React.FC<ScrollableNodeListProps> = ({
  nodes,
  handleOnClickNode,
  expandedIndex,
  expandedChildIndex,
  handleOnScroll,
}) => {
  const [hideButtonUp, setHideButtonUp] = useState<boolean>(true);
  const [hideButtonDown, setHideButtonDown] = useState<boolean>(true);
  const [sliderHeight, setSliderHeight] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    handleSliderWidth()
  }, [nodes])

  useEffect(() => {
    handleScrollButtonVisibility()
  }, [sliderHeight])

  const handleSliderWidth = () => {
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
        className="w-48 no-scrollbar scroll-smooth overflow-y-auto grid grid-flow-row snap-y snap-mandatory"
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
            percentage={node.percentage}
            count={node.anomalyCount}
            expanded={expandedIndex === index}
            handleOnClickNode={()=> handleOnClickNode(index)}
          />
        ))}
      </div>
      <Path
        sourceIndex={expandedIndex}
        expandedIndex={expandedChildIndex}
        childCount={nodes[expandedIndex]?.children?.length}
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
