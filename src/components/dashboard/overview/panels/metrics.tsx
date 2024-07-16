import { Typography } from "@mui/material"
import { Stack } from "@mui/system"
import DropdownButton from "../dropdown-button"
import { CompaniesFilters } from "../old-component/overview-filters"
import { MetricsOverviewResponse } from "@/modules/models/overviews"
import LineChart from '@/components/dashboard/overview/line-chart';

export const MetricsOverviewPanel = ({ metricsOverviews }: { metricsOverviews: MetricsOverviewResponse[] }) => {

    const series = [
        {
            name: 'VM00009MOPB92 - BRIMO - mobile-banking - used_memory',
            data: [10, 41, 35, 51, 49, 62, 69],
        },
    ];
    const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];


    return (
        <div className='flex flex-col gap-12 col-span-2'>
            <Stack direction="row" spacing={1} justifyContent={'space-between'} >
                <DropdownButton
                    buttonText="All Products"
                    options={['Option 1', 'Option 2', 'Option 3']}
                    buttonClassName="md:w-64" // Responsive width
                />
                <CompaniesFilters />
            </Stack>
            <div className='flex flex-col gap-8 w-full'>
                <div className='chart-container' style={{ height: '380px' }}>
                    <LineChart
                        series={series}
                        categories={categories}
                        title="VM00009MOPB92 - BRIMO - mobile-banking - used_memory"
                        lineColor="#FE981c"
                        yAxisMin={0}
                        yAxisMax={160}
                    />
                </div>
                <div className='chart-container' style={{ height: '380px' }}>
                    <LineChart
                        series={series}
                        categories={categories}
                        title="VM00009MOPB92 - BRIMO - mobile-banking - used_memory"
                        lineColor="#FE981c"
                        yAxisMin={0}
                        yAxisMax={160}
                    />
                </div>
            </div>
        </div>
    )
}