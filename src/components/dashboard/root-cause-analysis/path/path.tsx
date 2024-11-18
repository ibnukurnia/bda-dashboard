import zIndex from '@mui/material/styles/zIndex'; // For managing z-index styles
import React from 'react';

// Constants for initial positions and control points of the path
const startX = 0; // Starting X-coordinate of the path
const startY = 10; // Starting Y-coordinate of the path
const endX = 0; // Ending X-coordinate of the path
const endY = 10; // Ending Y-coordinate of the path
const controlX1 = 0; // First control point's X-coordinate
const controlY1 = 10; // First control point's Y-coordinate
const controlX2 = 0; // Second control point's X-coordinate
const controlY2 = 10; // Second control point's Y-coordinate
const width = 64; // Width of the SVG canvas
const height = 560 - 10; // Height of the SVG canvas (scrollable list height - top position)
const nodeHeight = 80; // Height of each node
const curveControl = 30; // Default control point for curve paths

// Interface for the component props
interface PathProps {
  sourceIndex: number; // Index of the source node
  childCount?: number; // Number of child nodes (optional)
  expandedIndex?: number; // Index of the currently expanded node (optional)
  nodeWidth?: string | number; // Width of the node (default is 192px)
}

// React functional component for rendering curved paths between nodes
const Path: React.FC<PathProps> = ({
  sourceIndex,
  childCount,
  expandedIndex,
  nodeWidth = 192, // Default node width
}) => {
  // Render the SVG paths only if there are child nodes
  if (childCount != null) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg" // SVG namespace
        className={'absolute left-48 z-10'} // Positioning and z-index styles
        style={{ top: 0, left: nodeWidth }} // Dynamic positioning based on node width
        width={width} // Fixed width for the SVG canvas
        height={height} // Fixed height for the SVG canvas
      >
        {/* Generate paths for the child nodes */}
        {Array.from(Array(Math.min(7, childCount)), (_, i) => (
          <path
            key={`path-${sourceIndex}-${i}`} // Unique key for each path
            d={`M${startX},${startY + sourceIndex * nodeHeight} 
                C${sourceIndex !== i ? curveControl : controlX1},${sourceIndex * nodeHeight + controlY1} 
                ${sourceIndex !== i ? curveControl : controlX2},${controlY2 + i * nodeHeight} 
                ${endX + width},${endY + i * nodeHeight}`} // Bezier curve path
            stroke={expandedIndex === i ? "#f36f21" : "white"} // Highlight stroke color for expanded node
            strokeWidth={expandedIndex === i ? 4 : 2} // Thicker stroke for the expanded node
            strokeDasharray={expandedIndex === i ? 0 : 10} // Dashed lines for non-expanded nodes
            opacity={expandedIndex === i ? 1 : 0.8} // Higher opacity for expanded node
            fill="transparent" // Transparent fill for the path
          />
        ))}
      </svg>
    );
  }

  // Return null if there are no child nodes
  return null;
};

export default Path;
