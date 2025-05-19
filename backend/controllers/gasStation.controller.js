import GasStation from "../models/gasStation.js";
import { increaseStationQuantity,updateStationQuantities ,updateGasStationAllowedFields} from "../services/station.service.js";
import { createSlotsForStation } from "../services/slot.service.js";
import {getOrdersByStation} from '../services/order.service.js'


const isMissing = (field) => field === undefined || field === null || field === "";


export const getGasStations = async (req, res) => {
    let stations;
    try {
        stations = await GasStation.find({}).select('-password -image');
        if (!stations) {
            return res.status(400).json({ message: "Stations not found" })
        }


        const updatedStations = stations.map(station => {
            const stationObj = station.toObject();
            stationObj.imageUrl = `/api/seller/image/${station._id}`;
            return stationObj;
        });

        res.status(200).json({stations : updatedStations});
    } catch (error) {
        console.log(error,"err")
        res.status(400).json(error)
        
    }
}

export const getStationWithId = async (req, res) => {
    let station;
    try {
        station = await GasStation.findById(req.params.id).select('-password -image');

        if (!station) {
            return res.status(400).json({ message: "Station with that id does not exists" })
        }

        station = station.toObject();
        station.imageUrl = `/api/seller/image/${station._id}`;

        const { totalOrders, orders } = await getOrdersByStation(station._id);
        station.totalOrders = totalOrders;
        station.orders = orders;


        res.status(200).json(station);
    } catch (error) {
        res.status(400).json( {message: error.message})
    }
}


export const getGasStationByToken = async (req,res) =>{
    const { stationId, role } = req;
    try{
        if(role !== "station")
            res.status(403).json({ message : "Invalid GasStations"});

        let station = await GasStation.findOne({ _id : stationId }).select('-password -image');
        if (!station) {
            return res.status(400).json({ message: "Station does not exists" });
        }


        station = station.toObject();
        station.imageUrl = `/api/seller/image/${station._id}`;

        const { totalOrders, orders } = await getOrdersByStation(station._id);
        station.totalOrders = totalOrders;
        station.orders = orders;


        return res.status(200).json(station);
    }catch (error) {
        res.status(400).json({message: error.message});
    }
}

// export const updateFuel = async (req,res) =>{
//     const { quantity,date,slots } = req.body;  
//     const {stationId} = req;
//     try {

//             if (isMissing(stationId) || isMissing(date) || !Array.isArray(slots) || slots.length === 0)
//                 return res.status(400).json({ message: "stationId, date and non-empty slots array are required" });

//             if(quantity % slots.length != 0)
//                 return res.status(400).json({ message: "Cannot Fit Quanitity with number of slots"})

//             const updatedUser = increaseStationQuantity(stationId,quantity);
//             if(!updatedUser)
//                 return res.status(400).json({ message: "Updating Failure" })
            

//             const addSlots = await createSlotsForStation({
//                 stationId,
//                 date,
//                 slots,
//                 defaultSlotQuantity: quantity / slots.length
//               });

//               if(!addSlots)
//                 return res.status(400).json( {message:"Updating Slots Failed"});

//             return res.status(200).json({ message: "Updated Successfully" })
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: error.message }); 
//     }
// }




export const updateGasStationController = async (req, res) => {
    try {
      const {stationId,role} = req;
      const updateData = req.body;
  
      if(role !== "station")
        res.status(403).json({ message : "Invalid GasStations Token"});

      const updatedStation = await updateGasStationAllowedFields(stationId, updateData);
  
      if (!updatedStation) {
        return res.status(404).json({ message: 'Gas station not found' });
      }
  
      res.status(200).json({ message : "Updated Successfully."});
    } catch (error) {
      console.error('Error updating gas station:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const updateFuel = async (req, res) => {
    const { quantity, price } = req.body;
    const {stationId} = req

    if (!stationId) {
        return res.status(400).json({ message: 'Station ID is required.' });
    }

    if (quantity == null && price == null) {
        return res.status(400).json({ message: 'Quantity or Price is required.' });
    }

    try {
        const updatedStation = await updateStationQuantities(stationId, price, quantity);
        res.status(200).json({ message: 'Station updated successfully.', station: updatedStation });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Upload/Update Image
export const uploadGasStationImage = async (req, res) => {
    try {
        const {stationId} = req;
        const gasStation = await GasStation.findById(stationId);
        if (!gasStation) {
            return res.status(404).json({ message: 'Gas station not found' });
        }

        gasStation.image = {
            data: req.file.buffer,
            contentType: req.file.mimetype
        };

        await gasStation.save();

        res.json({
            message: 'Image uploaded successfully',
            imageUrl: `/image/${gasStation._id}`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getGasStationImage = async (req, res) => {
    try {
        const gasStation = await GasStation.findById(req.params.id);
        if (!gasStation || !gasStation.image?.data) {
            return res.status(404).send('Image not found');
        }

        res.set('Content-Type', gasStation.image.contentType);
        res.send(gasStation.image.data);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
