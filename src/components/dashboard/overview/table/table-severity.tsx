import { SEVERITY_LABELS } from "@/constants";
import Link from "next/link";

interface TableSeverityProps {
  tableHeader: string[];
  data: { count: number; severity: string; color: string }[];
  clickable: boolean;
  queryParams?: {
    time_range?: string;
    data_source?: string;
  };
}

const TableSeverity = ({ tableHeader, data, queryParams, clickable }: TableSeverityProps) => {
  // Map severity to numbers
  const severityMapping: { [key: string]: number } = {
    very_high: 1,
    high: 2,
    medium: 3,
  };

  // Sort the data based on severityMapping
  const sortedData = [...data].sort(
    (a, b) => severityMapping[a.severity] - severityMapping[b.severity]
  );


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
          {sortedData.map((sdt, sdtid) => (
            <tr key={sdtid}>
              <td className="flex items-center gap-2 p-1">
                <span
                  className={`w-4 h-4 ${sdt.severity.toLowerCase() === 'very_high'
                    ? 'bg-red-600'
                    : sdt.severity.toLowerCase() === 'high'
                      ? 'bg-orange-600'
                      : 'bg-yellow-400'
                    }`}
                />
                <Link
                  className={`${clickable ? 'hover:text-blue-400 hover:underline cursor-pointer' : 'cursor-not-allowed pointer-events-none'}`}
                  href={{
                    pathname: '/dashboard/anomaly-detection',
                    query: {
                      ...queryParams, // Spread query params (like time_range, data_source)
                      severity: severityMapping[sdt.severity], // Map severity to number
                    },
                  }}
                  passHref
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
  );
};

export default TableSeverity;
