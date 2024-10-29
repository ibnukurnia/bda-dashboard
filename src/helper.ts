import { format } from 'date-fns'

import { PREDEFINED_TIME_RANGES, TAB_DATA_SOURCE } from './constants'

export const validDataSource = (dataSource: string) => {
  return TAB_DATA_SOURCE.some(
    (ds) =>
      ds.children &&
      ds.children.some(
        (child) =>
          (child.namespace && child.namespace === dataSource) || // First-level child
          (child.children && child.children.some((subChild) => subChild.namespace === dataSource)) // Second-level child
      )
  )
}

// Regular expression to match a custom time range like "YYYY-MM-DD HH:MM:SS - YYYY-MM-DD HH:MM:SS"
const customTimeRangeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} - \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/
export const validTimeRange = (timeRange: string) => {
  // Check if timeRange is a key in PREDEFINED_TIME_RANGES
  if (Object.keys(PREDEFINED_TIME_RANGES).includes(timeRange)) {
    return true
  }

  // Check if timeRange matches the custom time range format
  return customTimeRangeRegex.test(timeRange)
}

export const formatWithDotsAndComma = (number: number) => {
  // Separate the integer and decimal parts
  let [integerPart, decimalPart] = number.toString().split('.')

  // Add dots as thousand separators to the integer part
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

  // Rejoin with a comma as the decimal separator, if there is a decimal part
  return decimalPart ? `${integerPart},${decimalPart}` : integerPart
}

export const toFixed = (value: number, fixed: number) => {
  const regex = new RegExp(`^-?\\d+(?:\\.\\d{0,${fixed}})?`)
  const matches = value.toString().match(regex)
  return matches ? matches[0] : value
}

export const formatNumberWithCommas = (value: number, decimals: number = 2): string => {
  // Check if the number is an integer
  if (Number.isInteger(value)) {
    // If it's an integer, format it without decimals
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  // Otherwise, format with decimals
  const fixedNumber = toFixed(value, decimals)

  // Split the number into integer and decimal parts
  const [integerPart, decimalPart] = fixedNumber.toString().split('.')

  // Format the integer part with periods for thousands
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

  // Return the combined formatted integer and decimal part
  return `${formattedInteger},${decimalPart}`
}

export const formatRupiah = (value: number) => {
  return `Rp. ${value.toLocaleString('id-ID')}`
}

const toMiliseconds = 1000 * 60
const defaultTimeRanges: Record<string, number> = {
  'Last 5 minutes': 5,
  'Last 10 minutes': 10,
  'Last 15 minutes': 15,
  'Last 30 minutes': 30,
  'Last 1 hours': 60,
  'Last 3 hours': 180,
}
export const handleStartEnd = (time: string) => {
  const timeSplit = time.split(' - ')

  let startTime: string | Date
  let endTime: string | Date

  if (timeSplit.length > 1) {
    startTime = timeSplit?.[0]
    endTime = timeSplit?.[1]
  } else {
    startTime = format(new Date(new Date().getTime() - toMiliseconds * defaultTimeRanges[time]), 'yyyy-MM-dd HH:mm:ss')
    endTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
  }

  return { startTime, endTime }
}
