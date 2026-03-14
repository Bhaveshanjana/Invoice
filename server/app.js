import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectTodb from "./db.js";

const app = express();
dotenv.config();
connectTodb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export default app;
