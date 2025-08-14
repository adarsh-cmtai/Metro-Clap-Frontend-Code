import { createSlice, createAsyncThunk, PayloadAction, AnyAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '@/app/store/store';
import { Location, Category, Service, SubService } from '@/types';

interface AdminServicesState {
    locations: Location[];
    categories: Category[];
    services: Service[];
    subServices: SubService[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: AdminServicesState = {
    locations: [],
    categories: [],
    services: [],
    subServices: [],
    status: 'idle',
    error: null,
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

interface ApiThunkResponse<T> {
    data: T;
    payload?: any;
}

const createApiThunk = <T>(
    name: string,
    method: 'get' | 'post' | 'put' | 'delete',
    endpoint: string
) => {
    return createAsyncThunk<ApiThunkResponse<T>, any, { state: RootState; rejectValue: string }>(
        name,
        async (payload, { getState, rejectWithValue }) => {
            const token = getState().auth.token;
            if (!token) return rejectWithValue('Not authenticated');

            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const url = `${backendUrl}${endpoint}${payload?._id ? `/${payload._id}` : ''}`;
                const { data } = await axios[method](
                    url,
                    method === 'get' ? config : payload,
                    config
                );
                return { data, payload };
            } catch (error: any) {
                return rejectWithValue(error.response?.data?.message);
            }
        }
    );
};

export const fetchLocations = createApiThunk<Location[]>('fetchLocations', 'get', '/api/admin/locations');
export const addLocation = createApiThunk<Location>('addLocation', 'post', '/api/admin/locations');
export const updateLocation = createApiThunk<Location>('updateLocation', 'put', '/api/admin/locations');
export const deleteLocation = createApiThunk<Location>('deleteLocation', 'delete', '/api/admin/locations');

export const fetchCategories = createApiThunk<Category[]>('fetchCategories', 'get', '/api/admin/categories');
export const addCategory = createApiThunk<Category>('addCategory', 'post', '/api/admin/categories');
export const updateCategory = createApiThunk<Category>('updateCategory', 'put', '/api/admin/categories');
export const deleteCategory = createApiThunk<Category>('deleteCategory', 'delete', '/api/admin/categories');

export const fetchServices = createApiThunk<Service[]>('fetchServices', 'get', '/api/admin/services');
export const addService = createApiThunk<Service>('addService', 'post', '/api/admin/services');
export const updateService = createApiThunk<Service>('updateService', 'put', '/api/admin/services');
export const deleteService = createApiThunk<Service>('deleteService', 'delete', '/api/admin/services');

export const fetchSubServices = createApiThunk<SubService[]>('fetchSubServices', 'get', '/api/admin/sub-services');
export const addSubService = createApiThunk<SubService>('addSubService', 'post', '/api/admin/sub-services');
export const updateSubService = createApiThunk<SubService>('updateSubService', 'put', '/api/admin/sub-services');
export const deleteSubService = createApiThunk<SubService>('deleteSubService', 'delete', '/api/admin/sub-services');

const adminServicesSlice = createSlice({
    name: 'adminServices',
    initialState,
    reducers: {
        clearCategories: (state) => {
            state.categories = [];
        },
        clearServices: (state) => {
            state.services = [];
        },
        clearSubServices: (state) => {
            state.subServices = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLocations.fulfilled, (state, action: PayloadAction<ApiThunkResponse<Location[]>>) => {
                state.locations = action.payload.data;
            })
            .addCase(addLocation.fulfilled, (state, action: PayloadAction<ApiThunkResponse<Location>>) => {
                state.locations.push(action.payload.data);
            })
            .addCase(updateLocation.fulfilled, (state, action: PayloadAction<ApiThunkResponse<Location>>) => {
                const index = state.locations.findIndex(i => i._id === action.payload.data._id);
                if (index !== -1) state.locations[index] = action.payload.data;
            })
            .addCase(deleteLocation.fulfilled, (state, action: PayloadAction<ApiThunkResponse<Location>>) => {
                state.locations = state.locations.filter(i => i._id !== action.payload.payload._id);
            })
            .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<ApiThunkResponse<Category[]>>) => {
                state.categories = action.payload.data;
            })
            .addCase(addCategory.fulfilled, (state, action: PayloadAction<ApiThunkResponse<Category>>) => {
                state.categories.push(action.payload.data);
            })
            .addCase(updateCategory.fulfilled, (state, action: PayloadAction<ApiThunkResponse<Category>>) => {
                const index = state.categories.findIndex(i => i._id === action.payload.data._id);
                if (index !== -1) state.categories[index] = action.payload.data;
            })
            .addCase(deleteCategory.fulfilled, (state, action: PayloadAction<ApiThunkResponse<Category>>) => {
                state.categories = state.categories.filter(i => i._id !== action.payload.payload._id);
            })
            .addCase(fetchServices.fulfilled, (state, action: PayloadAction<ApiThunkResponse<Service[]>>) => {
                state.services = action.payload.data;
            })
            .addCase(addService.fulfilled, (state, action: PayloadAction<ApiThunkResponse<Service>>) => {
                state.services.push(action.payload.data);
            })
            .addCase(updateService.fulfilled, (state, action: PayloadAction<ApiThunkResponse<Service>>) => {
                const index = state.services.findIndex(i => i._id === action.payload.data._id);
                if (index !== -1) state.services[index] = action.payload.data;
            })
            .addCase(deleteService.fulfilled, (state, action: PayloadAction<ApiThunkResponse<Service>>) => {
                state.services = state.services.filter(i => i._id !== action.payload.payload._id);
            })
            .addCase(fetchSubServices.fulfilled, (state, action: PayloadAction<ApiThunkResponse<SubService[]>>) => {
                state.subServices = action.payload.data;
            })
            .addCase(addSubService.fulfilled, (state, action: PayloadAction<ApiThunkResponse<SubService>>) => {
                state.subServices.push(action.payload.data);
            })
            .addCase(updateSubService.fulfilled, (state, action: PayloadAction<ApiThunkResponse<SubService>>) => {
                const index = state.subServices.findIndex(i => i._id === action.payload.data._id);
                if (index !== -1) state.subServices[index] = action.payload.data;
            })
            .addCase(deleteSubService.fulfilled, (state, action: PayloadAction<ApiThunkResponse<SubService>>) => {
                state.subServices = state.subServices.filter(i => i._id !== action.payload.payload._id);
            })
            .addMatcher((action: AnyAction) => action.type.endsWith('/fulfilled'), (state) => {
                state.status = 'succeeded';
                state.error = null;
            })
            .addMatcher((action: AnyAction) => action.type.endsWith('/pending'), (state) => {
                state.status = 'loading';
            })
            .addMatcher((action: AnyAction) => action.type.endsWith('/rejected'), (state, action: AnyAction) => {
                state.status = 'failed';
                state.error = action.payload ?? 'Unknown error';
            });
    },
});

export const { clearCategories, clearServices, clearSubServices } = adminServicesSlice.actions;
export default adminServicesSlice.reducer;
