import { PREDEFINED_TIME_RANGES, TAB_DATA_SOURCE } from "./constants";

export const validDataSource = (dataSource: string) => {
	return TAB_DATA_SOURCE.some(ds =>
		(ds.namespace && ds.namespace === dataSource) ||
		(ds.children && ds.children.find(child => child.namespace === dataSource))
	);
};

// Regular expression to match a custom time range like "YYYY-MM-DD HH:MM:SS - YYYY-MM-DD HH:MM:SS"
const customTimeRangeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} - \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
export const validTimeRange = (timeRange: string) => {
	// Check if timeRange is a key in PREDEFINED_TIME_RANGES
	if (Object.keys(PREDEFINED_TIME_RANGES).includes(timeRange)) {
		return true;
	}

	// Check if timeRange matches the custom time range format
	return customTimeRangeRegex.test(timeRange);
};

export const toFixed = (value: number, fixed: number) => {
	const regex = new RegExp(`^-?\\d+(?:\\.\\d{0,${fixed}})?`);
	const matches = value.toString().match(regex);
	return matches ? matches[0] : value;
};

export const formatNumberWithCommas = (value: number, decimals: number = 2): string => {
	// Check if the number is an integer
	if (Number.isInteger(value)) {
		// If it's an integer, format it without decimals
		return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
	}

	// Otherwise, format with decimals
	const fixedNumber = toFixed(value, decimals);

	// Split the number into integer and decimal parts
	const [integerPart, decimalPart] = fixedNumber.toString().split('.');

	// Format the integer part with periods for thousands
	const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

	// Return the combined formatted integer and decimal part
	return `${formattedInteger},${decimalPart}`;
};


export const formatRupiah = (value: number) => {
	return `Rp. ${value.toLocaleString('id-ID')}`;
};
