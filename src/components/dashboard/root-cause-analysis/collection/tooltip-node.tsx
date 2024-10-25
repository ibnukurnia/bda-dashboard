import React from "react";
import { Tooltip } from "react-tooltip";
import { Typography } from "@mui/material";


interface TooltipNodeProps {
  type: string;
  anomaly: string;
  cluster: string;
  service_alias: string;
  tooltips: {
    status_code: string;
    total: number;
  }[];
}
const TooltipNode: React.FC<TooltipNodeProps> = ({
  type,
  anomaly,
  cluster,
  service_alias,
  tooltips,
}) => {

  return (
    <Tooltip
      key={`#${type}-${cluster}-${anomaly}-${escapeAndRemoveSpaces(service_alias)}`}
      anchorSelect={`#${type}-${cluster}-${anomaly}-${escapeAndRemoveSpaces(service_alias)}`}
      className="py-3 px-4 !bg-[#1A223D] !border-white !rounded-xl"
      noArrow
      style={{
        boxShadow: "0px 4px 24.5px 0px rgba(0, 0, 0, 0.25)",
        zIndex: 20,
      }}
      opacity={1}
      
    >
      <div
        className="flex flex-col gap-1"
      >
        <Typography
          fontWeight={700}
          fontSize={12}
          color={'white'}
        >
          {service_alias}
        </Typography>
        {tooltips.map(tooltip => (
          <div
            key={tooltip.status_code}
            className="grid grid-cols-[110px,_auto] gap-2"
          >
            <Typography
              fontWeight={600}
              fontSize={10}
              color={'white'}
            >
              Response Code {tooltip.status_code}
            </Typography>
            <Typography
              fontWeight={600}
              fontSize={10}
              color={'white'}
            >
              : {tooltip.total}
            </Typography>
          </div>
        ))}
      </div>
    </Tooltip>
  )
};

export default TooltipNode;

function escapeAndRemoveSpaces(stringToEscape: string) {
  return stringToEscape.replace(/[\(\)\s\.]/g, match => {
    if (match === '(') return '';
    if (match === ')') return '';
    if (match === '.') return '_';
    return ''; // remove spaces
  });
}
