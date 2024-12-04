import express from "express";
import dotenv from "dotenv";
import databaseConnection from "./config/database.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import cors from 'cors'


dotenv.config({
    path: ".env",
});

databaseConnection();
const app = express();

app.use(cors());

// middlewares

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// api

app.use("/api", userRoute);

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
