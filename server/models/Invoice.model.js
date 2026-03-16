import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  Header: {
    invoiceNo: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dueDate: {
      type: Date,
    },
  },
  Sender: {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    GSTIN: {
      type: String,
    },
    PAN: {
      type: String,
    },
    placeOfSupply: {
      type: String,
    },
  },
  Receiver: {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    GSTIN: {
      type: String,
    },
    PAN: {
      type: String,
    },
    countryOfSupply: {
      type: String,
    },
  },
  Items: [
    {
      description: {
        type: String,
      },
      hsn: {
        type: String,
      },
      qty: {
        type: Number,
      },
      gst: {
        type: Number,
      },
      taxableAmount: {
        type: Number,
      },
      cgst: {
        type: Number,
      },
      sgst: {
        type: Number,
      },
      amount: {
        type: Number,
      },
    },
  ],
  Totals: {
    subTotal: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    taxableAmount: {
      type: Number,
    },
    cgst: {
      type: Number,
    },
    sgst: {
      type: Number,
    },
    total: {
      type: Number,
    },
    earlyPayDiscount: {
      type: Number,
    },
    earlyPayAmount: {
      type: String,
    },
  },
  Bank: {
    accountName: {
      type: String,
    },
    accountNumber: {
      type: String,
    },
    ifsc: {
      type: String,
    },
    accountType: {
      type: String,
    },
    bank: {
      type: String,
    },
    upi: {
      type: String,
    },
  },
  terms: [
    {
      type: String,
    },
  ],
  additionalNotes: {
    type: String,
  },
});

const invoiceModel = mongoose.model("Invoice", invoiceSchema);
export default invoiceModel;
