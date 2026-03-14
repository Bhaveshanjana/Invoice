import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectTodb from "./db.js";

import invoiceRoute from "./routes/invoice.route.js";

connectTodb();
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/invoices", invoiceRoute);

export default app;
