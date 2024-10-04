import React from 'react';

const startX = 0
const startY = 0
const endX = 0
const endY = 0
const controlX1 = 0
const controlY1 = 0
const controlX2 = 0
const controlY2 = 0
const width = 64
const heigth = 560 - 10 // Scrollable list heigth - top position
const nodeHeight = 80
const curveControl = 30

interface PathProps {
  sourceIndex: number;
  childCount?: number
  expandedIndex?: number;
  nodeWidth?: string | number;
}

const Path: React.FC<PathProps> = ({
  sourceIndex,
  childCount,
  expandedIndex,
  nodeWidth = 192,
}) => {
  if (childCount != null) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={'absolute left-48 z-10'}
        style={{ top: '10px', left: nodeWidth }}
        width={width}
        height={heigth}
      >
        {Array.from(Array(Math.min(7, childCount)), (_, i) => (
          <path
            key={`path-${sourceIndex}-${i}`}
            d={`M${startX},${startY + (sourceIndex * nodeHeight)} 
                C${sourceIndex !== i ? curveControl : controlX1},${sourceIndex * nodeHeight + controlY1} 
                ${sourceIndex !== i ? curveControl : controlX2},${controlY2 + (i * nodeHeight)} 
                ${endX + width},${endY + (i * nodeHeight)}`}
            stroke="white"
            strokeWidth="2"
            opacity={expandedIndex === i ? 1 : .1}
            fill="transparent"
          />
        ))}
      </svg>
    )
  }

  return null
};

export default Path;
