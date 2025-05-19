import mongoose from "mongoose";

const timeSlotSchema = new mongoose.Schema({
  startTime: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    default: 0 
  }
}, { _id: false });

const dailySlotSchema = new mongoose.Schema({
  stationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GasStation",
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  availableSlots: [timeSlotSchema]
});

export default mongoose.model("DailySlot", dailySlotSchema);
