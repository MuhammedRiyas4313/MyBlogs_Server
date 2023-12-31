import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
dotenv.config();

import connectDB from "./db/dataBase.js";
connectDB();

import clientRoute from "./routes/router.js";

const app = express();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(morgan("dev"));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(
    cors({
        origin: ["https://myblogs-i56i.onrender.com", "https://my-blogs-client-eps.vercel.app"],
    })
);

app.use(express.static("public"));
app.use(cookieParser());

app.use("/", clientRoute);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
