import InvoiceModel from "../models/Invoice.model.js";

// Create invoice-
const createInvoice = async (req, res) => {
  try {
    const newInvoice = new InvoiceModel(req.body);
    await newInvoice.save();
    return res
      .status(201)
      .json({ message: "Invoice created successfully", newInvoice });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server errro while creating invoice",
    });
  }
};

// Get invoice by id
const getInvoiceById = async (req, res) => {
  const id = req.params.id;
  try {
    const invoice = await InvoiceModel.findById(id);
    return res.status(200).json({
      message: "Invoice fetched successfully",
      invoice,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error while getting invoice",
    });
  }
};
export default {
  createInvoice,
  getInvoiceById,
};
