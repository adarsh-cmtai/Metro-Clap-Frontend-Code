// --- START OF FILE app/store/features/cartSlice.ts ---

import { createSlice, createAsyncThunk, PayloadAction, isPending, isRejectedWithValue } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '@/app/store/store';

// Define types locally for cart as they are specific to this flow
interface SelectedOption { groupName: string; optionName: string; price: number; }
export interface CartItem { _id: string; serviceId: any; quantity: number; selectedOptions: SelectedOption[]; totalPrice: number; }
interface Cart { _id: string; userId: string; items: CartItem[]; }

interface CartState {
    cart: Cart | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: CartState = {
    cart: null, status: 'idle', error: null,
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(`${backendUrl}/api/cart`, config);
        return data;
    } catch (error: any) { return rejectWithValue(error.response.data.message); }
});

export const addToCart = createAsyncThunk('cart/add', 
    async (items: { serviceId: string, quantity: number, price: number }[], { getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
        const payload = { items: items.map(item => ({...item, totalPrice: item.price * item.quantity })) };
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.post(`${backendUrl}/api/cart`, payload, config);
        return data;
    } catch (error: any) { return rejectWithValue(error.response.data.message); }
});

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.fulfilled, (state, action: PayloadAction<Cart>) => {
                state.cart = action.payload;
            })
            .addCase(addToCart.fulfilled, (state, action: PayloadAction<Cart>) => {
                state.cart = action.payload;
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
    },
});

export default cartSlice.reducer;

// --- END OF FILE app/store/features/cartSlice.ts ---