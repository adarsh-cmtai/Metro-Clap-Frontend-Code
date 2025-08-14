// --- START OF FILE app/store/features/admin/adminPartnerApplicationsSlice.ts ---

import { createSlice, createAsyncThunk, PayloadAction, isPending, isRejectedWithValue } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '@/app/store/store';
import { PartnerApplication } from '@/types';

interface State {
    applications: PartnerApplication[];
    singleApplication: PartnerApplication | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: State = {
    applications: [],
    singleApplication: null,
    status: 'idle',
    error: null,
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const createApiThunk = (name: string, method: 'get' | 'put', endpoint: string, requiresId = false) => {
    return createAsyncThunk(name, async (id: string | null, { getState, rejectWithValue }) => {
        const token = (getState() as RootState).auth.token;
        if (!token) return rejectWithValue('Not authenticated');
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const url = requiresId ? `${backendUrl}${endpoint}/${id}` : `${backendUrl}${endpoint}`;
            
            let response;
            if (method === 'get') {
                response = await axios.get(url, config);
            } else { // 'put'
                response = await axios.put(url, {}, config);
            }
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message);
        }
    });
};

export const fetchApplications = createApiThunk('fetchApplications', 'get', '/api/admin/partner-applications');
export const fetchApplicationDetails = createApiThunk('fetchApplicationDetails', 'get', '/api/admin/partner-applications', true);
export const approveApplication = createApiThunk('approveApplication', 'put', '/api/admin/partner-applications', true);
export const rejectApplication = createApiThunk('rejectApplication', 'put', '/api/admin/partner-applications', true);

const adminPartnerApplicationsSlice = createSlice({
    name: 'adminPartnerApplications',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchApplications.fulfilled, (state, action: PayloadAction<PartnerApplication[]>) => {
                state.applications = action.payload;
            })
            .addCase(fetchApplicationDetails.fulfilled, (state, action: PayloadAction<PartnerApplication>) => {
                state.singleApplication = action.payload;
            })
            .addCase(approveApplication.fulfilled, (state, action) => {
                if (state.singleApplication) state.singleApplication.status = 'Approved';
                state.applications = state.applications.filter(app => app._id !== state.singleApplication?._id);
            })
            .addCase(rejectApplication.fulfilled, (state, action) => {
                if (state.singleApplication) state.singleApplication.status = 'Rejected';
                state.applications = state.applications.filter(app => app._id !== state.singleApplication?._id);
            })
            .addMatcher(isPending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addMatcher((action) => action.type.endsWith('/fulfilled'), (state) => {
                state.status = 'succeeded';
            })
            .addMatcher(isRejectedWithValue, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    }
});

export default adminPartnerApplicationsSlice.reducer;

// --- END OF FILE app/store/features/admin/adminPartnerApplicationsSlice.ts ---