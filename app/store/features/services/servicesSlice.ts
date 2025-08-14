import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Service, Category } from '@/types';

interface ServicesState {
  services: Service[];
  categories: Category[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ServicesState = {
  services: [],
  categories: [],
  status: 'idle',
  error: null,
};

export const fetchServicesAndCategories = createAsyncThunk(
  'services/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const [servicesRes, categoriesRes] = await Promise.all([
        axios.get<Service[]>(`${backendUrl}/api/admin/services`),
        axios.get<Category[]>(`${backendUrl}/api/admin/categories`),
      ]);
      return { services: servicesRes.data, categories: categoriesRes.data };
    } catch (error: any) {
      return rejectWithValue('Failed to fetch services and categories');
    }
  }
);

const servicesSlice = createSlice({
  name: 'servicesData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServicesAndCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchServicesAndCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.services = action.payload.services;
        state.categories = action.payload.categories;
      })
      .addCase(fetchServicesAndCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default servicesSlice.reducer;