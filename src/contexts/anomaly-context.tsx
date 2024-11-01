'use client'

import React, { createContext, useEffect, useState, ReactNode, Dispatch, SetStateAction } from "react"
import { handleError } from "@/lib/error-handler"
import {
    CheckboxOptionResponse,
    Column,
    HistoricalAnomalyLogApmResponse,
    HistoricalAnomalyLogBrimoResponse,
    HistoricalAnomalyNetworkResponse,
    HistoricalAnomalySecurityResponse,
    HistoricalAnomalyUtilizationResponse
} from "@/modules/models/anomaly-predictions"
import {
    GetHistoricalLogApmAnomalies,
    GetHistoricalLogBrimoAnomalies,
    GetHistoricalUtilizationAnomalies,
    GetHistoricalNetworkAnomalies,
    GetHistoricalSecurityAnomalies,
    GetFetchCheckboxes
} from "@/modules/usecases/anomaly-predictions"

// Define the context interface
interface AnomalyContextProps {
    load: boolean
    setLoad: Dispatch<SetStateAction<boolean>>
    apmAnomalies: HistoricalAnomalyLogApmResponse[] | null
    brimoAnomalies: HistoricalAnomalyLogBrimoResponse[] | null
    utilizationAnomalies: HistoricalAnomalyUtilizationResponse[] | null
    networkAnomalies: HistoricalAnomalyNetworkResponse[] | null
    securityAnomalies: HistoricalAnomalySecurityResponse[] | null
    checkBoxesOption: Column[] | null
    getHistoricalAnomalyLogApm: () => Promise<void>
    getHistoricalAnomalyLogBrimo: () => Promise<void>
    getHistoricalAnomalyUtilization: () => Promise<void>
    getHistoricalAnomalyNetwork: () => Promise<void>
    getHistoricalAnomalySecurity: () => Promise<void>
    GetFetchCheckboxes: () => Promise<void>
}

// Initialize default values for the context
const defaultValue: AnomalyContextProps = {
    load: false,
    setLoad: () => true,
    apmAnomalies: null,
    brimoAnomalies: null,
    utilizationAnomalies: null,
    networkAnomalies: null,
    securityAnomalies: null,
    checkBoxesOption: [],
    getHistoricalAnomalyLogApm: async () => { },
    getHistoricalAnomalyLogBrimo: async () => { },
    getHistoricalAnomalyUtilization: async () => { },
    getHistoricalAnomalyNetwork: async () => { },
    getHistoricalAnomalySecurity: async () => { },
    GetFetchCheckboxes: async () => { }
}

const AnomalyContext = createContext<AnomalyContextProps>(defaultValue)

const AnomalyProvider = ({ children }: { children: ReactNode }) => {
    const [apmAnomalies, setApmAnomalies] = useState<HistoricalAnomalyLogApmResponse[] | null>(null)
    const [brimoAnomalies, setBrimoAnomalies] = useState<HistoricalAnomalyLogBrimoResponse[] | null>(null)
    const [utilizationAnomalies, setUtilizationAnomalies] = useState<HistoricalAnomalyUtilizationResponse[] | null>(null)
    const [networkAnomalies, setNetworkAnomalies] = useState<HistoricalAnomalyNetworkResponse[] | null>(null)
    const [securityAnomalies, setSecurityAnomalies] = useState<HistoricalAnomalySecurityResponse[] | null>(null)
    const [filterColumn, setFilterColumn] = useState<Column[] | null>(null)
    const [load, setLoad] = useState<boolean>(false)

    // Fetch APM anomalies
    const getHistoricalAnomalyLogApm = async () => {
        try {
            const response = await GetHistoricalLogApmAnomalies();
            if (response.data && response.data.rows) {
                setApmAnomalies(response.data.rows);  // Use response.data.rows
            } else {
                console.warn('No rows data returned for APM anomalies');
            }
        } catch (error) {
            handleError(error);
        }
    }

    // Fetch Brimo anomalies
    const getHistoricalAnomalyLogBrimo = async () => {
        try {
            const response = await GetHistoricalLogBrimoAnomalies();
            if (response.data && response.data.rows) {
                setBrimoAnomalies(response.data.rows);  // Use response.data.rows
            } else {
                console.warn('No rows data returned for Brimo anomalies');
            }
        } catch (error) {
            handleError(error);
        }
    }

    // Fetch Utilization anomalies
    const getHistoricalAnomalyUtilization = async () => {
        try {
            const response = await GetHistoricalUtilizationAnomalies();
            if (response.data && response.data.rows) {
                setUtilizationAnomalies(response.data.rows);  // Use response.data.rows
            } else {
                console.warn('No rows data returned for Utilization anomalies');
            }
        } catch (error) {
            handleError(error);
        }
    }

    // Fetch Network anomalies
    const getHistoricalAnomalyNetwork = async () => {
        try {
            const response = await GetHistoricalNetworkAnomalies();
            if (response.data && response.data.rows) {
                setNetworkAnomalies(response.data.rows);  // Use response.data.rows
            } else {
                console.warn('No rows data returned for Network anomalies');
            }
        } catch (error) {
            handleError(error);
        }
    }

    // Fetch Security anomalies
    const getHistoricalAnomalySecurity = async () => {
        try {
            const response = await GetHistoricalSecurityAnomalies();
            if (response.data && response.data.rows) {
                setSecurityAnomalies(response.data.rows);  // Use response.data.rows
            } else {
                console.warn('No rows data returned for Security anomalies');
            }
        } catch (error) {
            handleError(error);
        }
    }

    const getFilterColumn = async () => {
        try {
            const response = await GetFetchCheckboxes();
            if (response.data && response.data.columns) {
                setFilterColumn(response.data.columns);  // Use response.data.rows
            } else {
                console.warn('No rows data returned for Security anomalies');
            }
        } catch (error) {
            handleError(error);
        }
    }



    // Trigger initial data fetch
    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([
                getHistoricalAnomalyLogApm(),
                getHistoricalAnomalyLogBrimo(),
                getHistoricalAnomalyUtilization(),
                getHistoricalAnomalyNetwork(),
                getHistoricalAnomalySecurity(),
                GetFetchCheckboxes()
            ])
            setLoad(false)
        }

        fetchData().catch(handleError)

        // console.log(filterColumn);

    }, [])

    return (
        <AnomalyContext.Provider value={{
            load,
            setLoad,
            apmAnomalies,
            brimoAnomalies,
            utilizationAnomalies,
            networkAnomalies,
            securityAnomalies,
            checkBoxesOption: filterColumn,
            getHistoricalAnomalyLogApm,
            getHistoricalAnomalyLogBrimo,
            getHistoricalAnomalyUtilization,
            getHistoricalAnomalyNetwork,
            getHistoricalAnomalySecurity,
            GetFetchCheckboxes: getFilterColumn
        }}>
            {children}
        </AnomalyContext.Provider>
    )
}

export {
    AnomalyContext,
    AnomalyProvider,
}
