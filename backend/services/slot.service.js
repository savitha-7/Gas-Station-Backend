import DailySlot from "../models/slot.js";

export const decreaseSlotQuantity = async (stationId, date, startTime, quantity) => {
    try {
        const daySlots = await DailySlot.findOne({ stationId, date });

        if (!daySlots) {
            throw new Error("No slots found for the given station and date");
        }

        const slot = daySlots.availableSlots.find(slot => slot.startTime === startTime);

        if (!slot) {
            throw new Error("Slot with given startTime not found");
        }

        if (slot.availableQuantity < quantity) {
            throw new Error("Insufficient quantity in the selected slot");
        }

        slot.capacity -= quantity;

        await daySlots.save();
        return slot;
    } catch (error) {
        console.error("Error in decreaseSlotQuantity:", error.message);
        throw error;
    }
};


export const resetSlotQuantity = async (stationId, date, startTime, quantity) => {
  try {
      console.log("resetSlotQuantity",stationId, date, startTime, quantity)
      const daySlots = await DailySlot.findOne({ stationId, date });

      if (!daySlots) {
          throw new Error("No slots found for the given station and date");
      }

      const slot = daySlots.availableSlots.find(slot => slot.startTime === startTime);

      if (!slot) {
          throw new Error("Slot with given startTime not found");
      }

      slot.capacity += quantity;

      await daySlots.save();
      return slot;
  } catch (error) {
      console.error("Error in increaseSlotQuantity:", error.message);
      throw error;
  }
};


export const createSlotsForStation = async ({ stationId, date, slots, defaultSlotQuantity }) => {
  if (!stationId || !date || !Array.isArray(slots) || slots.length === 0 || !defaultSlotQuantity) {
    throw new Error("stationId, date, non-empty slots array, and defaultSlotQuantity are required");
  }

  const existing = await DailySlot.findOne({ stationId, date });
  if (existing) {
    throw new Error("Slots already exist for this date");
  }

  const availableSlots = slots.map(slot => ({
    startTime: slot.startTime,
    availableQuantity: defaultSlotQuantity,
  }));

  const newDay = new DailySlot({
    stationId,
    date,
    availableSlots,
  });

  await newDay.save();
  return { message: "Slots created successfully", slots: newDay.availableSlots };
};
