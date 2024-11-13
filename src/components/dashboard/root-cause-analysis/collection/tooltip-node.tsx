import React from "react";
import { Tooltip } from "react-tooltip";
import { Typography } from "@mui/material";

interface TooltipNodeProps {
  anchorId?: string;
  service_alias: string;
  tooltips: {
    status_code: string;
    total: number;
  }[];
}
const TooltipNode: React.FC<TooltipNodeProps> = ({
  anchorId,
  service_alias,
  tooltips,
}) => {

  return (
    <Tooltip
      key={`#${anchorId}`}
      anchorSelect={`#${anchorId}`}
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
        <table>
          <tbody>
            {tooltips.map(tooltip => (
              <tr
                key={tooltip.status_code}
              >
                <td
                  className="w-[1%] whitespace-nowrap"
                >
                  <Typography
                    fontWeight={600}
                    fontSize={10}
                    color={'white'}
                    align="left"
                  >
                    Response Code {tooltip.status_code}
                  </Typography>
                </td>
                <td>
                  <Typography
                    fontWeight={600}
                    fontSize={10}
                    color={'white'}
                    align="left"
                  >
                    :
                  </Typography>
                </td>
                <td>
                  <Typography
                    fontWeight={600}
                    fontSize={10}
                    color={'white'}
                    align="right"
                  >
                    {tooltip.total}
                  </Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Tooltip>
  )
};

export default TooltipNode;
