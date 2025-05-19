import { fetchSupplierOrders } from "./orderSlice";

// Example action to fetch supplier orders
export const getSupplierOrders = (supplierId) => async (dispatch) => {
  try {
    await dispatch(fetchSupplierOrders(supplierId));
  } catch (error) {
    console.error("Error fetching supplier orders:", error);
  }
};