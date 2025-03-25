import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUserOrders = createAsyncThunk('orders/fetchUserOrders',async(_, {rejectWithValue})=>{

    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/orders/my-orders`,
            {
                headers : {
                    Authorization : `Bearer ${localStorage.getItem("userToken")}`
                }
            }
        );
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const fetchOrdersDetails = createAsyncThunk('orders/OrdersDetails',async( orderId,{rejectWithValue})=>{

    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/orders/my-orders/${orderId}`,
            {
                headers : {
                    Authorization : `Bearer ${localStorage.getItem("userToken")}`
                }
            }
        );
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

const orderSlice = createSlice({
    name:"orders",
    initialState:{
        orders:[],
        totalOrder:null,
        loading:false,
        error:null
    },
    reducers:{},
    extraReducers: (builder) => { 
        builder
        .addCase(fetchUserOrders.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchUserOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.orders = action.payload;
        })
        .addCase(fetchUserOrders.rejected, (state, action) => { 
            state.loading = false;
            state.error = action.payload.message;
        })
        .addCase(fetchOrdersDetails.pending, (state) => { 
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchOrdersDetails.fulfilled, (state, action) => {
            state.loading = false;
            state.totalOrder = action.payload;
        })
        .addCase(fetchOrdersDetails.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        });
    }
});

export default orderSlice.reducer;
