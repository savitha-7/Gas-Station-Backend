import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

export const addSlot = createAsyncThunk(
    "slot/addSlot",
    async (payload, { rejectWithValue }) => {
      try {
        const token = Cookies.get("authToken");
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/api/slot`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to add slots");
      }
    }
  );
  