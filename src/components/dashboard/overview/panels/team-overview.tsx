import { TeamOverviewResponse } from "@/modules/models/overviews";
import DropdownButton from "../dropdown-button";
import DatePickerComponent from "../date-picker";
import { Box, Stack, Typography } from "@mui/material"
import { useState } from "react";
import ImageGrid from "../image-grid";

export const TeamOverviewPanel = ({ teamOverview }: { teamOverview: TeamOverviewResponse }) => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    // Handler functions for date changes
    const handleStartDateChange = (date: Date | null) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date: Date | null) => {
        setEndDate(date);
    };

    return (
        <div className='flex flex-row gap-4'>
            <div className='flex flex-col gap-6 col-span-2'>
                <Stack direction="row" spacing={1}>
                    <DropdownButton
                        buttonText="All Services"
                        options={['Option 1', 'Option 2', 'Option 3']}
                        buttonClassName="md:w-64" // Responsive width
                    />
                    <DatePickerComponent
                        selectedDate={startDate || new Date()} // Provide a default date if startDate is null
                        onChange={handleStartDateChange}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                    />
                    <DatePickerComponent
                        selectedDate={endDate || new Date()} // Provide a default date if endDate is null
                        onChange={handleEndDateChange}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate} // Ensure endDate cannot be before startDate
                    />
                </Stack>
                <Stack sx={{ display: 'flex', gap: 6, flexDirection: 'row', px: 2 }}>
                    <Stack sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <div className='inline-flex align-center gap-1'>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_399_120)">
                                    <path d="M8.79 9.24V5.5C8.79 4.12 9.91 3 11.29 3C12.67 3 13.79 4.12 13.79 5.5V9.24C15 8.43 15.79 7.06 15.79 5.5C15.79 3.01 13.78 1 11.29 1C8.8 1 6.79 3.01 6.79 5.5C6.79 7.06 7.58 8.43 8.79 9.24ZM14.29 11.71C14.01 11.57 13.71 11.5 13.4 11.5H12.79V5.5C12.79 4.67 12.12 4 11.29 4C10.46 4 9.79 4.67 9.79 5.5V16.24L6.35 15.52C5.98 15.44 5.59 15.56 5.32 15.83C4.89 16.27 4.89 16.97 5.32 17.41L9.33 21.42C9.71 21.79 10.22 22 10.75 22H16.85C17.85 22 18.69 21.27 18.83 20.28L19.46 15.81C19.58 14.96 19.14 14.12 18.37 13.74L14.29 11.71Z" fill="#FFFFF7" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_399_120">
                                        <rect width="24" height="24" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <Typography variant="body1" component="p" color="white" sx={{ margin: 0 }}>
                                Total Situation Solved
                            </Typography>
                        </div>
                        <Typography variant="body2" component="p" color="white" sx={{ margin: 0, fontSize: '42px' }}>
                            {teamOverview.solved}<span style={{ fontSize: '16px', marginLeft: '5px' }}>situation</span>
                        </Typography>
                    </Stack>
                    <Stack sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <div className='inline-flex align-center gap-1'>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.47 21.0001H19.53C21.07 21.0001 22.03 19.3301 21.26 18.0001L13.73 4.99005C12.96 3.66005 11.04 3.66005 10.27 4.99005L2.74 18.0001C1.97 19.3301 2.93 21.0001 4.47 21.0001ZM12 14.0001C11.45 14.0001 11 13.5501 11 13.0001V11.0001C11 10.4501 11.45 10.0001 12 10.0001C12.55 10.0001 13 10.4501 13 11.0001V13.0001C13 13.5501 12.55 14.0001 12 14.0001ZM13 18.0001H11V16.0001H13V18.0001Z" fill="#FFFFF7" />
                            </svg>
                            <Typography variant="body1" component="p" color="white" sx={{ margin: 0 }}>
                                Current In Progress Situation
                            </Typography>
                        </div>
                        <Typography variant="body2" component="p" color="white" sx={{ margin: 0, fontSize: '42px' }}>
                            {teamOverview.on_progress}<span style={{ fontSize: '16px', marginLeft: '5px' }}>situation</span>
                        </Typography>
                    </Stack>
                    <Stack sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <div className='inline-flex align-center gap-1'>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.47 21.0001H19.53C21.07 21.0001 22.03 19.3301 21.26 18.0001L13.73 4.99005C12.96 3.66005 11.04 3.66005 10.27 4.99005L2.74 18.0001C1.97 19.3301 2.93 21.0001 4.47 21.0001ZM12 14.0001C11.45 14.0001 11 13.5501 11 13.0001V11.0001C11 10.4501 11.45 10.0001 12 10.0001C12.55 10.0001 13 10.4501 13 11.0001V13.0001C13 13.5501 12.55 14.0001 12 14.0001ZM13 18.0001H11V16.0001H13V18.0001Z" fill="#FFFFF7" />
                            </svg>
                            <Typography variant="body1" component="p" color="white" sx={{ margin: 0 }}>
                                Total Team Member
                            </Typography>
                        </div>
                        <Typography variant="body2" component="p" color="white" sx={{ margin: 0, fontSize: '42px' }}>
                            {teamOverview.team_member}<span style={{ fontSize: '16px', marginLeft: '5px' }}>Member</span>
                        </Typography>
                    </Stack>

                </Stack>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Typography variant="h5" component="h5" color="white" sx={{ margin: 0 }}>
                        On Going Situation
                    </Typography>
                    <div className='grid grid-cols-2 gap-4'>
                        {teamOverview.overviews.map((overview, index) => {
                            return (
                                <div className="bg-[#0A1635] flex flex-col gap-5 rounded-lg p-4" key={index}>
                                    <div className="flex items-center gap-6">
                                        <div className='bg-custom-blue inline-flex gap-2 items-center rounded-lg px-3'>
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
                                                #{overview.id}
                                            </Typography>
                                        </div>
                                        <Typography variant="body1" component="h3" color="white" sx={{ margin: 0 }}>
                                            {overview.service_name}
                                        </Typography>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2">
                                        <div className='flex flex-col gap-y-2 items-center text-center'>
                                            <Typography variant="h6" component="h3" color="white" >
                                                {overview.impacted_duration}
                                            </Typography>
                                            <Typography variant="body2" component="p" color="white" >
                                                Impacted Duration
                                            </Typography>
                                        </div>
                                        <div className='flex flex-col gap-y-2 items-center text-center'>
                                            <Typography variant="h6" component="h3" color="white" >
                                                {overview.open_issues}
                                            </Typography>
                                            <Typography variant="body2" component="p" color="white" >
                                                Open Issues
                                            </Typography>
                                        </div>
                                        <div className='flex flex-col gap-y-2 items-center text-center'>
                                            <Typography variant="h6" component="h3" color="white" >
                                                {overview.contributor}
                                            </Typography>
                                            <Typography variant="body2" component="p" color="white" >
                                                Contributor
                                            </Typography>
                                        </div>
                                        <div className='flex flex-col gap-y-2 items-center text-center'>
                                            <Typography variant="h6" component="h3" color="white" >
                                                {overview.alert_attempt}
                                            </Typography>
                                            <Typography variant="body2" component="p" color="white" >
                                                Alert Attempt
                                            </Typography>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </Box>
            </div>
            <div className='flex flex-col gap-6 col-span-1 px-3 py-4' style={{ border: '1px solid #004889', borderRadius: 18 }}>
                <Typography variant="h5" component="h5" color="white">
                    Your Current Project
                </Typography>
                <ImageGrid />
            </div>
        </div>
    )

}