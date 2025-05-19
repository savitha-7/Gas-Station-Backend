import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

export const updateGasStation = createAsyncThunk(
  "gasStation/updateGasStation",
  async ({ stationId, price, quantity }, { rejectWithValue }) => {
    try {
      const token = Cookies.get("authToken");

      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/api/seller/`,
        { price, quantity },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update gas station"
      );
    }
  }
);


export const updateGasStationQuantity = async (data) => {
  try {
    const token = Cookies.get("authToken");

    const response = await axios.put(
      `${process.env.REACT_APP_API_BASE_URL}/api/seller/`,
      data,
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Update error:', error.response?.data || error.message);
    throw error;
  }
};
