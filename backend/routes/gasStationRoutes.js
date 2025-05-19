import express from "express";
import { registerSeller,sellerLogin } from '../controllers/auth.controller.js';
import { getGasStations,getStationWithId, updateFuel,uploadGasStationImage,getGasStationImage , getGasStationByToken, updateGasStationController} from "../controllers/gasStation.controller.js";
import { verifyToken } from "../middleware/auth.js";
import upload from '../middleware/upload.js';

// import { verifyToken } from "../middleware/auth.js";

const router=express.Router();

router.post('/register',registerSeller);
router.post('/login',sellerLogin)
// router.put('/changePassword',changePassword);
// router.put('/updateFuel',updateFuel);
router.get('/',getGasStations);
router.put('/update',verifyToken,updateGasStationController);
router.get('/me',verifyToken,getGasStationByToken);
router.put('/',verifyToken,updateFuel);
router.get('/:id',getStationWithId);

router.put('/image', verifyToken, upload.single('image'), uploadGasStationImage);
router.get('/image/:id', getGasStationImage);

export default router;