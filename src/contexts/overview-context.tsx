'use client'

import { handleError } from "@/lib/error-handler"
import { InsightOverviewResponse, MetricsOverviewResponse, ServiceOverviewResponse, TeamOverviewResponse } from "@/modules/models/overviews"
import { GetCurrentSituation, GetServiceOverview, GetTeamOverview } from "@/modules/usecases/overviews"
import { createContext, useEffect, useState, ReactNode, Dispatch, SetStateAction } from "react"

interface OverviewContextProps {
    insightOverview: InsightOverviewResponse
    teamOverview: TeamOverviewResponse
    serviceOverviews: ServiceOverviewResponse[]
    metricsOverviews: MetricsOverviewResponse[]
    setLoad: Dispatch<SetStateAction<boolean>>
    getInsightOverview: () => Promise<void> // Add this line
    getServiceOverview: () => Promise<void>
    getTeamOverview: () => Promise<void>
}

const defaultValue: OverviewContextProps = {
    insightOverview: {
        event_triggered: 0,
        total_alerts: 0,
        on_going_situation: 0,
        avg_time_solved: 0,
        current_situations: []
    },
    teamOverview: {
        solved: 0,
        on_progress: 0,
        team_member: 0,
        overviews: []
    },
    serviceOverviews: [],
    metricsOverviews: [],
    setLoad: () => true,
    getInsightOverview: async () => { }, // Add this line
    getServiceOverview: async () => { },
    getTeamOverview: async () => { },
}

const OverviewContext = createContext<OverviewContextProps>(defaultValue)

const OverviewProvider = ({ children }: { children: ReactNode }) => {
    const [overview, setOverview] = useState<OverviewContextProps>(defaultValue)
    const [load, setLoad] = useState<boolean>(false)

    const getInsightOverview = async () => {
        try {
            const response = await GetCurrentSituation()
            //prev = previous state
            //{ ...prev, insightOverview: response.data as InsightOverviewResponse } this is to creates new state object that included all the properties of 'prev', but with insightOverview updated to new data
            setOverview(prev => ({ ...prev, insightOverview: response.data as InsightOverviewResponse }))
        } catch (error) {
            throw handleError(error)
        }
    }

    const getTeamOverview = async () => {
        try {
            const response = await GetTeamOverview()
            setOverview(prev => ({ ...prev, teamOverview: response.data as TeamOverviewResponse }))
        } catch (error) {
            throw handleError(error)
        }
    }

    const getServiceOverview = async () => {
        try {
            const response = await GetServiceOverview();
            // console.log('Fetched Service Overview:', response.data); // Add this line to debug
            setOverview(prev => ({ ...prev, serviceOverviews: response.data as ServiceOverviewResponse[] }));
        } catch (error) {
            throw handleError(error);
        }
    };


    // for initial state
    useEffect(() => {
        Promise.all([getInsightOverview(), getTeamOverview(), getServiceOverview()])
            .catch(console.log)

        setOverview(prev => ({ ...prev, setLoad: setLoad, getInsightOverview, getServiceOverview, getTeamOverview })) // Add getInsightOverview to context value
        setLoad(false)
    }, [load])

    return <OverviewContext.Provider value={{ ...overview as OverviewContextProps }}>{children}</OverviewContext.Provider>
}

export {
    OverviewContext,
    OverviewProvider,
}
