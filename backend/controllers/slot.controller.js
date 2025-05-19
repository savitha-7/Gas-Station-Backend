import gasStation from "../models/gasStation.js";
import DailySlot from "../models/slot.js";

const isMissing = (field) => field === undefined || field === null || field === "";

export const createSlots = async (req, res) => {
  const { date, slots, capacity } = req.body;
  const {stationId} = req;
  

  if (isMissing(stationId) || isMissing(date) || !Array.isArray(slots) || slots.length === 0) {
    return res.status(400).json({ message: "stationId, date and non-empty slots array are required" });
  }

  try {
    const existing = await DailySlot.findOne({ stationId, date });
    if (existing) {
      return res.status(409).json({ message: "Slots already exist for this date" });
    }

    const newDay = new DailySlot({
      stationId,
      date,
      availableSlots: slots,
    });

    await newDay.save();
    res.status(201).json({ message: "Slots created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const updateSingleSlot = async (req, res) => {
  const {  date, startTime, updatedFields } = req.body;
  const {stationId} = req;


  if (isMissing(stationId) || isMissing(date) || isMissing(startTime) || typeof updatedFields !== 'object') {
    return res.status(400).json({ message: "stationId, date, startTime, and updatedFields are required" });
  }

  if(updatedFields.availableQuantity == null)
    return res.status(400).json({message:"availbleQuantity is Required"});
  try {
    const daySlots = await DailySlot.findOne({ stationId, date });

    if (!daySlots) {
      return res.status(404).json({ message: "No slots found for this station on this date" });
    }

    const slotIndex = daySlots.availableSlots.findIndex(slot => slot.startTime === startTime);

    if (slotIndex === -1) {
      return res.status(404).json({ message: "Slot with given startTime not found" });
    }
    
    daySlots.availableSlots[slotIndex].availableQuantity = updatedFields.availableQuantity;


    await daySlots.save();

    res.status(200).json({ message: "Slot updated successfully", slot: daySlots.availableSlots[slotIndex] });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const getAvailableSlots = async (req, res) => {
  const { stationId, date } = req.query;

  if (isMissing(stationId) || isMissing(date)) {
    return res.status(400).json({ message: "stationId and date query parameters are required" });
  }

  try {
    const daySlots = await DailySlot.findOne({ stationId, date });

    if (!daySlots) {
      return res.status(404).json({ message: "No slots found for this day" });
    }

    res.status(200).json({
      status: "success",
      message: "Available slots for the day",
      date: daySlots.date,
      availableSlots: daySlots.availableSlots
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const bookSlot = async (req, res) => {
  const { stationId, date, startTime } = req.body;

  if (isMissing(stationId) || isMissing(date) || isMissing(startTime) || typeof quantity !== "number" || quantity <= 0) {
    return res.status(400).json({ message: "stationId, date, startTime, and a positive quantity are required" });
  }

  try {
    const day = await DailySlot.findOne({ stationId, date });
    if (!day) return res.status(404).json({ message: "No slots for the given day" });

    const slot = day.availableSlots.find(s => s.startTime === startTime);

    if (!slot) {
      return res.status(404).json({ message: "Slot with given startTime not found" });
    }

    if (slot.availableQuantity < 1) {
      return res.status(400).json({ message: "Slot not available or insufficient quantity" });
    }
    updateStationQuantity(stationId,res);

    slot.availableQuantity -= 1;

    await day.save();

    res.status(200).json({ message: "Slot booked successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


const updateStationQuantity =async(res,stationId) => {
    const station = gasStation.find({_id:stationId});

    if(station.quantity <1 )
        return res.status(400).json({ message: "Slot not available or insufficient quantity" });

    station.quantity -=1;
    station.save();
}