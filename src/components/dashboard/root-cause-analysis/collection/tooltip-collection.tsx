import React from "react";
import { RootCauseAnalysisTreeResponse } from "@/modules/models/root-cause-analysis";
import { Tooltip } from "react-tooltip";
import { Typography } from "@mui/material";

interface TooltipData {
  type: string;
  anomaly: string;
  service: string;
  service_alias: string;
  tooltips: {
    status_code: string;
    total: number;
  }[];
}

interface TooltipCollectionProps {
  data?: RootCauseAnalysisTreeResponse[] | null;
}
const TooltipCollection: React.FC<TooltipCollectionProps> = ({
  data,
}) => {
  if (!data) return null

  const servicesWithTooltip: TooltipData[] = []

  data.forEach((item) => {
    item.routes.forEach((route) => {
      route.impacted_services.forEach((service) => {
        if (service.tooltips) {
          servicesWithTooltip.push({
            type: item.type,
            anomaly: route.anomaly,
            service: escapeAndRemoveSpaces(service.service_alias),
            service_alias: service.service_alias,
            tooltips: service.tooltips,
          });
        }
      });
    })
  });
  
  return servicesWithTooltip.map(service => 
    <Tooltip
      key={`#${service?.type}-${service?.anomaly}-${service.service}`}
      anchorSelect={`#${service?.type}-${service?.anomaly}-${service.service}`}
      className="py-3 px-4 !bg-[#1A223D] !border-white !rounded-xl"
      noArrow
      style={{
        boxShadow: "0px 4px 24.5px 0px rgba(0, 0, 0, 0.25)",
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
          {service.service_alias}
        </Typography>
        {service.tooltips.map(tooltip => (
          <div
            key={tooltip.status_code}
            className="grid grid-cols-[80px,_auto] gap-2"
          >
            <Typography
              fontWeight={600}
              fontSize={10}
              color={'white'}
            >
              Status Code {tooltip.status_code}
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

export default TooltipCollection;

function escapeAndRemoveSpaces(stringToEscape: string) {
  return stringToEscape.replace(/[\(\)\s]/g, match => {
      if (match === '(') return '';
      if (match === ')') return '';
      // if (match === '(') return '\\(';
      // if (match === ')') return '\\)';
      return ''; // remove spaces
  });
}
