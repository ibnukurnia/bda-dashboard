import { PRTG_DATASOURCE_PREFIX, PRTG_TRAFFIC_METRIC_SUBSTRING, SOLARWINDS_DATASOURCE_PREFIX, SOLARWINDS_TRAFFIC_METRIC_SUBSTRING, TRAFFIC_SUFFIX } from "./constant/constant";

export const getTimeDifference = (date?: Date) => {
  if (!date) return ''
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `Refreshed 2 sec ago`
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `Refreshed ${minutes} min${minutes > 1 ? 's' : ''} ago`
  } else {
    const hours = Math.floor(diffInSeconds / 3600);
    return `Refreshed ${hours} hour${hours > 1 ? 's' : ''} ago`
  }
};

export const getUniqueCaseDatasourceNamespace = (datasource: string, metric: string) => {
  if (datasource.includes(PRTG_DATASOURCE_PREFIX) && metric.includes(PRTG_TRAFFIC_METRIC_SUBSTRING)) {
    return datasource.replace(PRTG_DATASOURCE_PREFIX, `${PRTG_DATASOURCE_PREFIX}_${TRAFFIC_SUFFIX}`)
  }
  
  if (datasource.includes(SOLARWINDS_DATASOURCE_PREFIX) && metric.includes(SOLARWINDS_TRAFFIC_METRIC_SUBSTRING)) {
    return datasource.replace(SOLARWINDS_DATASOURCE_PREFIX, `${SOLARWINDS_DATASOURCE_PREFIX}_${TRAFFIC_SUFFIX}`)
  }

  return datasource
}