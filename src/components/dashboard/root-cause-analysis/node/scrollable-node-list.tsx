import React, { useEffect, useRef, useState } from 'react';
import { TreeNodeType } from '../tree/types';
import Node from './node';
import './scrollable-node-list.css';
import Path from '../path/path';
import { ChevronDown, ChevronUp } from 'react-feather';
import { FullScreenHandle } from 'react-full-screen';
import useUpdateEffect from '@/hooks/use-update-effect';
import NodeListWrapper from '../wrapper/node-list-wrapper';
import { NLP } from '@/modules/models/root-cause-analysis';

// Constant dimensions for layout calculations
const nodeHeight = 80;
const headerHeight = 96;
const titleHeight = 64;
const filterHeight = 44;
const gapHeight = 32;
const otherHeight = 35;

// Function to calculate height of other elements dynamically based on fullscreen mode
const otherElementHeight = (isFullScreen: boolean) =>
  !isFullScreen
    ? headerHeight + filterHeight + gapHeight * 6 + titleHeight + otherHeight
    : gapHeight * 6 + titleHeight;

// Props definition for the ScrollableNodeList component
interface ScrollableNodeListProps {
  dataSourceLabel?: string; // Label for the data source
  nodes: TreeNodeType[]; // List of nodes to render
  handleOnClickNode: (index: number) => void; // Callback when a node is clicked
  expandedIndex: number; // Index of the currently expanded node
  expandedChildIndex: number; // Index of the expanded child node
  handleOnScroll: (scrollTop: number) => void; // Callback for scroll events
  hasDetail?: boolean; // Flag indicating if detailed view is available
  fieldname?: string; // Field name for custom display
  toUppercase?: boolean; // Flag to transform text to uppercase
  time_range?: string; // Time range for filtering data
  fullScreenHandle: FullScreenHandle; // Fullscreen handler object
  maxCount: number; // Maximum count for percentage calculations
  isLoading: boolean; // Flag indicating if data is loading
  handleSelectNLP: (value: {
    data_source: string;
    service: string;
    nlps: NLP[];
  } | null) => void; // Callback for NLP selection
}

const ScrollableNodeList: React.FC<ScrollableNodeListProps> = ({
  dataSourceLabel,
  nodes,
  handleOnClickNode,
  expandedIndex,
  expandedChildIndex,
  handleOnScroll,
  hasDetail,
  fieldname,
  toUppercase,
  time_range,
  fullScreenHandle,
  maxCount,
  isLoading,
  handleSelectNLP,
}) => {
  // State variables for managing scroll and layout
  const [hideButtonUp, setHideButtonUp] = useState<boolean>(true);
  const [hideButtonDown, setHideButtonDown] = useState<boolean>(true);
  const [sliderHeight, setSliderHeight] = useState<number>(0);
  const [scrollTopPositions, setScrollTopPositions] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [containerHeight, setContainerHeight] = useState<number>(
    window.innerHeight - otherElementHeight(fullScreenHandle.active)
  );

  const containerRef = useRef<HTMLDivElement>(null);

  // Effect to observe and handle scrollbar visibility and dimensions
  useEffect(() => {
    const checkForScrollbar = () => {
      const body = document.body;
      const html = document.documentElement;
      const scrollHeight = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      );
      const clientHeight = window.innerHeight;

      if (scrollHeight > clientHeight) {
        handleSliderHeight();
        handleContainerWidth();
        handleContainerHeight();
      }
    };

    const observer = new ResizeObserver(checkForScrollbar);

    // Observe changes in body and html dimensions
    observer.observe(document.body);
    observer.observe(document.documentElement);

    // Initial scrollbar check
    checkForScrollbar();

    // Update dimensions on window resize
    window.addEventListener('resize', handleSliderHeight);
    window.addEventListener('resize', handleContainerWidth);
    window.addEventListener('resize', handleContainerHeight);

    return () => {
      window.removeEventListener('resize', handleSliderHeight);
      window.removeEventListener('resize', handleContainerWidth);
      window.removeEventListener('resize', handleContainerHeight);
      observer.disconnect();
    };
  }, []);

  // Effect to handle fullscreen mode changes
  useUpdateEffect(() => {
    handleSliderHeight();
    handleContainerWidth();
    handleContainerHeight();
  }, [fullScreenHandle.active]);

  // Effect to update dimensions when nodes data changes
  useEffect(() => {
    handleSliderHeight();
    handleContainerWidth();
    handleContainerHeight();
  }, [nodes]);

  // Effect to update scroll button visibility when slider height changes
  useUpdateEffect(() => {
    handleScrollButtonVisibility();
  }, [sliderHeight]);

  // Calculate container width
  const handleContainerWidth = () => {
    if (!containerRef.current) return;
    setContainerWidth(containerRef.current.clientWidth);
  };

  // Calculate slider height for scroll
  const handleSliderHeight = () => {
    if (!containerRef.current) return;
    setSliderHeight(
      containerRef.current.scrollHeight - containerRef.current.offsetHeight
    );
  };

  // Manage visibility of scroll buttons
  const handleScrollButtonVisibility = () => {
    if (!containerRef.current) return;

    setHideButtonUp(containerRef.current.scrollTop === 0);
    setHideButtonDown(
      containerRef.current.scrollTop < sliderHeight
    );
  };

  // Scroll down action
  const scrollDown = () => {
    if (!containerRef.current) return;
    containerRef.current.scrollTop += 200;
  };

  // Scroll up action
  const scrollUp = () => {
    if (!containerRef.current) return;
    containerRef.current.scrollTop -= 200;
  };

  // Handle scroll events
  const onScroll = (event: React.UIEvent<HTMLDivElement>) => {
    handleScrollButtonVisibility();
    setScrollTopPositions(event.currentTarget.scrollTop);
    handleOnScroll(event.currentTarget.scrollTop);
  };

  // Calculate percentage value for anomaly count
  const getPercentageValue = (anomalyCount?: number) => {
    if (maxCount === 0) return 0;
    return anomalyCount != null ? (anomalyCount / maxCount) * 100 : 100;
  };

  // Calculate container height based on fullscreen mode
  const handleContainerHeight = () => {
    const isFullScreen =
      fullScreenHandle.node.current?.classList.contains('fullscreen-enabled') ??
      false;

    const height = window.innerHeight - otherElementHeight(isFullScreen);
    const roundedHeight = Math.floor(height / 80) * 80; // Round to nearest multiple of 80

    setContainerHeight(Math.max(80, roundedHeight));
  };

  // Determine path count based on child nodes and available height
  const getPathCount = () => {
    const childCount = nodes[expandedIndex]?.children?.length;
    const countByHeight = Math.floor(containerHeight / 80);

    if (!childCount) return undefined;
    return Math.min(childCount, Math.max(1, countByHeight));
  };

  return (
    <div className="relative">
      {/* Scroll Up Button */}
      {!isLoading && !hideButtonUp && (
        <div className="absolute -top-8 w-full flex justify-center">
          <button
            className="hover:bg-gray-600 active:bg-gray-500 rounded-lg"
            onMouseDown={scrollUp}
          >
            <ChevronUp color="white" size={24} />
          </button>
        </div>
      )}
      {/* Scrollable Node Container */}
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
          {/* Render Nodes */}
          {nodes.map((node, index) => (
            <Node
              key={`${node.name}-${node.cluster}`}
              dataSourceLabel={dataSourceLabel}
              title={node.name}
              fungsi={node.fungsi}
              percentage={getPercentageValue(node.anomalyCount)}
              count={node.anomalyCount}
              expanded={expandedIndex === index}
              handleOnClickNode={() => handleOnClickNode(index)}
              hasDetail={hasDetail}
              fieldname={fieldname}
              toUppercase={toUppercase}
              cluster={node.cluster}
              detailParams={node.detail_params}
              time_range={time_range}
              tooltips={node.tooltips}
              nlps={node.nlps}
              handleSelectNLP={handleSelectNLP}
            />
          ))}
        </NodeListWrapper>
      </div>
      {/* Render Path */}
      {!isLoading && (
        <Path
          sourceIndex={expandedIndex - scrollTopPositions / nodeHeight}
          expandedIndex={expandedChildIndex}
          childCount={getPathCount()}
          nodeWidth={containerWidth}
        />
      )}
      {/* Scroll Down Button */}
      {!isLoading && !hideButtonDown && (
        <div className="absolute -bottom-4 w-full flex justify-center">
          <button
            className="hover:bg-gray-600 active:bg-gray-500 rounded-lg"
            onMouseDown={scrollDown}
          >
            <ChevronDown color="white" size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ScrollableNodeList;
