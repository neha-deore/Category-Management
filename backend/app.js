import express from "express";
import dotenv from "dotenv";
import cors from 'cors'
import productRoutes from './routes/productsRoutes.js'

const app = express();

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "config/config.env" });
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/products", productRoutes)


export default app;