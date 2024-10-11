import React from "react";
import { Tooltip } from "react-tooltip";
import { Typography } from "@mui/material";
import { TopServiceData } from "@/modules/models/overviews";


interface TooltipServiceCollectionProps {
  data?: TopServiceData[] | null;
}
const TooltipServiceCollection: React.FC<TooltipServiceCollectionProps> = ({
  data,
}) => {
  if (!data) return null

  return data.map(item =>
    <Tooltip
      key={`#top-service-${escapeAndRemoveSpaces(item?.service_name)}`}
      anchorSelect={`#top-service-${escapeAndRemoveSpaces(item?.service_name)}`}
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
          color={'white'}
        >
          {item.service_name}
        </Typography>
        {item.fungsi && (
          <Typography
            fontWeight={700}
            fontSize={12}
            color={'white'}
          >
            Feature: {item.fungsi}
          </Typography>
        )}
        {item.detail_cluster && (
          <div className="flex flex-col gap-[9px]">
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${item.detail_cluster.length+1},1fr)`,
              }}
            >
              <Typography
                fontWeight={600}
                fontSize={10}
                color={'white'}
                lineHeight={'12.19px'}
                align="left"
              >
                Severity
              </Typography>
              {item.detail_cluster.map((detail, i) => 
                <Typography
                  key={i}
                  fontWeight={600}
                  fontSize={10}
                  color={'white'}
                  lineHeight={'12.19px'}
                  align="center"
                >
                  {detail.cluster}
                </Typography>
              )}
            </div>
            <div className="flex flex-col gap-[7px]">
              <div
                className="grid"
                style={{
                  gridTemplateColumns: `repeat(${item.detail_cluster.length+1},1fr)`,
                }}
              >
                <div className="flex gap-[5px] items-center">
                  <div className="w-[6px] h-[6px] bg-[#D23636] rounded-full" />
                  <Typography
                    fontWeight={600}
                    fontSize={10}
                    color={'#FFFFFFCC'}
                    lineHeight={'12.19px'}
                    align="left"
                  >
                    Very High
                  </Typography>
                </div>
                {item.detail_cluster.map((detail, i) => 
                  <Typography
                    key={i}
                    fontWeight={600}
                    fontSize={10}
                    color={'#FFFFFFCC'}
                    lineHeight={'12.19px'}
                    align="center"
                  >
                    {detail.very_high}
                  </Typography>
                )}
              </div>
              <div
                className="grid"
                style={{
                  gridTemplateColumns: `repeat(${item.detail_cluster.length+1},1fr)`,
                }}
              >
                <div className="flex gap-[5px] items-center">
                  <div className="w-[6px] h-[6px] bg-[#FF802D] rounded-full" />
                  <Typography
                    fontWeight={600}
                    fontSize={10}
                    color={'#FFFFFFCC'}
                    lineHeight={'12.19px'}
                    align="left"
                  >
                    High
                  </Typography>
                </div>
                {item.detail_cluster.map((detail, i) => 
                  <Typography
                    key={i}
                    fontWeight={600}
                    fontSize={10}
                    color={'#FFFFFFCC'}
                    lineHeight={'12.19px'}
                    align="center"
                  >
                    {detail.high}
                  </Typography>
                )}
              </div>
              <div
                className="grid"
                style={{
                  gridTemplateColumns: `repeat(${item.detail_cluster.length+1},1fr)`,
                }}
              >
                <div className="flex gap-[5px] items-center">
                  <div className="w-[6px] h-[6px] bg-[#F6C216] rounded-full" />
                  <Typography
                    fontWeight={600}
                    fontSize={10}
                    color={'#FFFFFFCC'}
                    lineHeight={'12.19px'}
                    align="left"
                  >
                    Medium
                  </Typography>
                </div>
                {item.detail_cluster.map(detail => 
                  <Typography
                    key={detail.medium}
                    fontWeight={600}
                    fontSize={10}
                    color={'#FFFFFFCC'}
                    lineHeight={'12.19px'}
                    align="center"
                  >
                    {detail.medium}
                  </Typography>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Tooltip>
  )
};

export default TooltipServiceCollection;

function escapeAndRemoveSpaces(stringToEscape: string) {
  return stringToEscape.replace(/[\(\)\s]/g, match => {
      if (match === '(') return '';
      if (match === ')') return '';
      // if (match === '(') return '\\(';
      // if (match === ')') return '\\)';
      return ''; // remove spaces
  });
}
