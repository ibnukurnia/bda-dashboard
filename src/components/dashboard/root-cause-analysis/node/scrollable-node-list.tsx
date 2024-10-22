import React, { useEffect, useRef, useState } from 'react';
import { TreeNodeType } from '../tree/types';
import Node from './node';
import './scrollable-node-list.css'
import Path from '../path/path';
import { ChevronDown, ChevronUp } from 'react-feather';
import { FullScreenHandle } from 'react-full-screen';
import useUpdateEffect from '@/hooks/use-update-effect';
import NodeListWrapper from '../wrapper/node-list-wrapper';
import { NLP } from '@/modules/models/root-cause-analysis';

const nodeHeight = 80
const headerHeight = 96
const titleHeight = 64
const filterHeight = 44
const gapHeight = 32
const otherHeight = 35
const otherElementHeight = (isFullScreen: boolean) =>
  !isFullScreen ? headerHeight + filterHeight + gapHeight * 6 + titleHeight + otherHeight : gapHeight * 6 + titleHeight

interface ScrollableNodeListProps {
  nodes: TreeNodeType[];
  handleOnClickNode: (index: number) => void;
  expandedIndex: number;
  expandedChildIndex: number;
  handleOnScroll: (scrollTop: number) => void;
  hasDetail?: boolean;
  queryParams?: {
    time_range: string;
    data_source: string;
    anomaly: string;
  };
  fullScreenHandle: FullScreenHandle; // From react-full-screen
  maxCount: number;
  isLoading: boolean;
  handleSelectNLP: (value: {
    data_source: string
    service: string
  } & NLP | null) => void;
}

const ScrollableNodeList: React.FC<ScrollableNodeListProps> = ({
  nodes,
  handleOnClickNode,
  expandedIndex,
  expandedChildIndex,
  handleOnScroll,
  hasDetail,
  queryParams,
  fullScreenHandle, // Use handle from react-full-screen
  maxCount,
  isLoading,
  handleSelectNLP,
}) => {
  const [hideButtonUp, setHideButtonUp] = useState<boolean>(true);
  const [hideButtonDown, setHideButtonDown] = useState<boolean>(true);
  const [sliderHeight, setSliderHeight] = useState<number>(0);
  const [scrollTopPositions, setScrollTopPositions] = useState<number>(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const [containerHeight, setContainerHeight] = useState(window.innerHeight - otherElementHeight(fullScreenHandle.active))

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.addEventListener('resize', handleSliderHeight);
    window.addEventListener('resize', handleContainerWidth);
    window.addEventListener('resize', handleContainerHeight);
    return () => {
      window.removeEventListener('resize', handleSliderHeight);
      window.removeEventListener('resize', handleContainerWidth);
      window.removeEventListener('resize', handleContainerHeight);
    };
  }, [])

  useUpdateEffect(() => {
    handleSliderHeight()
    handleContainerWidth()
    handleContainerHeight()
  }, [fullScreenHandle.active])

  useEffect(() => {
    handleSliderHeight()
    handleContainerWidth()
    handleContainerHeight()
  }, [nodes])

  useUpdateEffect(() => {
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

  const getPercentageValue = (anomalyCount?: number) => {
    if (maxCount === 0) return 0
    if (anomalyCount != null) return anomalyCount / maxCount * 100
    return 100
  }

  const handleContainerHeight = () => {
    const isFullScreen = fullScreenHandle.node.current?.classList.contains('fullscreen-enabled') ?? false

    const height = window.innerHeight - otherElementHeight(isFullScreen); // equivalent to calc(100vh - other element height)
    const roundedHeight = Math.floor(height / 80) * 80; // rounding down to nearest multiple of 80

    setContainerHeight(Math.max(80, roundedHeight))
  }

  const getPathCount = () => {
    const childCount = nodes[expandedIndex]?.children?.length
    const countByHeight = Math.floor(containerHeight / 80)

    if (!childCount) return undefined

    return Math.min(childCount, Math.max(1, countByHeight))
  }

  return (
    <div className='relative'>
      {!isLoading && !hideButtonUp &&
        <div
          className='absolute -top-8 w-full flex justify-center'
        >
          <button
            className='hover:bg-gray-600 active:bg-gray-500 rounded-lg'
            onMouseDown={scrollUp}
          >
            <ChevronUp color='white' size={24} />
          </button>
        </div>
      }
      <div
        ref={containerRef}
        className="w-full no-scrollbar scroll-smooth overflow-y-auto flex flex-col snap-y snap-mandatory"
        style={{
          height: containerHeight,
        }}
        onScroll={onScroll}
      >
        <NodeListWrapper
          nodeCount={Math.max(Math.floor(containerHeight / 80), 1)}
          isLoading={isLoading}
        >
          {nodes.map((node, index) => (
            <Node
              key={`${node.name}-${node.cluster}`}
              title={node.name}
              fungsi={node.fungsi}
              percentage={getPercentageValue(node.anomalyCount)}
              count={node.anomalyCount}
              expanded={expandedIndex === index}
              handleOnClickNode={() => handleOnClickNode(index)}
              hasDetail={hasDetail}
              queryParams={{
                ...queryParams,
                cluster: node.cluster,
                service: node.namespace ?? node.name,
              }}
              tooltips={node.tooltips}
              nlp={node.nlp}
              handleSelectNLP={handleSelectNLP}
            />
          ))}
        </NodeListWrapper>
      </div>
      <Path
        sourceIndex={expandedIndex - scrollTopPositions / nodeHeight}
        expandedIndex={expandedChildIndex}
        childCount={getPathCount()}
        nodeWidth={containerWidth}
      />
      {!isLoading && !hideButtonDown &&
        <div
          className='absolute -bottom-4 w-full flex justify-center'
        >
          <button
            className='hover:bg-gray-600 active:bg-gray-500 rounded-lg'
            onMouseDown={scrollDown}
          >
            <ChevronDown color='white' size={24} />
          </button>
        </div>
      }
    </div>
  );
};

export default ScrollableNodeList;
