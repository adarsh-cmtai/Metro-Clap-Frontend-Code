import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Customer } from '@/types';
import type { RootState } from '@/app/store/store';

interface AdminCustomersState {
  customers: Customer[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AdminCustomersState = {
  customers: [],
  status: 'idle',
  error: null,
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const fetchAdminCustomers = createAsyncThunk<
  Customer[],
  { search?: string },
  { state: RootState }
>('adminCustomers/fetch', async (params, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  if (!token) return rejectWithValue('Not authenticated');
  try {
    const config = { headers: { Authorization: `Bearer ${token}` }, params };
    const { data } = await axios.get(`${backendUrl}/api/admin/customers`, config);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch customers');
  }
});

const adminCustomersSlice = createSlice({
  name: 'adminCustomers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminCustomers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAdminCustomers.fulfilled, (state, action: PayloadAction<Customer[]>) => {
        state.status = 'succeeded';
        state.customers = action.payload;
      })
      .addCase(fetchAdminCustomers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default adminCustomersSlice.reducer;