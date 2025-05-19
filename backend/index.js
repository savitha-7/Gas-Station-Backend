import express from 'express';
import dotenv from 'dotenv'
import { connectDB } from "./database/db.js";
import userRoutes from './routes/user.routes.js';
import sellerRoutes from './routes/gasStationRoutes.js';
import orderRouter from './routes/order.routes.js'
import slotRouter from './routes/slot.Routes.js'
import  paymentRoute from './routes/payment.routes.js'
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';




const app = express();
app.use(express.json());
app.use(cors());



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/image', express.static(path.join(__dirname, 'uploads')));

dotenv.config();
connectDB();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello, world 1');
});

app.use('/api/user', userRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/order',orderRouter);
app.use('/api/slot',slotRouter);
app.use('/api/payment',paymentRoute);


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});