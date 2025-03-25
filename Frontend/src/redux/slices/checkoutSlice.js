import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createCheckOut = createAsyncThunk(
    'checkout/createCheckout',
    async (checkoutData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/checkout`,
                checkoutData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

const checkoutSlice = createSlice({
    name: "checkout",
    initialState: {
        checkout: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createCheckOut.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCheckOut.fulfilled, (state, action) => {
                state.loading = false;
                state.checkout = action.payload;
            })
            .addCase(createCheckOut.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default checkoutSlice.reducer;