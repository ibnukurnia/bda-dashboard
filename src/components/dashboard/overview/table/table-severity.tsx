import { SEVERITY_LABELS } from "@/constants";
import Link from "next/link";

interface TableSeverityProps {
  tableHeader: string[]
  data: { count: number; severity: string; color: string }[]
  onClickSeverity?: (severity: string) => void
  clickable: boolean
  queryParams?: {
    time_range?: string
    data_source?: string
  }
}

const TableSeverity = ({ tableHeader, data, queryParams, clickable }: TableSeverityProps) => {
  return (
    <div>
      <table className="w-full text-white">
        <thead>
          <tr>
            {tableHeader.map((ths, thsid) => (
              <th key={thsid} className={`${thsid === 0 ? 'text-left' : ''} py-2 px-1`}>
                {ths}
              </th>
            ))}
          </tr>

        </thead>
        <tbody>
          {data.map((sdt, sdtid) => (
            <tr key={sdtid}>
              <td className="flex items-center gap-2 p-1">
                <span
                  className={`w-4 h-4 ${sdt.severity.toLowerCase() === 'critical' ? 'bg-red-600' : sdt.severity.toLowerCase() === 'major' ? 'bg-orange-600' : 'bg-yellow-400'}`}
                />
                <Link
                  href={{
                    pathname: '/dashboard/anomaly-detection',
                    query: {
                      ...queryParams,
                      severity: sdt.severity
                    }
                  }}
                  passHref
                  rel={clickable && sdt.count > 0 ? "noopener noreferrer" : undefined}
                  className={`${clickable && sdt.count > 0 ? '' : 'cursor-not-allowed pointer-events-none'}`}
                >
                  {SEVERITY_LABELS[sdt.severity]}
                </Link>
              </td>
              <td className="text-center">{sdt.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TableSeverity
