import express from "express";
import { addOrder, getOrders, cancelOrder, verifyOrder, deliveryOrder, acceptOrder } from "../controllers/order.controller.js";
import { verifyToken } from "../middleware/auth.js";
const router=express.Router();

router.route('/')
    .post(verifyToken,addOrder)
    .get(verifyToken,getOrders)
    
    router.route('/verify/:orderId')
    .post(verifyToken,verifyOrder);
    
    router.put('/:orderId/cancel', verifyToken, cancelOrder);
    router.put('/:orderId/deliver',verifyToken,deliveryOrder);
    router.put('/:orderId/accept',verifyToken, acceptOrder)


// router.get('/getOrderByFuelStationId/:id',getOrderByFuelStationId);
// router.get('/getOrderByUserId/:id',getOrderByUserId);


// router.put('/cancel',cancleOrder);
// router.put('/accept',acceptOrder);
// router.put('/deliever',deliveryOrder);

export default router;