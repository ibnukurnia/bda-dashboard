'use client'

import React, { useMemo } from 'react'
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Table from '@/components/Tables/Table';
import { AnomalyPrediction } from '@/types/anomaly-prediction';
import { ColumnDef } from '@tanstack/react-table';
import { Box, FormControl, Grid, Input, InputLabel, MenuItem, Select, Typography } from '@mui/material';

const dummyData: Array<AnomalyPrediction> = [
    {
        id: 1190,
        impacted_date: '11/01/2024 15:04:22 PM',
        severity: 'Minor',
        service: 'bridgtl-rsm-notifications',
        description: 'A clash occurred while attempting to save n..',
        total_alerts: 7
    },
    {
        id: 1191,
        impacted_date: '11/01/2024 14:24:01 P.M',
        severity: 'Mayor',
        service: 'bridgtl-rsm-notifications',
        description: 'A clash occurred while attempting to save n..',
        total_alerts: 40
    },
    {
        id: 1192,
        impacted_date: '11/01/2024 14:14:12 P.M',
        severity: 'Critical',
        service: 'bridgtl-rsm-notifications',
        description: 'A clash occurred while attempting to save n..',
        total_alerts: 110
    },
    {
        id: 1193,
        impacted_date: '11/01/2024 13:54:02 P.M',
        severity: 'Minor',
        service: 'bridgtl-rsm-notifications',
        description: 'A clash occurred while attempting to save n..',
        total_alerts: 1
    },
]

const dummyServices: Array<{id: number,service:string}> = [
    {
        id: 1,
        service: 'Service 1'
    },
    {
        id: 2,
        service: 'Service 2'
    },
    {
        id: 3,
        service: 'Service 3'
    },
    {
        id: 4,
        service: 'Service 4'
    }
]

const AnomalyPrediction = () => {
    const cols = useMemo<ColumnDef<AnomalyPrediction>[]>(() => [
        {
            header: 'ID',
            cell: (row) => '#'+row.renderValue(),
            accessorKey: 'id'
        },
        {
            header: 'Impected Date',
            cell: (row) => row.renderValue(),
            accessorKey: 'impacted_date'
        },
        {
            header: 'Severity',
            cell: (row) => row.renderValue(),
            accessorKey: 'severity'
        },
        {
            header: 'Service',
            cell: (row) => row.renderValue(),
            accessorKey: 'service'
        },
        {
            header: 'Description',
            cell: (row) => row.renderValue(),
            accessorKey: 'description'
        },
        {
            header: 'Total Alerts',
            cell: (row) => row.renderValue(),
            accessorKey: 'total_alerts'
        }
    ],[])

    return (
        <DefaultLayout>
            <Box>
                {/* <Typography variant='h5'>Historical Anomaly Records</Typography> */}
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <FormControl variant='standard' sx={{ m:1, width:300 }}>
                            <InputLabel>Service</InputLabel>
                            <Select>
                                {dummyServices.map(service => (
                                    <MenuItem value={service.id} key={service.id}>{service.service}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        {/* <FormControl variant='standard' sx={{ m:1, width:300 }}> */}
                            {/* <DatePicker label={'Start Date'}></DatePicker> */}
                        {/* </FormControl> */}
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl variant='standard' sx={{ m:1, width:300 }}>
                            <InputLabel>Service</InputLabel>
                            <Select>
                                {dummyServices.map(service => (
                                    <MenuItem value={service.id} key={service.id}>{service.service}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Table data={dummyData} columns={cols} />
            </Box>
        </DefaultLayout>
    )
}

export default AnomalyPrediction