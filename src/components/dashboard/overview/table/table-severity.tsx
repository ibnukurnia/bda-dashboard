interface TableSeverityProps {
  tableHeader: string[]
  data: { count: number; severity: string; color: string }[]
  onClickSeverity?: (severity: string) => void
}

const TableSeverity = ({ tableHeader, data, onClickSeverity }: TableSeverityProps) => {
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
                <span className="cursor-pointer" onClick={() => onClickSeverity && onClickSeverity(sdt.severity)}>
                  {sdt.severity}
                </span>
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
