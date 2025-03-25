import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/admin/users`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error.response?.data || error.message || error);
      return rejectWithValue(error.response?.data || "Failed to fetch users");
    }
  }
);

export const addUser = createAsyncThunk(
  "admin/addUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/admin/create`,
        userData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding user:", error.response?.data || error.message || error);
      console.error("Detailed error:", error.toJSON ? error.toJSON() : error);
      return rejectWithValue(error.response?.data || "Failed to add user");
    }
  }
);

export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async ({ id, name, email, role }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/admin/users/${id}`,
        { name, email, role },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
        }
      );
      return response.data.user;
    } catch (error) {
      console.error("Error updating user:", error.response?.data || error.message || error);
      return rejectWithValue(error.response?.data || "Failed to update user");
    }
  }
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
      });
      return id;
    } catch (error) {
      console.error("Error deleting user:", error.response?.data || error.message || error);
      return rejectWithValue(error.response?.data || "Failed to delete user");
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload.user);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex((user) => user._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;