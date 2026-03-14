import express from "express";
import InvoiceController from "../controller/invoice.controller.js";

const router = express.Router();

router.post("/", InvoiceController.createInvoice);
router.get("/:id", InvoiceController.getInvoiceById);

export default router;
