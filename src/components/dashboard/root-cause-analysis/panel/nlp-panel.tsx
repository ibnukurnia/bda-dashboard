import { OutlinedInput, Typography } from '@mui/material';
import { NLP } from '@/modules/models/root-cause-analysis';
import CollapsibleNLP from '../collapsible/collapsible-nlp';
import MagnifyingGlassIcon from '@/components/system/Icon/MagnifyingGlassIcon';
import EmptyIcon from '@/components/system/Icon/EmptyIcon';
import { ChangeEvent, useEffect, useState } from 'react';
import { GetRootCauseAnalysisSearchIncident } from '@/modules/usecases/root-cause-analysis';

interface NLPPanelProps {
  nlpData: { data_source: string; service: string; nlps: NLP[] } | null;
}

const NLPPanel = ({
  nlpData,
}: NLPPanelProps) => {
  const [searchValue, setSearchValue] = useState("")
  const [data, setData] = useState<{
    nlpList: NLP[] | null;
    fromTree: boolean;
  }>({
    nlpList: null,
    fromTree: true,
  })
  const [tempTitle, setTempTitle] = useState<string>("")

  useEffect(() => {
    setData({
      nlpList: nlpData?.nlps ?? [],
      fromTree: true,
    })
    setSearchValue("")
  }, [nlpData])

  const handleSearch = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setSearchValue(e.currentTarget.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission or other default actions
      GetRootCauseAnalysisSearchIncident({ search: searchValue })
        .then(res => {
          setData({
            nlpList: res.data?.map(d => ({
              action: d.action_item,
              description: d.deskripsi_insiden,
              lesson_learned: d.lesson_learned,
              name: d.nama_insiden,
              resolution: d.resolusi_root_cause,
            })) ?? [],
            fromTree: false,
          })
          setTempTitle(searchValue)
        })
    }
  }

  return (
    <div className="rounded-lg p-6 w-full flex flex-col gap-[15px] card-style">
      <div className='flex justify-between'>
        <Typography fontWeight={700} fontSize={'18px'} color={'white'}>
          Related Incident
        </Typography>
        <OutlinedInput
          value={searchValue}
          placeholder="Search related incident..."
          type="text"
          sx={{
            height: "38px",
            width: "433px",
            color: "white",
            backgroundColor: "hsla(0, 0%, 100%, 0.05) !important",
            "&.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderColor: "hsla(0, 0%, 100%, 0.06)",
            },
            fontSize: "14px",
            fontWeight: 600,
            lineHeight: "16.45px",
          }}
          startAdornment={
            <MagnifyingGlassIcon className="mr-2" />
          }
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
        />
      </div>
      {data.nlpList?.length === 0 &&
        <div className='flex flex-col gap-4 justify-center items-center'>
          <EmptyIcon />
          <Typography fontWeight={600} fontSize={'14px'} color={'hsla(0, 0%, 100%, 0.5)'}>
            Oops! We couldn't find any related incidents. Please try a manual search to explore more details
          </Typography>
        </div>
      }
      {data.nlpList && data.nlpList.map((nlp, idx) => (
        <CollapsibleNLP
          key={`${nlp.name}-${nlp.action}-${nlp.description}-${nlp.lesson_learned}-${nlp.resolution}`}
          title={nlp.name}
          data={nlp}
          badge={idx === 0 ? "most_related" : "additional"}
          isOpen={idx === 0}
          showBadge={data.fromTree}
        />
      ))}
    </div>
  );
};

export default NLPPanel;
