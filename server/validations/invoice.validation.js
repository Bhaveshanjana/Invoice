import { z } from "zod";

const itemSchema = z.object({
  description: z.string().min(1, "Item description is required"),
  hsn: z.string().optional(),
  qty: z.number().positive("Quantity must be positive"),
  gst: z.number().min(0).max(100),
  taxableAmount: z.number().min(0),
  cgst: z.number().min(0),
  sgst: z.number().min(0),
  amount: z.number().min(0),
});

export const invoiceValidationSchema = z.object({
  Header: z.object({
    invoiceNo: z.string().min(1, "Invoice number is required"),
    date: z.coerce.date(), // it converts "2024-03-14" string to a Date
    dueDate: z.coerce.date().optional(),
  }),
  Sender: z.object({
    name: z.string().min(1, "Sender name is required"),
    address: z.string().min(1, "Sender address is required"),
    GSTIN: z.string().optional(),
    PAN: z.string().optional(),
    placeOfSupply: z.string().optional(),
  }),
  Receiver: z.object({
    name: z.string().min(1, "Receiver name is required"),
    address: z.string().min(1, "Receiver address is required"),
    GSTIN: z.string().optional(),
    PAN: z.string().optional(),
    countryOfSupply: z.string().optional(),
  }),
  Items: z.array(itemSchema).min(1, "At least one item is required"),
  Totals: z.object({
    subTotal: z.number().min(0),
    discount: z.number().min(0).optional(),
    taxableAmount: z.number().min(0),
    cgst: z.number().min(0),
    sgst: z.number().min(0),
    total: z.number().min(0),
    earlyPayDiscount: z.number().min(0).optional(),
    earlyPayAmount: z.string().optional(),
  }),
  Bank: z
    .object({
      accountName: z.string().optional(),
      accountNumber: z.string().optional(),
      ifsc: z.string().optional(),
      accountType: z.string().optional(),
      bank: z.string().optional(),
      upi: z.string().optional(),
    })
    .optional(),
  terms: z.array(z.string()).optional(),
  additionalNotes: z.string().optional(),
});
