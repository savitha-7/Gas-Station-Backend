import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from 'js-cookie';

// Fetch all suppliers (stations)
export const fetchSuppliers = createAsyncThunk(
  "user/fetchSuppliers",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/seller/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.stations;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch suppliers"
      );
    }
  }
);

// Fetch a specific station by ID
export const fetchStation = createAsyncThunk(
  "user/fetchStation",
  async (stationId, { getState, rejectWithValue }) => {
    try {
      // Hardcoded response for testing
      //       const token = getState().auth.token;
            let stationIdStr;
      if (typeof stationId === "object" && stationId !== null) {
        stationIdStr = String(stationId.id || JSON.stringify(stationId));
      } else {
        stationIdStr = String(stationId);
      }

      console.log(`Fetching station with ID: "${stationIdStr}"`);

      // Use template literals for URL
      const url = `${process.env.REACT_APP_API_BASE_URL}/api/seller/${stationIdStr}`;
      console.log("Request URL:", url); // Debug URL

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
      });
      // const response = {
      //   station: {
      //     _id: "681f7fa2f52f82d6842fc86f",
      //     name: "Bharat Gas Agency1",
      //     owner: "John Doe",
      //     phone: "9876543210",
      //     location: [
      //       {
      //         cityName: "Bangalore",
      //         pincode: "560001",
      //       },
      //     ],
      //     quantity: 100,
      //     price: 950,
      //     isBlocked: false,
      //     rating: "4.5",
      //     logo: "https://via.placeholder.com/50?text=BharatGas",
      //   },
      // };
      console.log("Station response:", response.data); // Debugging
      return response.data; // Return the station object
    } catch (error) {
      return rejectWithValue("Failed to fetch station");
    }
  }
);

// Fetch user details
export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (userId, { getState, rejectWithValue }) => {
    try {
      // const token = getState().auth.token;
            const url = `${process.env.REACT_APP_API_BASE_URL}/api/user/${userId}`;

      const response = await axios.get(url, {
        headers: {
          // Authorization: `Bearer ${token}`,
        },
      });
      console.log("User response:1", response.data); // Debugging
//       const response={
//   "_id": "6816fd8e6cd44a054dfb6428",
//   "username": "testuser",
//   "phone": "1234567890",
//   "email": "testuser@example.com",
//   "address": {
//     "pinCode": 560001,
//     "cityName": "Bangalore",
//     "AddressLine": "123 MG Road",
//     "state": "Karnataka"
//   }
// };
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);

// Fetch available time slots for a station and date
export const fetchTimeSlots = createAsyncThunk(
  "user/fetchTimeSlots",
  async ({ stationId, date }, { getState, rejectWithValue }) => {
    try {
      // const token = getState().auth.token;
      // if (!token) {
      //   return rejectWithValue("No authentication token found. Please log in.");
      // }

      let stationIdStr;
      if (typeof stationId === "object" && stationId !== null) {
        stationIdStr = String(stationId.id || JSON.stringify(stationId));
      } else {
        stationIdStr = String(stationId);
      }

      if (!stationIdStr || !date) {
        return rejectWithValue("stationId and date are required");
      }

      console.log(`Fetching time slots for stationId: "${stationIdStr}" and date: "${date}"`);

      const url = `${process.env.REACT_APP_API_BASE_URL}/api/slot?stationId=${stationIdStr}&date=${date}`;
      console.log("Time slots URL:", url);

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
      });

      console.log("Time slots response:", response.data);

      if (response.data.status !== "success") {
        return rejectWithValue(response.data.message || "Failed to fetch time slots");
      }

      return response.data.availableSlots;
    } catch (error) {
      console.error("Fetch time slots error:", error.response?.data, error.message);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch time slots");
    }
  }
);
// Place a new gas order (used for createBooking)
export const placeGasOrder = createAsyncThunk(
  "user/placeGasOrder",
  async (orderData, { getState, rejectWithValue }) => {
    try {
      // const token = getState().auth.token;
      const token = Cookies.get('authTokenUser');

      console.log("Placing order with token:", token);
      console.log("Order data:", orderData); // Debugging line
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/order`, orderData, {
        headers: {
          Authorization: `${token}`,
        },
      });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to place gas order.";
      return rejectWithValue(message);
    }
  }
);

// Alias createBooking to placeGasOrder for compatibility
export const createBooking = placeGasOrder;

// Modify an existing order
export const modifyOrder = createAsyncThunk(
  "user/modifyOrder",
  async ({ orderId, updates }, { getState, rejectWithValue }) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/order/${orderId}`, updates, {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update the order.";
      return rejectWithValue(message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    suppliers: [],
    station: null,
    user: null,
    timeSlots: [],
    orders: [],
    currentOrder: null,
    booking: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentOrder(state) {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Suppliers
      .addCase(fetchSuppliers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.suppliers = action.payload;
        state.loading = false;
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Station
      .addCase(fetchStation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStation.fulfilled, (state, action) => {
        state.station = action.payload;
        state.loading = false;
      })
      .addCase(fetchStation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch User
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Time Slots
      .addCase(fetchTimeSlots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTimeSlots.fulfilled, (state, action) => {
        state.timeSlots = action.payload;
        state.loading = false;
      })
      .addCase(fetchTimeSlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Place Gas Order / Create Booking
      .addCase(placeGasOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeGasOrder.fulfilled, (state, action) => {
        state.orders.push(action.payload);
        state.booking = action.payload;
        state.loading = false;
      })
      .addCase(placeGasOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Modify Order
      .addCase(modifyOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(modifyOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex((order) => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(modifyOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentOrder } = userSlice.actions;

export default userSlice.reducer;