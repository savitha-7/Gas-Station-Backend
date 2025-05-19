import express from "express";
import { bookSlot, createSlots, getAvailableSlots, updateSingleSlot } from "../controllers/slot.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router
    .post('/', verifyToken,createSlots)           
    .get('/', getAvailableSlots)           
    .put('/', verifyToken,updateSingleSlot)            
    .post('/book', verifyToken,bookSlot);     
             

export default router;
