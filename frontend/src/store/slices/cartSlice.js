import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/cart');
    return res.data.cart;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const addToCart = createAsyncThunk('cart/addToCart', async ({ productId, quantity = 1 }, { rejectWithValue }) => {
  try {
    const res = await api.post('/cart/add', { productId, quantity });
    return res.data.cart;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateCartItem = createAsyncThunk('cart/updateItem', async ({ itemId, quantity }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/cart/update/${itemId}`, { quantity });
    return res.data.cart;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const removeFromCart = createAsyncThunk('cart/removeItem', async (itemId, { rejectWithValue }) => {
  try {
    const res = await api.delete(`/cart/remove/${itemId}`);
    return res.data.cart;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const clearCart = createAsyncThunk('cart/clearCart', async () => {
  await api.delete('/cart/clear');
  return null;
});

export const applyCoupon = createAsyncThunk('cart/applyCoupon', async (code, { rejectWithValue }) => {
  try {
    const res = await api.post('/cart/coupon', { code });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { cart: null, isLoading: false, error: null },
  reducers: {
    clearCartError: (state) => { state.error = null; },
    resetCart: (state) => { state.cart = null; },
  },
  extraReducers: (builder) => {
    const setCart = (state, action) => { state.isLoading = false; if (action.payload) state.cart = action.payload; };
    const setPending = (state) => { state.isLoading = true; state.error = null; };
    const setError = (state, action) => { state.isLoading = false; state.error = action.payload; };

    builder
      .addCase(fetchCart.pending, setPending)
      .addCase(fetchCart.fulfilled, setCart)
      .addCase(fetchCart.rejected, setError)
      .addCase(addToCart.pending, setPending)
      .addCase(addToCart.fulfilled, setCart)
      .addCase(addToCart.rejected, setError)
      .addCase(updateCartItem.fulfilled, setCart)
      .addCase(removeFromCart.fulfilled, setCart)
      .addCase(clearCart.fulfilled, (state) => { state.cart = null; })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        if (state.cart) { state.cart.discount = action.payload.discount; state.cart.coupon = action.payload.coupon?.code; }
      })
      .addCase(applyCoupon.rejected, setError);
  }
});

export const { clearCartError, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
