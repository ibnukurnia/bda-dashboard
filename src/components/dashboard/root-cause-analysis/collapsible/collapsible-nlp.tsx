import { Collapse, Typography } from '@mui/material';
import styles from './collapsible-nlp.module.css'
import { useState } from 'react';
import parse from 'html-react-parser';
import { NLP } from '@/modules/models/root-cause-analysis';

interface CollapsibleNLPProps {
  data: {
    data_source: string
    service: string
  } & NLP
}

const CollapsibleNLP = ({
  data,
}: CollapsibleNLPProps) => {
  const [open, setOpen] = useState(true)

  return (
    <div className="min-w-full py-[15px] px-[23px] flex flex-col gap-[10px] bg-white bg-opacity-5 rounded-[10px] border border-opacity-[0.07] border-white">
      <div className="flex gap-[10px] cursor-pointer" onClick={() => setOpen(prev => !prev)}>
        <div className={`w-[22px] h-[22px] flex items-center justify-center rounded-[4px] bg-[${open ? "#306BFF1A" : "#FFF"}] bg-opacity-[${open ? "0.1" : "0.03"}]`}>
          {open ? <svg width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M0 1C0 0.447715 0.447715 0 1 0H11C11.5523 0 12 0.447715 12 1C12 1.55228 11.5523 2 11 2H1C0.447715 2 0 1.55228 0 1Z" fill="#3078FF" />
          </svg> :
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M5 11C5 11.5523 5.44772 12 6 12C6.55228 12 7 11.5523 7 11V7H11C11.5523 7 12 6.55228 12 6C12 5.44772 11.5523 5 11 5H7V1C7 0.447715 6.55229 0 6 0C5.44772 0 5 0.447715 5 1V5H1C0.447715 5 0 5.44772 0 6C0 6.55228 0.447715 7 1 7H5V11Z" fill="white" fill-opacity="0.5" />
            </svg>
          }
        </div>
        <Typography
          fontWeight={600}
          fontSize={'16px'}
          lineHeight={'24px'}
          letterSpacing={'0.15px'}
          color={'white'}
        >
          {data.data_source} - {data.service}
        </Typography>
      </div>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <table className="table-auto w-full">
          <thead>
            <tr className='rounded-[7px] bg-white bg-opacity-5'>
              <th className={'py-[10px] px-[15px] whitespace-nowrap'}>
                <Typography
                  fontWeight={600}
                  fontSize={'12px'}
                  lineHeight={'14.1px'}
                  color={'white'}
                >
                  Nama Insiden
                </Typography>
              </th>
              <th className={'py-[10px] px-[15px] whitespace-nowrap'}>
                <Typography
                  fontWeight={600}
                  fontSize={'12px'}
                  lineHeight={'14.1px'}
                  color={'white'}
                >
                  Deskripsi Insiden
                </Typography>
              </th>
              <th className={'py-[10px] px-[15px] whitespace-nowrap'}>
                <Typography
                  fontWeight={600}
                  fontSize={'12px'}
                  lineHeight={'14.1px'}
                  color={'white'}
                >
                  Resolution
                </Typography>
              </th>
              <th className={'py-[10px] px-[15px] whitespace-nowrap'}>
                <Typography
                  fontWeight={600}
                  fontSize={'12px'}
                  lineHeight={'14.1px'}
                  color={'white'}
                >
                  Action
                </Typography>
              </th>
              <th className={'py-[10px] px-[15px] whitespace-nowrap'}>
                <Typography
                  fontWeight={600}
                  fontSize={'12px'}
                  lineHeight={'14.1px'}
                  color={'white'}
                >
                  Lesson Learned
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className='border-b border-opacity-[0.07] border-white'>
              <td className={'py-[10px] px-[15px]'}>
                <Typography
                  fontWeight={500}
                  fontSize={'12px'}
                  lineHeight={'14.1px'}
                  color={'white'}
                  align={data.name.length <= 0 ? 'center' : 'left'}
                >
                  {data.name.length > 0 ? data.name : "-"}
                </Typography>
              </td>
              <td className={'py-[10px] px-[15px]'}>
                <Typography
                  className={styles.typography}
                  fontWeight={500}
                  fontSize={'12px'}
                  lineHeight={'14.1px'}
                  color={'white'}
                  align={!data.description ? 'center' : 'left'}
                >
                  {parse(data.description ?? "-")}
                </Typography>
              </td>
              <td className={'py-[10px] px-[15px]'}>
                <Typography
                  fontWeight={500}
                  fontSize={'12px'}
                  lineHeight={'14.1px'}
                  color={'white'}
                  align={data.resolution.length <= 0 ? 'center' : 'left'}
                >
                  {parse(data.resolution.length > 0 ? data.resolution : "-")}
                </Typography>
              </td>
              <td className={'py-[10px] px-[15px]'}>
                <Typography
                  fontWeight={500}
                  fontSize={'12px'}
                  lineHeight={'14.1px'}
                  color={'white'}
                  align={data.action.length <= 0 ? 'center' : 'left'}
                >
                  {parse(data.action.length > 0 ? data.action : "-")}
                </Typography>
              </td>
              <td className={'py-[10px] px-[15px]'}>
                <Typography
                  fontWeight={500}
                  fontSize={'12px'}
                  lineHeight={'14.1px'}
                  color={'white'}
                  align={!data.lesson_learned ? 'center' : 'left'}
                >
                  {parse(data.lesson_learned ?? "-")}
                </Typography>
              </td>
            </tr>
          </tbody>
        </table>
      </Collapse>
    </div>
  )
}

export default CollapsibleNLP
