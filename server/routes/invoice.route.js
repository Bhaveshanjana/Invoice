import express from "express";
import InvoiceController from "../controller/invoice.controller.js";
import validate from "../middlewares/validation.middlewares.js";
import { invoiceValidationSchema } from "../validations/invoice.validation.js";

const router = express.Router();

router.post(
  "/",
  validate(invoiceValidationSchema),
  InvoiceController.createInvoice,
);
router.get("/:id", InvoiceController.getInvoiceById);

export default router;
