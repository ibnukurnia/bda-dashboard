import { Typography } from '@mui/material';
import './table.css'

interface TableNLPProps {
  data: {
    resolution: string;
    action: string;
    name: string
  }
}

const TableNLP = ({
  data,
}: TableNLPProps) => {

  return (
    <div className="rounded-lg p-6 w-full flex flex-col gap-3 card-style">
      <div className={`w-full`}>
        <Typography
          fontWeight={700}
          fontSize={'18px'}
          color={'white'}
        >
          Related Incident
        </Typography>
        <div className="min-w-full">
          <table className="table-auto divide-y divide-gray-200 w-full">
            <tbody className="divide-y divide-gray-200 text-gray-600">
              <tr>
                <td className="w-32 px-1 py-4">
                  <div className="text-gray-100 px-3 py-1 gap-x-2">
                    Nama Insiden
                  </div>
                </td>
                <td className="px-1 py-4">
                  <div className="text-gray-100 px-3 py-1 gap-x-2">
                    {data.name.length > 0 ? data.name : "-"}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="w-32 px-1 py-4">
                  <div className="text-gray-100 px-3 py-1 gap-x-2">
                    Resolution
                  </div>
                </td>
                <td className="px-1 py-4">
                  <div className="text-gray-100 px-3 py-1 gap-x-2">
                    {data.resolution.length > 0 ? data.resolution : "-"}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="w-32 px-1 py-4">
                  <div className="text-gray-100 px-3 py-1 gap-x-2">
                    Action
                  </div>
                </td>
                <td className="px-1 py-4">
                  <div className="text-gray-100 px-3 py-1 gap-x-2">
                    {data.action.length > 0 ? data.action : "-"}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default TableNLP
