import React from "react";
import { Tooltip } from "react-tooltip";
import { Typography } from "@mui/material";
import { HEALTHINESS_LEGEND } from "../panels/constants/brimo-end-to-end-contstans";

const TooltipHealthinessLegend: React.FC = () => {
  return (
    <Tooltip
      key={`#healthiness-legend`}
      anchorSelect={`#healthiness-legend`}
      className="py-3 px-4 !bg-[#1A223D] !border-white !rounded-xl !z-20"
      noArrow
      opacity={1}
      style={{
        boxShadow: "0px 4px 24.5px 0px rgba(0, 0, 0, 0.25)",
      }}
    >
      <div
        className="flex flex-col gap-3"
      >
        <Typography
          fontWeight={700}
          fontSize={12}
          lineHeight={'14.63px'}
          color={'white'}
        >
          SEVERITY
        </Typography>
        <div className="flex flex-col gap-[7px]">
          {HEALTHINESS_LEGEND.map(legend => (
            <div key={legend.label} className="flex gap-[5px] items-center">
              <div
                className={`w-[6px] h-[6px] rounded-full`}
                style={{
                  backgroundColor: legend.color
                }}
              />
              <Typography
                fontWeight={600}
                fontSize={12}
                color={'#FFFFFFCC'}
                lineHeight={'14.63px'}
                align="left"
              >
                {legend.label}
              </Typography>
            </div>
          ))}
        </div>
      </div>
    </Tooltip >
  )
};

export default TooltipHealthinessLegend;
