import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

import { mockProducts } from '../../utils/mockData';

export const fetchProducts = createAsyncThunk('products/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/products', { params });
    return res.data;
  } catch (err) {
    console.warn('API fetch failed, using mock data');
    let filtered = [...mockProducts];
    if (params?.category) filtered = filtered.filter(p => p.category === params.category);
    if (params?.keyword) filtered = filtered.filter(p => p.name.toLowerCase().includes(params.keyword.toLowerCase()));
    return { products: filtered, total: filtered.length, pages: 1, page: 1 };
  }
});

export const fetchFeatured = createAsyncThunk('products/featured', async () => {
  try {
    const res = await api.get('/products/featured');
    return res.data.products;
  } catch (err) {
    return mockProducts.filter(p => p.isFeatured);
  }
});

export const fetchTrending = createAsyncThunk('products/trending', async () => {
  try {
    const res = await api.get('/products/trending');
    return res.data.products;
  } catch (err) {
    return mockProducts.filter(p => p.isTrending);
  }
});

export const fetchProduct = createAsyncThunk('products/single', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/products/${id}`);
    return res.data.product;
  } catch (err) {
    const product = mockProducts.find(p => p._id === id);
    if (product) return product;
    return rejectWithValue(err.response?.data?.message || 'Product not found');
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [], total: 0, pages: 1, page: 1,
    featured: [], trending: [],
    currentProduct: null,
    isLoading: false, error: null,
    filters: { keyword: '', category: '', minPrice: '', maxPrice: '', sort: 'newest', page: 1 }
  },
  reducers: {
    setFilters: (state, action) => { state.filters = { ...state.filters, ...action.payload }; },
    clearFilters: (state) => { state.filters = { keyword: '', category: '', minPrice: '', maxPrice: '', sort: 'newest', page: 1 }; },
    clearCurrentProduct: (state) => { state.currentProduct = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
        state.page = action.payload.page;
      })
      .addCase(fetchProducts.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      .addCase(fetchFeatured.fulfilled, (state, action) => { state.featured = action.payload; })
      .addCase(fetchTrending.fulfilled, (state, action) => { state.trending = action.payload; })
      .addCase(fetchProduct.pending, (state) => { state.isLoading = true; state.error = null; state.currentProduct = null; })
      .addCase(fetchProduct.fulfilled, (state, action) => { state.isLoading = false; state.currentProduct = action.payload; })
      .addCase(fetchProduct.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });
  }
});

export const { setFilters, clearFilters, clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
