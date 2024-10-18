import React from "react";
import { RootCauseAnalysisTreeResponse } from "@/modules/models/root-cause-analysis";
import { Tooltip } from "react-tooltip";
import { Typography } from "@mui/material";

interface TooltipData {
  type: string;
  anomaly: string;
  cluster: string;
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
            cluster: service.cluster,
            service: service.service,
            service_alias: service.service_alias,
            tooltips: service.tooltips,
          });
        }
      });
    })
  });
  
  return servicesWithTooltip.map(service => 
    <Tooltip
      key={`#${service?.type}-${service?.cluster}-${service?.anomaly}-${escapeAndRemoveSpaces(service.service_alias)}`}
      anchorSelect={`#${service?.type}-${service?.cluster}-${service?.anomaly}-${escapeAndRemoveSpaces(service.service_alias)}`}
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
          {service.service_alias}
        </Typography>
        {service.tooltips.map(tooltip => (
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

export default TooltipCollection;

function escapeAndRemoveSpaces(stringToEscape: string) {
  return stringToEscape.replace(/[\(\)\s\.]/g, match => {
      if (match === '(') return '';
      if (match === ')') return '';
      if (match === '.') return '_';
      return ''; // remove spaces
  });
}
