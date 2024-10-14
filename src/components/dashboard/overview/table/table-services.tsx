import styles from './table-services.module.css';
import Link from 'next/link';
import { TopServiceData } from '@/modules/models/overviews';

const LABELS_TO_NAMESPACE: Record<string, string> = {
  "Log APM BRImo": 'apm',
  "Log Transaksi BRImo": 'brimo',
  "OCP": 'k8s_prometheus',
  "Database": 'k8s_db',
  "IVAT": 'ivat',
  "PANW": 'panw',
  "FORTI": 'forti',
  "WAF": 'waf',
  "PRTG": 'prtg',
  "Zabbix": 'zabbix',
};

interface TableServicesProps {
  tableHeader: string[];
  dataKeys: string[];
  data: TopServiceData[] | null | undefined;
  maxHeight?: number | string;
  selectedDataSource: string;
  queryParams?: {
    time_range?: string;
    start_time?: string;
    end_time?: string;
  };
}

const TableServices = ({ tableHeader, dataKeys, data, maxHeight, selectedDataSource, queryParams }: TableServicesProps) => {
  return (
    <div className={`relative overflow-auto min-h-48 ${styles.scrollbar}`} style={{ maxHeight }}>
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
            {data && data?.length > 0 ? (
              data.map((sdt, sdtid) => (
                <tr key={sdtid}>
                  {dataKeys.map((cdk, cdkid) => (
                    <td key={cdkid} className="py-1 px-1 td">
                      <div
                        className={`flex items-center gap-2 ${cdkid === 0 ? 'text-left' : 'text-center justify-center'}`}
                      >
                        {(cdk === 'service_name' && (sdt.fungsi != null || sdt.detail_cluster != null)) &&
                          <a
                            id={`top-service-${escapeAndRemoveSpaces(sdt.service_name)}`}
                            data-tooltip-place={'right-end'}
                          >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M6 0C2.7 0 0 2.7 0 6C0 9.3 2.7 12 6 12C9.3 12 12 9.3 12 6C12 2.7 9.3 0 6 0ZM6.6 9H5.4V5.4H6.6V9ZM6.6 4.2H5.4V3H6.6V4.2Z" fill="white" fillOpacity="0.8" />
                            </svg>
                          </a>
                        }
                        {/* Make only service_name (first column) a clickable link */}
                        {cdk === 'service_name' ? (
                          <Link
                            className='hover:text-blue-400 hover:underline'
                            href={{
                              pathname: '/dashboard/root-cause-analysis',
                              query: {
                                ...queryParams,
                                data_source: selectedDataSource?.length > 0 ? selectedDataSource : LABELS_TO_NAMESPACE[sdt?.[cdk]],
                              },
                            }}
                            passHref
                          >
                            {sdt?.[cdk]}
                          </Link>
                        ) : (
                          <span>{sdt?.[cdk as keyof Omit<TopServiceData, "detail_cluster">]}</span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data && data.length === 0 ? (
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
  );
};

export default TableServices;

function escapeAndRemoveSpaces(stringToEscape: string) {
  return stringToEscape.replace(/[\(\)\s]/g, match => {
    if (match === '(') return '';
    if (match === ')') return '';
    return ''; // remove spaces
  });
}
