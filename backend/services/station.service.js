import Station from "../models/gasStation.js"

export const updateStationQuantity = async (stationId, quantity) =>{
    try{
        const station = await Station.findOne({ _id: stationId });
        if (!station) throw new Error("Invalid Gas Station");

        let updateStationQuantity = station.quantity - quantity;
        
        if(updateStationQuantity < 0)
            throw new Error("Quantity not available in Stations");

        //updating in DB
        const updatedStation=await Station.updateOne({
            '_id':station._id,
        },{
            $set:{
                quantity: updateStationQuantity
            }
        });


        if(!updatedStation) throw new Error("Falied to Update the Quantity")
        return updatedStation;
    }
    catch(err){
        console.error("Error in decreaseSlotQuantity:", err.message);
        throw err;
    }
}

export const increaseStationQuantity = async (stationId, quantity) => {
    try {
      const station = await Station.findOne({ _id: stationId });
      if (!station) throw new Error("Invalid Gas Station");
  
      const newQuantity = station.quantity + quantity;
  
      const updatedStation = await Station.updateOne(
        { _id: stationId },
        { $set: { quantity: newQuantity } }
      );
  
      if (!updatedStation.modifiedCount) {
        throw new Error("Failed to update the quantity");
      }
  
      return updatedStation;
    } catch (err) {
      console.error("Error in increaseStationQuantity:", err.message);
      throw err;
    }
  };
  


export const updateStationQuantities = async (stationId, newPrice, newQuantity) => {
    try {


      const updatedStation = await Station.findByIdAndUpdate(
          stationId,
          {
              $set: { price: newPrice },
              $inc: { quantity: newQuantity }, 
          },
          { new: true }
      );
    
      if (!updatedStation) {
          throw new Error("Gas station not found");
      }

        return updatedStation;
    } catch (error) {
        throw new Error(`Failed to update station: ${error.message}`);
    }
};



export async function updateGasStationAllowedFields(stationId, updateData) {
  const allowedFields = ['name', 'email', 'phone', 'location'];

  const filteredData = {};
  allowedFields.forEach(field => {
    if (updateData[field] !== undefined) {
      filteredData[field] = updateData[field];
    }
  });

  const updatedStation = await Station.findByIdAndUpdate(
    {_id: stationId },
    { $set: filteredData },
    { new: true, runValidators: true }
  );

  return updatedStation;
}
