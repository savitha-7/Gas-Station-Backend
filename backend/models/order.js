import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({
    address: {
        pinCode: { type: Number, required: true },
        cityName: { type: String, required: true },
        AddressLine: { type: String, required: true },
        state: { type: String, required: true },
    },
    price: { type: Number },
    quantity: { type: Number },

    method: {
        cash: { type: Number },
        online: {
            transactionID: { type: String },
            status: { type: String },
            amount: { type: Number }
        }
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    stationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "GasStation"
    },
    isCanceled: {
        status: { type: Boolean, default: false },
        message: { type: String },
        canceledAt: { type: Date }
    },
    isAccepted: {
        status: { type: Boolean, default: false },
        acceptedAt: { type: Date }
    },
    isDelivered: {
        status: { type: Boolean, default: false },
        message: { type: String },
        deliveredAt: { type: Date }
    },
    createdAt: { type: Date, default: Date.now },
    slot: {
        date: { type: Date, required: true },
        startTime: { type: String, required: true }
    }
});

export default mongoose.model("Order", orderSchema);
