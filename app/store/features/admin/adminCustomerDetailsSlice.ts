import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { CustomerDetails, Address, SupportTicket, User } from '@/types';
import type { RootState } from '@/app/store/store';
import toast from 'react-hot-toast';

interface State {
  details: CustomerDetails | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: State = {
  details: null,
  status: 'idle',
  error: null,
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const fetchCustomerDetails = createAsyncThunk<CustomerDetails, string, { state: RootState }>(
  'adminCustomerDetails/fetch',
  async (customerId, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(`${backendUrl}/api/admin/customers/${customerId}/details`, config);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateCustomerAddress = createAsyncThunk<Address, Partial<Address>, { state: RootState }>(
  'adminCustomerDetails/updateAddress',
  async (addressData, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.put(`${backendUrl}/api/admin/addresses/${addressData._id}`, addressData, config);
      toast.success('Address updated successfully');
      return data;
    } catch (error: any) {
      toast.error('Failed to update address');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteCustomerAddress = createAsyncThunk<string, string, { state: RootState }>(
    'adminCustomerDetails/deleteAddress',
    async (addressId, { getState, rejectWithValue }) => {
        const token = getState().auth.token;
        if (!token) return rejectWithValue('Not authenticated');
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`${backendUrl}/api/admin/addresses/${addressId}`, config);
            toast.success('Address deleted successfully');
            return addressId;
        } catch (error: any) {
            toast.error('Failed to delete address');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const addAdminReply = createAsyncThunk<SupportTicket, { ticketId: string; message: string }, { state: RootState }>(
    'adminCustomerDetails/addReply',
    async ({ ticketId, message }, { getState, rejectWithValue }) => {
        const token = getState().auth.token;
        if (!token) return rejectWithValue('Not authenticated');
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.post(`${backendUrl}/api/admin/support-tickets/${ticketId}/reply`, { message }, config);
            toast.success('Reply sent successfully');
            return data;
        } catch (error: any) {
            toast.error('Failed to send reply');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

const adminCustomerDetailsSlice = createSlice({
  name: 'adminCustomerDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerDetails.pending, (state) => {
        state.status = 'loading';
        state.details = null;
      })
      .addCase(fetchCustomerDetails.fulfilled, (state, action: PayloadAction<CustomerDetails>) => {
        state.status = 'succeeded';
        state.details = action.payload;
      })
      .addCase(fetchCustomerDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(updateCustomerAddress.fulfilled, (state, action: PayloadAction<Address>) => {
        if (state.details) {
            const index = state.details.addresses.findIndex(a => a._id === action.payload._id);
            if (index !== -1) state.details.addresses[index] = action.payload;
        }
      })
      .addCase(deleteCustomerAddress.fulfilled, (state, action: PayloadAction<string>) => {
        if (state.details) {
            state.details.addresses = state.details.addresses.filter(a => a._id !== action.payload);
        }
      })
      .addCase(addAdminReply.fulfilled, (state, action: PayloadAction<SupportTicket>) => {
        if (state.details) {
            const index = state.details.supportTickets.findIndex(t => t._id === action.payload._id);
            if (index !== -1) state.details.supportTickets[index] = action.payload;
        }
      });
  },
});

export default adminCustomerDetailsSlice.reducer;