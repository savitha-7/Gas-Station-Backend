import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from 'js-cookie';
// Async register actions for different user types
export const registerUser = createAsyncThunk(
  "api/auth/register",
  async ({ username, email, password, phone }, thunkAPI) => {
    const phoneNumber = parseInt(phone, 10);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/user/register`, {
        name: username,
        email,
        phone: phoneNumber,
        password,
      });
      console.log("Response from backend:", response.data); // Log the response for debugging
      if (response.status !== 201) {
        return thunkAPI.rejectWithValue("Registration failed. Please try again.");
      }

      return response.data; // Assumes your API returns the user object
    } catch (error) {
      // Handle backend error message if available
      const message =
        error.response?.data?.message || "User registration failed. Please try again.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);



export const registerSupplier = createAsyncThunk(
  "api/auth/registerSupplier",
  async (supplierData, thunkAPI) => {
    console.log("registerSupplier");

    try {
      const formattedSupplierData = {
        ...supplierData,
        phone: Number(supplierData.phone), // ✅ Convert phone to number
      };
// delete formattedSupplierData.confirmPassword;
delete formattedSupplierData.pincode;
delete formattedSupplierData.cityName; // Remove pincode and cityName from the data sent to the backend
 // Remove confirmPassword from the data sent to the backend
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/seller/register`,
        formattedSupplierData
      );

      console.log("Supplier registration response:", response.data);

      if (response.status !== 201) {
        return thunkAPI.rejectWithValue("Supplier registration failed. Please try again.");
      }

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Supplier registration failed. Please try again.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);



export const registerAdmin = createAsyncThunk(
  "auth/registerAdmin",
  async ({ username, email, password }, thunkAPI) => {
    // Simulated API call for admin registration
    if (username && email && password) {
      return { username, email, role: "admin" };
    } else {
      throw new Error("Admin registration failed. Please try again.");
    }
  }
);


export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/user/login`, {
        email,
        password,
      });

      if (response.status !== 200) {
        return thunkAPI.rejectWithValue("Login failed. Please try again.");
      }

      const { token, userId } = response.data; // Assuming response: { token: "jwt-token", userId: "user-id" }
      console.log("Login response:", response.data);

      // Store token and userId in cookies
      Cookies.set("authTokenUser", token, {
        expires: 7, // 7 days
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });
      Cookies.set("authTokenUserId", userId, {
        expires: 7, // 7 days
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      // Store user data in localStorage to align with App.js
      localStorage.setItem("user", JSON.stringify({ token, userId }));

      return response.data; // Return token and userId for Redux state
    } catch (error) {
      const message =
        error.response?.data?.message || "Invalid credentials. Please try again.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);


export const loginSupplier = createAsyncThunk(
  "auth/loginSupplier",
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/seller/login`, {
        email,
        password,
      });

      if (response.status !== 200) {
        return thunkAPI.rejectWithValue("Login failed. Please try again.");
      }

      const { token,sellerId} = response.data; // Assuming response: { token: "jwt-token" }
      console.log("Login response:", response.data);

      // Store token in cookie
      Cookies.set("authToken", token, {
        expires: 7, // 7 days
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });
      Cookies.set("authTokenSellerId", sellerId, {
        expires: 7, // 7 days
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });
      // Store supplier data in localStorage to align with App.js
      localStorage.setItem("fuelStation", JSON.stringify({ token }));

      return response.data; // Return token for Redux state
    } catch (error) {
      const message =
        error.response?.data?.message || "Invalid credentials. Please try again.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async ({ email, password }, thunkAPI) => {
    if (email === "admin@example.com" && password === "password123") {
      return { email, role: "admin" }; // Role set to admin
    } else {
      throw new Error("Invalid credentials");
    }
  }
);



const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    userId: null,
    role: null,
    error: null,
  },
  reducers: {
    logout(state) {
      Cookies.remove('authToken'); // Clear token on logout
      state.token = null;
      state.userId = null;
      state.role = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const handleFulfilled = (state, action) => {
      const { token, userId, role } = action.payload;
      state.token = token;
      state.userId = userId || "seller"; // default to "seller" if not present
      state.role = role || "user"; // default to "user" if not present
      state.error = null;
    };

    const handleRejected = (state, action) => {
      state.error = action.error.message;
    };

    builder
      // Fulfilled cases
      .addCase(registerUser.fulfilled, handleFulfilled)
      .addCase(registerSupplier.fulfilled, handleFulfilled)
      .addCase(registerAdmin.fulfilled, handleFulfilled)
      .addCase(loginUser.fulfilled, handleFulfilled)
      .addCase(loginSupplier.fulfilled, handleFulfilled)
      .addCase(loginAdmin.fulfilled, handleFulfilled)

      // Rejected cases
      .addCase(registerUser.rejected, handleRejected)
      .addCase(registerSupplier.rejected, handleRejected)
      .addCase(registerAdmin.rejected, handleRejected)
      .addCase(loginUser.rejected, handleRejected)
      .addCase(loginSupplier.rejected, handleRejected)
      .addCase(loginAdmin.rejected, handleRejected);
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
