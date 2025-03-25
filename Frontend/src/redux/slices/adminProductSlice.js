import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/admin`;

export const fetchAdminProducts = createAsyncThunk(
    "adminProducts/fetchProducts",
    async () => {
        const response = await axios.get(`${BASE_URL}/getAllProducts`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        });
        return response.data;
    }
);

export const createProduct = createAsyncThunk(
    "adminProducts/createProduct",
    async (productData) => {
        const response = await axios.post(`${BASE_URL}/products`, productData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        });
        return response.data;
    }
);

export const updateProduct = createAsyncThunk(
    "adminProducts/updateProduct",
    async ({ productId, productData }) => {
        const response = await axios.put(`${BASE_URL}/products/${productId}`, productData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        });
        return response.data;
    }
);

export const deleteProduct = createAsyncThunk(
    "adminProducts/deleteProduct",
    async (productId) => {
         await axios.delete(`${BASE_URL}/products/${productId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        });
        return productId;
    }
);

const adminProductSlice = createSlice({
    name: "adminProducts",
    initialState: {
        products: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAdminProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchAdminProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            .addCase(createProduct.fulfilled, (state, action) => {
                state.products.push(action.payload);
            })

            .addCase(updateProduct.fulfilled, (state, action) => {
                const index = state.products.findIndex((p) => p._id === action.payload._id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            })

            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.products = state.products.filter((p) => p._id !== action.payload);
            });
    }
});

export default adminProductSlice.reducer;