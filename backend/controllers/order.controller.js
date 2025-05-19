import Order from "../models/order.js";
import Station from "../models/gasStation.js"
import { initOrder } from "./payment.controller.js";


import { initRazorpayOrder,verifyRazorpaySignature } from "../services/payment.service.js";
import { updateStationQuantity } from "../services/station.service.js";
import { decreaseSlotQuantity, resetSlotQuantity } from "../services/slot.service.js";
import order from "../models/order.js";
import { stat } from "fs";


export const addOrder = async (req, res) => {
    const { address, price, quantity, method, stationId, slot } = req.body;
    const { userId } = req;
  
    try {
      if (userId === undefined) {
        return res.status(400).json({ message: "User ID is required" });
      }

    const slotDateTimeUTC = parseISTtoUTC(slot.date.split('T')[0], slot.startTime);
    const nowUTC = new Date();
    
    console.log("slotDateTimeUTC", slotDateTimeUTC);
    console.log("nowUTC", nowUTC);
    console.log("slotDateTimeUTC < nowUTC ?", slotDateTimeUTC < nowUTC);
    
    if (slotDateTimeUTC < nowUTC) {
      return res.status(400).json({ message: "Slot date and time cannot be in the past" });
    }
    
      let razorPayOrder = null;
      if (method.online) {
        razorPayOrder = await initRazorpayOrder(method.online.amount);
      }
  
      // 2. Update station quantity
      const stationUpdated = await updateStationQuantity(stationId, quantity);
      if (!stationUpdated) {
        return res.status(400).json({ message: "Insufficient station quantity" });
      }
  
      // 3. Decrease slot quantity
      const slotUpdated = await decreaseSlotQuantity(stationId, slot.date, slot.startTime, quantity);
      if (!slotUpdated) {
        return res.status(400).json({ message: "Slot unavailable or insufficient quantity" });
      }
  
      // 4. Create Order
      const order = await Order.create({
        address,
        price,
        quantity,
        method,
        userId,
        stationId,
        slot,
        isCanceled: { status: false },
        isAccepted: { status: false },
        isDelivered: { status: false },
        createdAt: new Date(),
      });
  
      res.status(201).json({ order, razorPayOrder });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  };
  

  function parseISTtoUTC(slotDate, slotStartTime) {
    const [hours, minutes] = slotStartTime.split(':').map(Number);
  
    const date = new Date(`${slotDate}T${slotStartTime}:00`);
  
    const utcTime = new Date(date.getTime() - (5.5 * 60 * 60 * 1000)); 
  
    return utcTime;
  }
  

export const getOrders = async (req, res) => {
    try {
        const { accepted, delivered, canceled } = req.query;
        const { userId, stationId } = req;

        console.log("User ID:", userId);
        console
        if (!userId && !stationId) {
            return res.status(400).json({ message: "Missing userId or stationId" });
        }

        const filter = {};

        if (userId) filter.userId = userId;
        if (stationId) filter.stationId = stationId;

        if (accepted !== undefined) {
            filter['isAccepted.status'] = accepted === 'true';
        }

        if (delivered !== undefined) {
            filter['isDelivered.status'] = delivered === 'true';
        }

        if (canceled !== undefined) {
            filter['isCanceled.status'] = canceled === 'true';
        }
        
        const ordersDoc = await Order.find(filter)
            .populate({ path: 'userId', select: '_id name' })
            .populate({ path: 'stationId', select: '_id name' });

        if (!ordersDoc || ordersDoc.length === 0) {
        return res.status(400).json({ msg: "No orders found" });
        }

        const orders = ordersDoc.map(doc => {
        const order = doc.toObject();
        order.user = order.userId;
        delete order.userId;

        order.station = order.stationId;
        delete order.stationId;

        return order;
    });

res.status(200).json({ orders });


    } catch (error) {
        res.status(400).json(error.message);
    }
};



export const verifyOrder = async (req, res) => {
    try {


        const { orderId } = req.params;
        const { userId } = req;

        console.log("User ID:", userId);
        console.log("Order ID:", orderId);
        console.log("Request Body:", req.body);

const order = await Order.findOne({ userId, _id: orderId })
            .populate({ path: 'userId', select: 'name' })       
            .populate({ path: 'stationId', select: 'name' }); 
      
        if (!order) {
            return res.status(400).json({ msg: "Invalid User or Order" });
        }

        const {
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
        } = req.body;

        const isSignatureValid = verifyRazorpaySignature({
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature
        });

        if (!isSignatureValid) {
            return res.status(400).json({ msg: "Transaction not legit!" });
        }


        order.method.online = {
            transactionID: razorpayPaymentId,
            status: "paid",
            amount:  order.price
        };

        await order.save();

        const OrderResponse = order.toObject();

        OrderResponse.user = OrderResponse.userId;
        delete OrderResponse.userId;

        OrderResponse.station = OrderResponse.stationId;
        delete OrderResponse.stationId;

        res.status(200).json({
            msg: "Success",
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
            OrderResponse
        });
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
};

export const acceptOrder = async (req, res) => {
    const { stationId } = req;
    const {orderId } = req.params;
    try{
        if(!stationId)
            res.status(403).json({ message : "Invalid Stations"});

        const order = await Order.findOne({ _id: orderId, stationId });

        if (!order) {
            return res.status(404).json({ message: "Order not found or access denied." });
        }

        if (order.isAccepted.status ) {
            return res.status(400).json({ message: "Order is already Accepted." });
        }
        if(order.isCanceled.status)
            return res.status(400).json({ message: "Order is already canceled." });

        order.isAccepted.status = true;
        order.isAccepted.acceptedAt = new Date(); 

        await order.save();
        return res.status(200).json({ message: "Accepted Order  Successfully "});

    } catch (error) {
        console.error("Cancel Order Error:", error);
        return res.status(500).json({ message: "Server error while canceling the order." })

    }

}

export const cancelOrder = async (req, res) => {
    const { userId, stationId } = req;
    const { orderId } = req.params;

    try {
        let order;

        if(!userId && !stationId)
            return res.json(400).status({message: "Invalid Id "});
        if(!orderId)
            return res.json(400).status({ message : "Invalid order ID"});

        if (userId) {
            order = await Order.findOne({ _id: orderId, userId });
        } else if (stationId) {
            order = await Order.findOne({ _id: orderId, stationId });
        }

        if (!order) {
            return res.status(404).json({ message: "Order not found or access denied." });
        }

        if (order.isCanceled.status) {
            return res.status(400).json({ message: "Order is already canceled." });
        }

        order.isCanceled = {
            status: true,
            message: userId ? "Canceled by user." : "Canceled by station.",
            canceledAt: new Date()
        };

        resetSlotQuantity(order.stationId ,order.slot.date ,order.slot.startTime ,order.quantity);

        await order.save();

        return res.status(200).json({ message: "Order canceled successfully.", order });
    } catch (error) {
        console.error("Cancel Order Error:", error);
        return res.status(500).json({ message: "Server error while canceling the order." });
    }
};

export const deliveryOrder = async (req,res) => {
    const { stationId } = req;
    const {orderId} = req.params;


    console.log(stationId +"user details "+orderId);
    try{
        if(!stationId)
            res.status(400).json({ message: "Invalid Station "});

        const order = await Order.findOne({ _id : orderId , stationId });

        if(!order){
            return res.status(404).json({ message: "Order not found or access denied." });
        }

        order.isDelivered = {
                status: true,
                message: "Delivered Successfully",
                deliveredAt: new Date()
        };

        await order.save();

        return res.status(200).json({message : "Order delivered status updated Successfully "});
    }
    catch(err){
        return res.status(500).json({ message: "Server error while canceling the order." });
    }
}