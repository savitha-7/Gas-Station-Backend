import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from 'js-cookie';
// Async thunk to fetch supplier orders
export const fetchSupplierOrders = createAsyncThunk(
  "order/fetchSupplierOrders",
  async (_, { rejectWithValue, getState }) => {
    try {
      // const token = getState().auth;

const token = Cookies.get('authToken');
      console.log("Fetching supplier orders with token:", token);

      console.log("Fetching supplier orders with token:", token);
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/order?delivered=true`, {
        headers: { Authorization: `${token}` },
      });
      return response.data; // { count: number, orders: array }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
    }
  }
);
export const fetchSupplierOrdersCurrent = createAsyncThunk(
  "order/fetchSupplierOrders",
  async (_, { rejectWithValue, getState }) => {
    try {
      // const token = getState().auth;

const token = Cookies.get('authToken');
      console.log("Fetching supplier orders with token:", token);

      console.log("Fetching supplier orders with token:", token);
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/order?delivered=false`, {
        headers: { Authorization: `${token}` },
      });
      return response.data; // { count: number, orders: array }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
    }
  }
);


export const getOrders = createAsyncThunk(
  "order/fetchUserOrders",
  async (_, { rejectWithValue, getState }) => {
    try {
      // const token = getState().auth;

const token = Cookies.get('userAuthToken');
      console.log("Fetching orders with token:", token);

      console.log("Fetching orders with token:", token);
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/order`, {
        headers: { Authorization: `${token}` },
      });
      return response.data; // { count: number, orders: array }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
    }
  }
);

export const acceptOrder = createAsyncThunk(
  "order/acceptOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      // Get token from localStorage (fuelStation for suppliers)
      const token =Cookies.get("authToken");

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      console.log("Marking order as delivered:", { orderId, token });

      // Make PUT request to mark order as delivered
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/api/order/${orderId}/accept`, // Replace with {{base_url}}
        {}, // Body (empty or add { delivered: true } if required by backend)
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data; // Expected: { message: "Order marked as delivered", order: {...} }
    } catch (error) {
      console.error("Accept Order Error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark order as delivered"
      );
    }
  }
);



export const cancelOrder = createAsyncThunk(
  "order/canceltOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      // Get token from localStorage (fuelStation for suppliers)
      const token =Cookies.get("authToken");

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      console.log("Marking order as Canceled:", { orderId, token });

      // Make PUT request to mark order as delivered
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/api/order/${orderId}/cancel`, // Replace with {{base_url}}
        {}, // Body (empty or add { delivered: true } if required by backend)
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data; // Expected: { message: "Order marked as delivered", order: {...} }
    } catch (error) {
      console.error("Cancel Order Error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark order as delivered"
      );
    }
  }
);



export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get('userAuthToken');
      console.log("Fetching supplier orders with token:", token);
      if (!token) {
        return rejectWithValue('No authentication token found');
      }
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/order`, {
        headers: { Authorization: `${token}` },
      });
      console.log("Fetching supplier orders with token:", response.data);
      return response.data; // { count: number, orders: array }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const deliverOrder = createAsyncThunk(
  "order/acceptOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      // Get token from localStorage (fuelStation for suppliers)
      const token =Cookies.get("authToken");

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      console.log("Marking order as delivered:", { orderId, token });

      // Make PUT request to mark order as delivered
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/api/order/${orderId}/deliver`, // Replace with {{base_url}}
        {}, // Body (empty or add { delivered: true } if required by backend)
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data; // Expected: { message: "Order marked as delivered", order: {...} }
    } catch (error) {
      console.error("Accept Order Error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark order as delivered"
      );
    }
  }
);


const orderSlice = createSlice({
  name: "order",
  initialState: {
    supplierOrders: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearOrders: (state) => {
      state.supplierOrders = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSupplierOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSupplierOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.supplierOrders = action.payload;
      })
      .addCase(fetchSupplierOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrders } = orderSlice.actions;
export default orderSlice.reducer;