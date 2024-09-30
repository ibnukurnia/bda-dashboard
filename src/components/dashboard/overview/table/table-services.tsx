import { Check, Minus, Plus } from 'react-feather'

import './table-services.css'
import Link from 'next/link'

const LABELS_TO_NAMESPACE: Record<string, string> = {
  "Log APM Brimo": 'apm',
  "Log Transaksi Brimo": 'brimo',
  "OCP": 'k8s_prometheus',
  "Database": 'k8s_db',
  "IVAT": 'ivat',
  "PANW": 'panw',
  "FORTI": 'forti',
  "WAF": 'waf',
  "PRTG": 'prtg',
  "Zabbix": 'zabbix',
}

interface TableServicesProps {
  tableHeader: string[]
  dataKeys: string[]
  data: any[]
  maxHeight?: number | string
  selectedDataSource: string
  queryParams?: {
    time_range?: string
  }
}

const TableServices = ({ tableHeader, dataKeys, data, maxHeight, selectedDataSource, queryParams }: TableServicesProps) => {

  return (
    <div className="relative overflow-auto min-h-48 scrollbar" style={{ maxHeight }}>
      <div>
        <table className="w-full text-white">
          <thead>
            <tr>
              {tableHeader?.map((ths, thsid) => (
                <th key={thsid} className={`${thsid === 0 ? 'text-left' : ''} py-2 px-1 sticky top-0 th`}>
                  {ths}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((sdt: any, sdtid) => (
                <tr key={sdtid}>
                  {dataKeys.map((cdk, cdkid) => (
                    <td key={cdkid} className="py-1 px-1 td">
                      <div
                        className={`flex items-center gap-2 hover:text-blue-400 hover:underline cursor-pointer ${cdkid === 0 ? 'text-left' : 'text-center justify-center'}  color-${(() => {
                          if (cdk === 'health_score') {
                            if (sdt?.[cdk] < 50) {
                              return 'red'
                            } else {
                              return 'green'
                            }
                          }
                        })()}`}
                      >
                        {cdk === 'name' && (
                          <span
                            className={`rounded-full ${sdt?.['health_score'] < 50 ? 'bg-red-600' : 'bg-green-600'} w-5 h-5 flex justify-center items-center`}
                          >
                            {sdt?.health_score < 50 ? <Minus size={'16px'} /> : <Check size={'16px'} />}
                          </span>
                        )}
                        {cdkid === 0 ?
                          <Link
                            href={{
                              pathname: '/dashboard/root-cause-analysis',
                              query: {
                                ...queryParams,
                                data_source: selectedDataSource?.length > 0 ? selectedDataSource : LABELS_TO_NAMESPACE[sdt?.[cdk]],
                              }
                            }}
                            passHref
                            rel={sdt.count > 0 ? "noopener noreferrer" : undefined}
                          >
                            {sdt?.[cdk]}
                          </Link>
                          : <span>
                            {sdt?.[cdk]}
                          </span>
                        }
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td className="py-1 px-1 td">
                  <div className={`flex items-center gap-2 'text-left' font-regular`}>
                    <div className="flex items-center gap-2 cursor-pointer">
                      <span>No anomalies</span>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              <tr>
                <td className="py-1 px-1 td">
                  <div className={`flex items-center gap-2 'text-left' font-regular`}>
                    <div className="flex items-center gap-2 cursor-pointer">
                      <span>Data unavailable</span>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TableServices
