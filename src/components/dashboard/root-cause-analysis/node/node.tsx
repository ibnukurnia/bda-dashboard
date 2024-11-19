import React, { useEffect, useRef, useState } from 'react';
import ProgressBar from '../bar/progress-bar';
import { Typography } from '@mui/material';
import Link from 'next/link';
import { NLP, Param } from '@/modules/models/root-cause-analysis';
import TooltipNode from '../collection/tooltip-node';

// Props interface for the Node component
interface NodeProps {
  percentage: number; // Accepts a number between 0 and 100
  dataSourceLabel?: string; // Label for the data source
  title: string; // Title of the node
  fungsi?: string; // Optional field to display additional information
  count?: number; // Count value associated with the node
  expanded: boolean; // Indicates whether the node is expanded
  handleOnClickNode: () => void; // Callback for node click
  hasDetail?: boolean; // Indicates if the node has a detailed view
  fieldname?: string; // Optional field name for display
  toUppercase?: boolean; // Flag to determine if the title should be uppercase
  cluster?: string; // Optional field for cluster information
  detailParams?: Param[]; // Parameters for the detail link
  time_range?: string; // Time range for the detail view
  tooltips?: { status_code: string; total: number }[]; // Tooltip data
  nlps?: NLP[]; // NLP-related data
  handleSelectNLP: (value: { data_source: string; service: string; nlps: NLP[] } | null) => void; // Callback to select NLP data
}

const Node: React.FC<NodeProps> = ({
  percentage,
  dataSourceLabel,
  title,
  fungsi,
  count,
  expanded,
  handleOnClickNode,
  hasDetail,
  fieldname,
  toUppercase,
  cluster,
  detailParams,
  time_range,
  tooltips,
  nlps,
  handleSelectNLP,
}) => {
  // State to track the container width
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLButtonElement>(null);

  // Set up event listeners for window resize to update container width
  useEffect(() => {
    window.addEventListener('resize', handleContainerWidth);
    return () => {
      window.removeEventListener('resize', handleContainerWidth);
    };
  }, []);

  // Update the container width when the reference changes
  useEffect(() => {
    if (!containerRef.current) return;
    handleContainerWidth();
  }, [containerRef]);

  // Updates the container width based on the current element size
  const handleContainerWidth = () => {
    if (!containerRef.current) return;
    setContainerWidth(containerRef.current.clientWidth);
  };

  // Handle node click and pass the selected NLP data
  const handleClickNode = () => {
    handleOnClickNode();
    if (nlps) {
      handleSelectNLP({
        nlps: nlps,
        data_source: dataSourceLabel ?? "",
        service: title,
      });
    } else {
      handleSelectNLP(null);
    }
  };

  // Generate an anchor ID based on the detail parameters
  const anchorId = detailParams?.reduce((acc: string, { key, value }, index) => {
    if (index === 0) {
      return `${key}-${value}`;
    }
    return `${acc}--${key}-${value}`;
  }, "");

  // Map the detail parameters into an object for URL query
  const mappedDetailParam = detailParams?.reduce((acc: { [key: string]: string }, { key, value }) => {
    acc[key] = value;
    return acc;
  }, {});

  return (
    <button
      ref={containerRef}
      className={`w-full min-h-20 flex flex-col outline-none snap-start ${count == null ? "cursor-default" : ""}`}
      onClick={handleClickNode}
    >
      {/* Render progress bar if count is available */}
      {count != null && <ProgressBar progress={percentage} />}
      <div className="w-full flex gap-2 justify-between">
        {/* Tooltip icon and node */}
        {tooltips != null && (
          <div className="flex flex-col">
            <a id={anchorId} className="mt-[2.5px]" data-tooltip-place="top-start">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 0C2.7 0 0 2.7 0 6C0 9.3 2.7 12 6 12C9.3 12 12 9.3 12 6C12 2.7 9.3 0 6 0ZM6.6 9H5.4V5.4H6.6V9ZM6.6 4.2H5.4V3H6.6V4.2Z" fill="white" fillOpacity="0.8" />
              </svg>
            </a>
            <TooltipNode anchorId={anchorId} service_alias={title} tooltips={tooltips} />
          </div>
        )}

        {/* Placeholder icon if no tooltip */}
        {count == null && <div className="w-5 h-5 bg-orange-500 rounded-md" />}

        {/* Node details */}
        <div
          className="flex flex-col"
          style={{
            width: `calc(100% - (${tooltips != null ? "1rem + 56px" : "0.5rem + 44px"}))`,
          }}
        >
          {/* Title */}
          <Typography
            title={title}
            color="white"
            fontWeight={expanded ? 700 : 400}
            fontSize={14}
            lineHeight="17.07px"
            align="left"
            noWrap
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {hasDetail && `${fieldname ?? "Service"}:`} {toUppercase ? title.toUpperCase() : title}
          </Typography>

          {/* Additional details like fungsi */}
          {fungsi && (
            <Typography
              title={fungsi}
              color="white"
              fontWeight={expanded ? 700 : 400}
              fontSize={14}
              lineHeight="17.07px"
              align="left"
              noWrap
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {hasDetail && "Fungsi:"} {fungsi}
            </Typography>
          )}

          {/* Cluster details */}
          {cluster && (
            <Typography
              title={cluster}
              color="white"
              fontWeight={expanded ? 700 : 400}
              fontSize={14}
              lineHeight="17.07px"
              align="left"
              noWrap
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {hasDetail && "Site:"} {toUppercase ? cluster.toUpperCase() : cluster}
            </Typography>
          )}
        </div>

        {/* Right section for count and detail link */}
        <div className="flex flex-col gap-[5px] justify-between">
          {/* Count display */}
          {count != null && (
            <Typography color="white" fontWeight={expanded ? 700 : 400} fontSize={14} lineHeight="17.07px" align="right">
              {count}
            </Typography>
          )}

          {/* Detail link */}
          {hasDetail && (
            <Link
              href={{ pathname: '/dashboard/anomaly-detection', query: { ...mappedDetailParam, time_range } }}
              passHref
              rel="noopener noreferrer"
              className="flex gap-0 items-center rounded-lg"
            >
              <Typography className="hover:underline" fontSize={12} lineHeight="14.63px" color="#4787FF" noWrap>
                {"Detail >"}
              </Typography>
            </Link>
          )}
        </div>
      </div>
    </button>
  );
};

export default Node;
