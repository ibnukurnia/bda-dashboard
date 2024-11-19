import { Collapse, Typography } from '@mui/material';
import styles from './collapsible-nlp.module.css';
import { useState } from 'react';
import parse from 'html-react-parser';
import { NLP } from '@/modules/models/root-cause-analysis';

interface CollapsibleNLPProps {
  title: string; // The title of the collapsible section
  data: NLP; // Data to display in the collapsible section
  badge?: 'most_related' | 'additional' | null; // Badge type to highlight the section
  isOpen?: boolean; // Initial open state
}

const CollapsibleNLP = ({
  title,
  data,
  badge,
  isOpen = true, // Default open state is true
}: CollapsibleNLPProps) => {
  const [open, setOpen] = useState(isOpen); // State to toggle the collapsible section

  return (
    <div className="min-w-full py-[15px] px-[23px] flex flex-col gap-[10px] bg-white bg-opacity-5 rounded-[10px] border border-opacity-[0.07] border-white">
      {/* Header Section */}
      <div
        className="flex gap-[10px] cursor-pointer"
        onClick={() => setOpen((prev) => !prev)} // Toggle open/close on click
      >
        {/* Expand/Collapse Icon */}
        <div
          className={`w-[22px] h-[22px] flex items-center justify-center rounded-[4px] bg-[${
            open ? '#306BFF1A' : '#FFF'
          }] bg-opacity-[${open ? '0.1' : '0.03'}]`}
        >
          {open ? (
            // Collapse Icon
            <svg
              width="12"
              height="2"
              viewBox="0 0 12 2"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 1C0 0.447715 0.447715 0 1 0H11C11.5523 0 12 0.447715 12 1C12 1.55228 11.5523 2 11 2H1C0.447715 2 0 1.55228 0 1Z"
                fill="#3078FF"
              />
            </svg>
          ) : (
            // Expand Icon
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5 11C5 11.5523 5.44772 12 6 12C6.55228 12 7 11.5523 7 11V7H11C11.5523 7 12 6.55228 12 6C12 5.44772 11.5523 5 11 5H7V1C7 0.447715 6.55229 0 6 0C5.44772 0 5 0.447715 5 1V5H1C0.447715 5 0 5.44772 0 6C0 6.55228 0.447715 7 1 7H5V11Z"
                fill="white"
                fill-opacity="0.5"
              />
            </svg>
          )}
        </div>
        {/* Title Section */}
        <Typography
          fontWeight={600}
          fontSize={'16px'}
          lineHeight={'24px'}
          letterSpacing={'0.15px'}
          color={'white'}
        >
          {title}
        </Typography>
        {/* Badge Display */}
        {badge && (
          <div
            className="py-[3px] px-[13px] flex items-center justify-center border rounded-[23px]"
            style={{
              borderColor: badge === 'most_related' ? '#08B96D' : '#FF802D',
            }}
          >
            <Typography
              fontWeight={600}
              fontSize={'12px'}
              lineHeight={'14.63px'}
              color={badge === 'most_related' ? '#08B96D' : '#FF802D'}
            >
              {badge === 'most_related' ? 'Most Related' : 'Additional'}
            </Typography>
          </div>
        )}
      </div>
      {/* Collapsible Content */}
      <Collapse in={open} timeout="auto" unmountOnExit>
        <table className={`${styles.table} table-auto w-full`}>
          <thead>
            <tr className="rounded-[7px] bg-white bg-opacity-5">
              {/* Table Headers */}
              {['Nama Insiden', 'Deskripsi Insiden', 'Resolution', 'Action', 'Lesson Learned'].map(
                (header) => (
                  <th
                    key={header}
                    className="py-[10px] px-[15px] whitespace-nowrap w-[150px]"
                  >
                    <Typography
                      fontWeight={600}
                      fontSize={'12px'}
                      lineHeight={'14.1px'}
                      color={'white'}
                    >
                      {header}
                    </Typography>
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-opacity-[0.07] border-white">
              {/* Table Data */}
              {[data.name, data.description, data.resolution, data.action, data.lesson_learned].map(
                (content, idx) => (
                  <td
                    key={idx}
                    className="py-[14px] px-[15px] w-[150px]"
                  >
                    <Typography
                      className={`${styles.typography} whitespace-pre-wrap`}
                      fontWeight={500}
                      fontSize={'12px'}
                      lineHeight={'14.1px'}
                      color={'white'}
                      align={
                        !content || content === '-'
                          ? 'center'
                          : 'left'
                      }
                    >
                      {parse(content || '-')}
                    </Typography>
                  </td>
                )
              )}
            </tr>
          </tbody>
        </table>
      </Collapse>
    </div>
  );
};

export default CollapsibleNLP;
