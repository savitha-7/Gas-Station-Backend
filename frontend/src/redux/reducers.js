import { combineReducers } from "redux";
import authReducer from "./authSlice"; // <-- add this
import orderReducer from './orderSlice';
import userReducer from './userSlice'; // Assuming you have a userSlice for user data

const rootReducer = combineReducers({
  auth: authReducer,
  order: orderReducer,
  user: userReducer,

  // Add more reducers here if needed
});

export default rootReducer;
