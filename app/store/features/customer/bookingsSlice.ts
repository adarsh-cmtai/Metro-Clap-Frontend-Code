import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { CustomerBooking } from '@/types';
import type { RootState } from '@/app/store/store';
import toast from 'react-hot-toast';
import api from '@/lib/api';

interface BookingsState {
  bookings: CustomerBooking[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: BookingsState = {
  bookings: [],
  status: 'idle',
  error: null,
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const fetchMyBookings = createAsyncThunk<
  CustomerBooking[], void, { state: RootState }
>('customer/fetchMyBookings', async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  if (!token) return rejectWithValue('Authentication token not found.');
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(`${backendUrl}/api/customer/bookings`, config);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings.');
  }
});

interface ReviewPayload { bookingId: string; partnerId: string; serviceId: string; rating: number; comment: string; }

export const submitReview = createAsyncThunk<
  void, ReviewPayload, { state: RootState }
>('customer/submitReview', async (reviewData, { getState, dispatch, rejectWithValue }) => {
  const token = getState().auth.token;
  if (!token) return rejectWithValue('Authentication token not found.');
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.post(`${backendUrl}/api/customer/reviews`, reviewData, config);
    dispatch(fetchMyBookings());
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to submit review.');
  }
});

export const cancelBooking = createAsyncThunk<
  CustomerBooking, string, { state: RootState }
>('customer/cancelBooking', async (bookingId, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.put(`${backendUrl}/api/customer/bookings/${bookingId}/cancel`, {}, config);
        toast.success('Booking cancelled successfully.');
        return data;
    } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to cancel booking.');
        return rejectWithValue(error.response?.data?.message);
    }
});

export const rescheduleBooking = createAsyncThunk<
  CustomerBooking, { bookingId: string, bookingDate: string, slotTime: string }, { state: RootState }
>('customer/rescheduleBooking', async (payload, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
        const { bookingId, ...rescheduleData } = payload;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.put(`${backendUrl}/api/customer/bookings/${bookingId}/reschedule`, rescheduleData, config);
        toast.success('Booking rescheduled successfully.');
        return data;
    } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to reschedule booking.');
        return rejectWithValue(error.response?.data?.message);
    }
});

export const payRemaining = createAsyncThunk<
    CustomerBooking, { bookingId: string; booking: CustomerBooking }, { state: RootState }
>('customer/payRemaining', async ({ bookingId, booking }, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    const user = getState().auth.user;
    if (!token || !user) return rejectWithValue('Not authenticated');
    
    try {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        document.body.appendChild(script);
        await new Promise(resolve => script.onload = resolve);

        const { data: order } = await api.post(`/payment/create-remaining-order/${bookingId}`);
        
        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: "INR",
            name: "MetroClap Services",
            description: `Payment for Booking ID: ${booking.bookingId}`,
            order_id: order.id,
            handler: async (response: any) => {
                const paymentDetails = { orderId: response.razorpay_order_id, paymentId: response.razorpay_payment_id, signature: response.razorpay_signature };
                const { data: updatedBooking } = await api.put(`/customer/bookings/${bookingId}/pay-remaining`, { paymentDetails });
                toast.success('Payment successful!');
                return updatedBooking;
            },
            prefill: { name: user.name, email: user.email, contact: user.mobileNumber },
            theme: { color: "#A4001C" }
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        
        return await new Promise((resolve, reject) => {
          rzp.on('payment.failed', (response: any) => {
            toast.error('Payment failed. Please try again.');
            reject(response.error.description);
          });
          options.handler = async (response: any) => {
            const paymentDetails = { orderId: response.razorpay_order_id, paymentId: response.razorpay_payment_id, signature: response.razorpay_signature };
            const { data: updatedBooking } = await api.put(`/customer/bookings/${bookingId}/pay-remaining`, { paymentDetails });
            toast.success('Payment successful!');
            resolve(updatedBooking);
          };
        });

    } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to process payment.');
        return rejectWithValue(error.response?.data?.message);
    }
});


const bookingsSlice = createSlice({
  name: 'customerBookings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const updateBookingInState = (state: BookingsState, action: PayloadAction<CustomerBooking>) => {
        const index = state.bookings.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
            state.bookings[index] = action.payload;
        }
    };
      
    builder
      .addCase(fetchMyBookings.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bookings = action.payload;
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(cancelBooking.fulfilled, updateBookingInState)
      .addCase(rescheduleBooking.fulfilled, updateBookingInState)
      .addCase(payRemaining.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(payRemaining.fulfilled, (state, action) => {
        state.status = 'succeeded';
        updateBookingInState(state, action);
      })
      .addCase(payRemaining.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default bookingsSlice.reducer;