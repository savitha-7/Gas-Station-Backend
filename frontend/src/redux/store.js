import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"; // Assuming you have an authSlice for authentication
import orderReducer from "./orderSlice";
import userReducer from "./userSlice"; // Assuming you have a userSlice for user data

const store = configureStore({
  reducer: {
    auth: authReducer,
    order: orderReducer,
    user: userReducer,

  },
});

export default store;
