import { Typography } from "@mui/material"
import { Stack } from "@mui/system"
import DropdownButton from "../dropdown-button"
// import { CompaniesFilters } from "../old-component/overview-filters"
// import { ServiceOverviewResponse } from "@/modules/models/overviews"
import { useContext, useEffect, useState } from "react"
import { OverviewContext } from "@/contexts/overview-context"
import Loading from "@/components/loading-out"
import ErrorFetchingData from "@/components/error-fetching-data"

export const SeviceOverviewPanel = () => {
    const { serviceOverviews, getServiceOverview } = useContext(OverviewContext)
    const [selectedOption, setSelectedOption] = useState('');
    const [isError, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const renderCurrentCond = (status: string) => {
        let color = 'blue'
        switch (status.toLowerCase()) {
            case 'running':
                color = 'green'
                break
            case 'warning':
                color = 'yellow'
                break
            case 'crash':
                color = 'red'
                break
        }
        return <Typography variant="h6" component="h3" color={color}>{status}</Typography>
    }

    const renderSituationIds = (ids: number[]) => {
        return ids.map((id) => (
            <div key={id} className='bg-custom-blue inline-flex gap-2 items-center rounded-lg px-3'>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="10" r="10" fill="#06AED5" />
                    <g clipPath="url(#clip0_28_4938)">
                        <path d="M6.25004 10.0417C5.05837 10.0417 4.08337 11.0167 4.08337 12.2083C4.08337 13.4 5.05837 14.375 6.25004 14.375C7.44171 14.375 8.41671 13.4 8.41671 12.2083C8.41671 11.0167 7.44171 10.0417 6.25004 10.0417ZM9.50004 4.625C8.30837 4.625 7.33337 5.6 7.33337 6.79167C7.33337 7.98333 8.30837 8.95833 9.50004 8.95833C10.6917 8.95833 11.6667 7.98333 11.6667 6.79167C11.6667 5.6 10.6917 4.625 9.50004 4.625ZM12.75 10.0417C11.5584 10.0417 10.5834 11.0167 10.5834 12.2083C10.5834 13.4 11.5584 14.375 12.75 14.375C13.9417 14.375 14.9167 13.4 14.9167 12.2083C14.9167 11.0167 13.9417 10.0417 12.75 10.0417Z" fill="#FFFFF7" />
                    </g>
                    <defs>
                        <clipPath id="clip0_28_4938">
                            <rect width="13" height="13" fill="white" transform="translate(3 3)" />
                        </clipPath>
                    </defs>
                </svg>
                <Typography variant="body1" component="p" color="white" sx={{ margin: 0 }}>
                    #{id}
                </Typography>
            </div>
        ));
    };

    const handleOptionSelection = (option: string) => {
        setSelectedOption(option); // Set the selected option state
        console.log('Selected option:', option);
        getServiceOverview();
    };

    useEffect(() => {
        if (serviceOverviews.length > 0) {
            // console.log(serviceOverviews)
            setIsLoading(false);
            setError(false);
        } else {
            setIsLoading(true);
            setError(true);
        }
    }, [serviceOverviews]);

    return (
        <div className="flex flex-col gap-8 col-span-2">
            <Stack direction="row" spacing={1} justifyContent={'space-between'} >
                <DropdownButton
                    buttonText={selectedOption === '' ? 'All Products' : selectedOption}
                    options={['Option 1', 'Option 2', 'Option 3']}
                    buttonClassName="md:w-64" // Responsive width
                    onSelectOption={handleOptionSelection}
                />
                {/* <CompaniesFilters /> */}
            </Stack>
            <div className="grid grid-cols-2 gap-8">
                {isLoading ? (
                    <Loading />
                ) : isError ? (
                    <ErrorFetchingData />
                ) : (
                    serviceOverviews.map((overview, index) => (
                        <div key={index} className="bg-[#0A1635] flex flex-col gap-7 rounded-lg p-4">
                            <div className="flex items-center gap-6">
                                <Typography variant="body1" component="h3" color="white" sx={{ margin: 0 }}>
                                    {overview.service_name}
                                </Typography>
                                {renderSituationIds(overview.situation_ids)}
                            </div>
                            <div className="grid grid-cols-5 gap-2">
                                <div className="flex flex-col gap-y-2 justify-between text-center flex-grow">
                                    <Typography variant="h6" component="h3" color="white">
                                        {overview.last_impacted}
                                    </Typography>
                                    <Typography variant="body2" component="p" color="white">
                                        Impacted Duration
                                    </Typography>
                                </div>
                                <div className="flex flex-col gap-y-2 justify-between text-center flex-grow">
                                    <Typography variant="h6" component="h3" color="white">
                                        {overview.open_issues}
                                    </Typography>
                                    <Typography variant="body2" component="p" color="white">
                                        Open Issues
                                    </Typography>
                                </div>
                                <div className="flex flex-col gap-y-2 justify-between text-center flex-grow">
                                    <Typography variant="h6" component="h3" color="white">
                                        {overview.contributor}
                                    </Typography>
                                    <Typography variant="body2" component="p" color="white">
                                        Contributor
                                    </Typography>
                                </div>
                                <div className="flex flex-col gap-y-2 justify-between text-center flex-grow">
                                    <Typography variant="h6" component="h3" color="white">
                                        3
                                    </Typography>
                                    <Typography variant="body2" component="p" color="white">
                                        Alert Attempt
                                    </Typography>
                                </div>
                                <div className="flex flex-col gap-y-2 justify-between text-center flex-grow">
                                    {renderCurrentCond(overview.current_condition)}
                                    <Typography variant="body2" component="p" color="white">
                                        Current Cond.
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
