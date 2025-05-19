import Order from "../models/order.js";

export const acceptOrder = (order) => {
    
}

export const getOrdersByStation = async (stationId) => {
    const orders = await Order.find({ stationId });

    return {
        totalOrders: orders.length,
        orders
    };
};