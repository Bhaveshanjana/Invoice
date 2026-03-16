import { z } from "zod";

const itemSchema = z.object({
  description: z.string().min(1, "Item description is required"),
  hsn: z.string().optional().default(""),
  qty: z.number({ invalid_type_error: "Qty must be a number" }).positive("Quantity must be positive"),
  gst: z.number({ invalid_type_error: "GST must be a number" }).min(0).max(100).default(0),
  taxableAmount: z.number({ invalid_type_error: "Must be a number" }).min(0).default(0),
  cgst: z.number({ invalid_type_error: "Must be a number" }).min(0).default(0),
  sgst: z.number({ invalid_type_error: "Must be a number" }).min(0).default(0),
  amount: z.number({ invalid_type_error: "Must be a number" }).min(0).default(0),
});

export const invoiceFormSchema = z.object({
  Header: z.object({
    invoiceNo: z.string().min(1, "Invoice number is required"),
    date: z.string().min(1, "Date is required"),
    dueDate: z.string().optional().default(""),
  }),
  Sender: z.object({
    name: z.string().min(1, "Sender name is required"),
    address: z.string().min(1, "Sender address is required"),
    GSTIN: z.string().optional().default(""),
    PAN: z.string().optional().default(""),
    placeOfSupply: z.string().optional().default(""),
  }),
  Receiver: z.object({
    name: z.string().min(1, "Receiver name is required"),
    address: z.string().min(1, "Receiver address is required"),
    GSTIN: z.string().optional().default(""),
    PAN: z.string().optional().default(""),
    countryOfSupply: z.string().optional().default(""),
  }),
  Items: z.array(itemSchema).min(1, "At least one item is required"),
  Totals: z.object({
    subTotal: z.number({ invalid_type_error: "Must be a number" }).min(0).default(0),
    discount: z.number({ invalid_type_error: "Must be a number" }).min(0).optional().default(0),
    taxableAmount: z.number({ invalid_type_error: "Must be a number" }).min(0).default(0),
    cgst: z.number({ invalid_type_error: "Must be a number" }).min(0).default(0),
    sgst: z.number({ invalid_type_error: "Must be a number" }).min(0).default(0),
    total: z.number({ invalid_type_error: "Must be a number" }).min(0).default(0),
    earlyPayDiscount: z.number({ invalid_type_error: "Must be a number" }).min(0).optional().default(0),
    earlyPayAmount: z.string().optional().default(""),
  }),
  Bank: z
    .object({
      accountName: z.string().optional().default(""),
      accountNumber: z.string().optional().default(""),
      ifsc: z.string().optional().default(""),
      accountType: z.string().optional().default(""),
      bank: z.string().optional().default(""),
      upi: z.string().optional().default(""),
    })
    .optional(),
   terms: z.string().optional().default(""),
  additionalNotes: z.string().optional().default(""),
});

export const getDefaultValues = () => ({
  Header: {
    invoiceNo: "",
    date: new Date().toISOString().split("T")[0],
    dueDate: "",
  },
  Sender: {
    name: "",
    address: "",
    GSTIN: "",
    PAN: "",
    placeOfSupply: "",
  },
  Receiver: {
    name: "",
    address: "",
    GSTIN: "",
    PAN: "",
    countryOfSupply: "",
  },
  Items: [
    {
      description: "",
      hsn: "",
      qty: 1,
      gst: 0,
      taxableAmount: 0,
      sgst: 0,
      cgst: 0,
      amount: 0,
    },
  ],
  Totals: {
    subTotal: 0,
    discount: 0,
    taxableAmount: 0,
    cgst: 0,
    sgst: 0,
    total: 0,
    earlyPayDiscount: 0,
    earlyPayAmount: "",
  },
  Bank: {
    accountName: "",
    accountNumber: "",
    ifsc: "",
    accountType: "",
    bank: "",
    upi: "",
  },
  terms: "",
  additionalNotes: "",
});
