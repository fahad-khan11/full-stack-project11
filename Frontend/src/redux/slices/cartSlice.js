import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const loadCartFromStorage = () => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : { products: [] };
};

const saveCartToStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const getToken = () => {
  let token = localStorage.getItem("userToken");
  if (!token) {
    throw new Error("Unauthorized: No token provided");
  }
  return token;
};

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({ userId, guestId }, { rejectWithValue }) => {
    try {
      const token = getToken();
      console.log('Fetching cart for userId:', userId, 'guestId:', guestId);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/cart/getCart`, // Ensure this URL is correct
        {
          params: { userId, guestId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Cart fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity, size, color, guestId, userId }, { rejectWithValue }) => {
    try {
      const token = getToken();
      console.log('Adding to cart with userId:', userId, 'guestId:', guestId);
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/cart`, {
        productId,
        quantity,
        size,
        color,
        guestId,
        userId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      console.log('Product added to cart:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async ({ productId, quantity, guestId, userId, size, color }, { rejectWithValue }) => {
    try {
      const token = getToken();
      console.log('Updating cart item quantity for userId:', userId, 'guestId:', guestId);
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/cart/update`, {
        productId,
        quantity,
        guestId,
        userId,
        size,
        color,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      console.log('Cart item quantity updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ userId, guestId, productId, size, color }, { rejectWithValue }) => {
    try {
      const token = getToken();
      console.log('Removing from cart with userId:', userId, 'guestId:', guestId);
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/cart/delete`,
        { 
          data: { userId, productId, guestId, size, color },
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      console.log('Product removed from cart:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const mergeCart = createAsyncThunk(
  "cart/mergeCart",
  async ({ userId, guestId }, { rejectWithValue }) => {
    try {
      const token = getToken();
      console.log('Merging cart for userId:', userId, 'guestId:', guestId);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/cart/merge`,
        { userId, guestId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      console.log('Cart merged successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error merging cart:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: loadCartFromStorage(),
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.cart = { products: [] };
      localStorage.removeItem("cart");
      saveCartToStorage(state.cart);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        saveCartToStorage(state.cart);
      })
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(mergeCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;