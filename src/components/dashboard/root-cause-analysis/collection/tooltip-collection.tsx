import React from "react";
import { RootCauseAnalysisTreeResponse } from "@/modules/models/root-cause-analysis";
import { Tooltip } from "react-tooltip";

interface TooltipData {
  type: string;
  anomaly: string;
  service: string;
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
            service: service.service,
            tooltips: service.tooltips,
          });
        }
      });
    })
  });
  
  return servicesWithTooltip.map(service =>
    <Tooltip
      key={`#${service?.type}-${service?.anomaly}-${service.service.replace(/ /g,'')}`}
      anchorSelect={`#${service?.type}-${service?.anomaly}-${service.service.replace(/ /g,'')}`}
      className="!bg-white !text-black"
    >
      {service.tooltips.map(tooltip => (
        <div
          key={tooltip.status_code}
          className="flex gap-2 justify-between"
        >
          <div>Status Code {tooltip.status_code}: </div>
          <div>{tooltip.total}</div>
        </div>
      ))}
    </Tooltip>
  )
};

export default TooltipCollection;
