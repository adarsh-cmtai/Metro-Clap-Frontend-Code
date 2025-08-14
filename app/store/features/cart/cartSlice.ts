import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { CartItem } from '@/app/services/components/types';
import type { RootState } from '@/app/store/store';
import api from '@/lib/api';

const CART_STORAGE_KEY = 'metroclap_cart';

const saveCartToLocalStorage = (cartItems: CartItem[]) => {
  if (typeof window !== 'undefined') {
    const expiry = new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 30 days
    const cartData = { cart: cartItems, expiry };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
  }
};

interface CartState {
  items: CartItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: CartState = {
  items: [],
  status: 'idle',
};

export const syncAndFetchCart = createAsyncThunk<
  { items: CartItem[] },
  void,
  { state: RootState }
>('cart/syncAndFetchCart', async (_, { getState, dispatch, rejectWithValue }) => {
    const { auth } = getState();
    if (!auth.token) {
        return rejectWithValue('User not logged in');
    }

    try {
        let localCartItems: CartItem[] = [];
        const localCartData = localStorage.getItem(CART_STORAGE_KEY);
        if (localCartData) {
            const parsedData = JSON.parse(localCartData);
            if (Date.now() < parsedData.expiry) {
                localCartItems = parsedData.cart;
            }
        }

        if (localCartItems.length > 0) {
            const itemsToSync = localCartItems.map(item => ({
                serviceId: item.serviceId,
                quantity: item.quantity,
                selectedOptions: [{
                    groupName: "Type",
                    optionName: item.subService.name,
                    price: item.subService.price
                }],
                totalPrice: item.price * item.quantity
            }));
            await api.post('/cart', { items: itemsToSync });
            localStorage.removeItem(CART_STORAGE_KEY);
        }
        
        const { data } = await api.get('/cart');
        return data;

    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to sync cart');
    }
});


const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartFromStorage: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.subService._id === newItem.subService._id);
      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.items.push(newItem);
      }
      saveCartToLocalStorage(state.items);
    },
    updateQuantity: (state, action: PayloadAction<{ subServiceId: string; delta: number }>) => {
      const { subServiceId, delta } = action.payload;
      const itemToUpdate = state.items.find(item => item.subService._id === subServiceId);
      if (itemToUpdate) {
        itemToUpdate.quantity += delta;
        if (itemToUpdate.quantity <= 0) {
          state.items = state.items.filter(item => item.subService._id !== subServiceId);
        }
      }
      saveCartToLocalStorage(state.items);
    },
    removeFromCart: (state, action: PayloadAction<{ subServiceId: string }>) => {
      state.items = state.items.filter(item => item.subService._id !== action.payload.subServiceId);
      saveCartToLocalStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      if (typeof window !== 'undefined') {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
  },
  extraReducers: (builder) => {
      builder
        .addCase(syncAndFetchCart.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(syncAndFetchCart.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.items = action.payload.items.map((dbItem: any) => ({
                serviceId: dbItem.serviceId._id,
                serviceName: dbItem.serviceId.name,
                serviceImage: dbItem.serviceId.imageUrl,
                subService: { 
                    _id: dbItem.selectedOptions[0]?.optionName, 
                    name: dbItem.selectedOptions[0]?.optionName,
                    price: dbItem.selectedOptions[0]?.price,
                    description: '',
                    duration: 0,
                },
                quantity: dbItem.quantity,
                price: dbItem.totalPrice / dbItem.quantity,
            }));
        })
        .addCase(syncAndFetchCart.rejected, (state) => {
            state.status = 'failed';
        });
  }
});

export const { setCartFromStorage, addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;