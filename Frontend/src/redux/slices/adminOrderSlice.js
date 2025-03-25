import { createSlice, createAsyncThunk, __DO_NOT_USE__ActionTypes } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Fetch All Orders
export const fetchAllOrders = createAsyncThunk(
    "adminOrders/fetchAllOrder",
    async (__DO_NOT_USE__ActionTypes, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/admin/getAllOrders`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// ✅ Update Order by ID
export const updateOrder = createAsyncThunk(
    "adminOrders/updateOrder",
    async ({ orderId, status }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/admin/getOrder/update/${orderId}`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// ✅ Delete Order by ID
export const deleteOrder = createAsyncThunk(
    "adminOrders/deleteOrder",
    async (orderId, { rejectWithValue }) => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/admin/order/delete/${orderId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`
                    }
                }
            );
            return { orderId };
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// ✅ Order Slice
const adminOrderSlice = createSlice({
    name: "adminOrders",
    initialState: {
        orders: [],
        totalOrders: 0,
        totalSales: 0,
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Orders
            .addCase(fetchAllOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
                state.totalOrders = action.payload.length;
                state.totalSales = action.payload.reduce((acc, order) => acc + order.totalPrice, 0);
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Order
            .addCase(updateOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateOrder.fulfilled, (state, action) => {
                state.loading = false;
                const updatedOrder = action.payload;
                const index = state.orders.findIndex((o) => o._id === updatedOrder._id);
                if (index !== -1) {
                    state.orders[index] = { ...state.orders[index], ...updatedOrder };
                }
            })
            .addCase(updateOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete Order
            .addCase(deleteOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = state.orders.filter((o) => o._id !== action.payload.orderId);
                state.totalOrders -= 1;
            })
            .addCase(deleteOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default adminOrderSlice.reducer;
