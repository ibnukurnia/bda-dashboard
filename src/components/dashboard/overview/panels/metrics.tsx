'use client';
import { Typography } from "@mui/material";
import { Stack } from "@mui/system";
import DropdownButton from "../dropdown-button";
import { CompaniesFilters } from "../old-component/overview-filters";
import LineChart from '@/components/dashboard/overview/line-chart';
import { useContext, useEffect, useState } from "react";
import Loading from "@/components/loading-out";
import ErrorFetchingData from "@/components/error-fetching-data";
import { MetricsOverviewResponse, Series } from "@/modules/models/overviews"; // Ensure this import matches your actual file structure
import { OverviewContext } from '@/contexts/overview-context';

export const MetricsOverviewPanel = () => {
    const { metricsOverviews, getMetricsOverview } = useContext(OverviewContext);
    const [selectedOption, setSelectedOption] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [chartData, setChartData] = useState<{ series: Series[]; categories: string[] }[]>([]);

    const handleOptionSelection = (option: string) => {
        setSelectedOption(option);
        console.log('Selected option:', option);
        getMetricsOverview();
    };

    useEffect(() => {
        if (metricsOverviews) {
            console.log(metricsOverviews);

            const newChartData = metricsOverviews.map((metric: { series: any; categories: any; }) => ({
                series: metric.series,
                categories: metric.categories,
            }));

            setChartData(newChartData);
            setIsLoading(false);
            setError(false);
        } else {
            setIsLoading(true);
            setError(true);
        }
    }, [metricsOverviews]);

    return (
        <div className='flex flex-col gap-12 col-span-2'>
            <Stack direction="row" spacing={1} justifyContent={'space-between'}>
                <DropdownButton
                    buttonText={selectedOption === '' ? 'All Products' : selectedOption}
                    options={['Option 1', 'Option 2', 'Option 3']}
                    buttonClassName="md:w-64" // Responsive width
                    onSelectOption={handleOptionSelection}
                />
                <CompaniesFilters />
            </Stack>
            {isLoading ? (
                <Loading />
            ) : error ? (
                <ErrorFetchingData />
            ) : (
                <div className='flex flex-col gap-8 w-full'>
                    {chartData.map((data, index) => (
                        <div key={index} className='chart-container' style={{ height: '380px' }}>
                            <LineChart
                                series={data.series}
                                categories={data.categories}
                                title={`Chart ${index + 1} - VM00009MOPB92 - BRIMO - mobile-banking - used_memory`}
                                lineColors={['#FF5733', '#66DA26', '#546E7A']}
                                yAxisMin={0}
                                yAxisMax={160}
                            />
                        </div>
                    ))}
                </div>

            )}
        </div>
    );
};
