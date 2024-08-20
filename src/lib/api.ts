import { get } from "@/common/api";
import { ApiResponse, PaginatedResponse } from "@/common/api/type";
import { CheckboxOptionResponse } from "@/modules/models/anomaly-predictions";

// lib/api.ts
export interface TimeRangeOption {
    label: string;
    value: number;
}

export interface CheckboxOption {
    id: string;       // Corresponds to the "name" field in the API response
    label: string;    // Corresponds to the "comment" field in the API response
    type: string;     // Corresponds to the "type" field in the API response
}

export const fetchTimeRanges = async (): Promise<TimeRangeOption[]> => {
    try {
        const response = await fetch('/api/time-ranges');
        if (!response.ok) {
            throw new Error('Failed to fetch time ranges');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching time ranges:', error);
        throw error;
    }
};


export const fetchCheckboxes = async (table: string = "apm"): Promise<ApiResponse<CheckboxOptionResponse>> => {
    const response: ApiResponse<CheckboxOptionResponse> = await get(`anomaly-predictions/filter-column?table=${table}`, {
        withAuth: true,
    });

    return response;
};