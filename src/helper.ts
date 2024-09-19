import { PREDEFINED_TIME_RANGES, TAB_DATA_SOURCE } from "./constants";

export const validDataSource = (dataSource: string) => {
	return TAB_DATA_SOURCE.some(ds =>
		(ds.namespace && ds.namespace === dataSource) ||
		(ds.children && ds.children.find(child => child.namespace === dataSource)))
}

// Regular expression to match a custom time range like "YYYY-MM-DD HH:MM:SS - YYYY-MM-DD HH:MM:SS"
const customTimeRangeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} - \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
export const validTimeRange = (timeRange: string) => {
	// Check if timeRange is a key in DEFINED_TIME_RANGE
	if (Object.keys(PREDEFINED_TIME_RANGES).includes(timeRange)) {
	  return true;
	}
  
	// Check if timeRange matches the custom time range format
	return customTimeRangeRegex.test(timeRange);
}