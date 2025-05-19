import Razorpay from "razorpay";
import crypto from 'crypto';

export const initRazorpayOrder = async (amount) => {
    try {
        console.log("initOrder & amount: " + amount);

        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET,
        });

        const options = {
            amount: amount * 100, // amount in paise (smallest currency unit)
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`,
        };

        const order = await instance.orders.create(options);

        if (!order) {
            throw new Error("Failed to create Razorpay order");
        }

        return order;
    } catch (error) {
        console.error("Error creating Razorpay order:", error.message);
        throw error;
    }
};



export const verifyRazorpaySignature = ({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET);
    hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`);
    const generatedSignature = hmac.digest('hex');

    return generatedSignature === razorpaySignature;
};
