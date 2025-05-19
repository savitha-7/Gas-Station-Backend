import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
    pincode: {
        type: Number,
        required: true
    },
    cityName: {
        type: String,
        required: true
    }
}, { _id: false }); 


const gasStationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    location: {
        type: [locationSchema],
        required: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    isValid: {
        type: Boolean,
        default: true
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: {
        data: Buffer,
        contentType: String
    },
    rating: {
        type:Number,
        required:false,
    }

});

export default mongoose.model("GasStation", gasStationSchema);
