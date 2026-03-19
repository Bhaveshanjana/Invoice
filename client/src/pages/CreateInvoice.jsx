import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import { ThemeToggle } from "@/components/theme-toggle";
import { InvoicePreview } from "@/components/InvoicePreview";
import { invoiceFormSchema, getDefaultValues } from "@/lib/invoice-schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  FileText,
  Plus,
  Trash2,
  Eye,
  Send,
  Building2,
  User,
  Package,
  Landmark,
  ScrollText,
  Receipt,
  Loader2,
} from "lucide-react";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20, height: 0 },
  visible: { opacity: 1, x: 0, height: "auto", transition: { duration: 0.3 } },
  exit: { opacity: 0, x: 20, height: 0, transition: { duration: 0.2 } },
};

const CreateInvoice = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: getDefaultValues(),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "Items",
  });

  const watchedValues = watch();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const formattedData = {
      ...data,
      terms:
        typeof data.terms === "string"
          ? data.terms.split("\n").filter((t) => t.trim())
          : data.terms,
    };
    if (formattedData.Header.dueDate === "") {
      formattedData.Header.dueDate = undefined; // or delete formattedData.Header.dueDate;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/invoices`,
        formattedData,
      );
      const invoiceId = response.data.newInvoice._id;
      navigate(`/invoice/${invoiceId}`);
    } catch (error) {
      console.error("Error creating invoice:", error);
      alert("Failed to create invoice. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addNewItem = () => {
    append({
      description: "",
      hsn: "",
      qty: 1,
      gst: 0,
      taxableAmount: 0,
      sgst: 0,
      cgst: 0,
      amount: 0,
    });
  };

  const renderFieldError = (fieldPath) => {
    const parts = fieldPath.split(".");
    let error = errors;
    for (const part of parts) {
      if (error && error[part]) {
        error = error[part];
      } else {
        return null;
      }
    }
    if (error?.message) {
      return <p className="text-sm text-destructive mt-1">{error.message}</p>;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md"
      >
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight">InvoiceGen</h1>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 cursor-pointer"
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] md:max-w-[50vw] h-[95vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Invoice Preview</DialogTitle>
                </DialogHeader>
                <div className="bg-white rounded-lg p-2">
                  <InvoicePreview data={watchedValues} />
                </div>
              </DialogContent>
            </Dialog>
            <ThemeToggle />
          </div>
        </div>
      </motion.header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight">
              Create Invoice
            </h2>
            <p className="text-muted-foreground mt-1">
              Fill in the details below to generate your invoice
            </p>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Accordion
            type="multiple"
            defaultValue={[
              "header",
              "sender",
              "receiver",
              "items",
              "totals",
              "bank",
              "terms",
            ]}
            className="space-y-4"
          >
            {/* === Invoice Header === */}
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
            >
              <AccordionItem
                value="header"
                className="border rounded-lg overflow-hidden bg-card"
              >
                <AccordionTrigger className="px-6 py-4 hover:cursor-pointer hover:no-underline hover:bg-muted/50 [&[data-state=open]]:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-blue-500/10">
                      <FileText className="h-4 w-4 text-blue-500" />
                    </div>
                    <span className="font-semibold">Invoice Details</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="invoiceNo">Invoice Number *</Label>
                      <Input
                        id="invoiceNo"
                        placeholder="INV-001"
                        {...register("Header.invoiceNo")}
                      />
                      {renderFieldError("Header.invoiceNo")}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Invoice Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        {...register("Header.date")}
                      />
                      {renderFieldError("Header.date")}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        {...register("Header.dueDate")}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </motion.div>

            {/* === Billed By (Sender) === */}
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.15 }}
            >
              <AccordionItem
                value="sender"
                className="border rounded-lg overflow-hidden bg-card"
              >
                <AccordionTrigger className="px-6 py-4 cursor-pointer hover:no-underline hover:bg-muted/50 [&[data-state=open]]:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-emerald-500/10">
                      <Building2 className="h-4 w-4 text-emerald-500" />
                    </div>
                    <span className="font-semibold">Billed By (Sender)</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="senderName">Company Name *</Label>
                      <Input
                        id="senderName"
                        placeholder="Your Company Name"
                        {...register("Sender.name")}
                      />
                      {renderFieldError("Sender.name")}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="senderAddress">Address *</Label>
                      <Input
                        id="senderAddress"
                        placeholder="Street, City, State - Pincode"
                        {...register("Sender.address")}
                      />
                      {renderFieldError("Sender.address")}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="senderGSTIN">GSTIN</Label>
                      <Input
                        id="senderGSTIN"
                        placeholder="29ABCED1234F2Z5"
                        {...register("Sender.GSTIN")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="senderPAN">PAN</Label>
                      <Input
                        id="senderPAN"
                        placeholder="ABCED1234F"
                        {...register("Sender.PAN")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="placeOfSupply">Place of Supply</Label>
                      <Input
                        id="placeOfSupply"
                        placeholder="e.g., Karnataka"
                        {...register("Sender.placeOfSupply")}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </motion.div>

            {/* === Billed To (Receiver) === */}
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              <AccordionItem
                value="receiver"
                className="border rounded-lg overflow-hidden bg-card"
              >
                <AccordionTrigger className="px-6 py-4 cursor-pointer hover:no-underline hover:bg-muted/50 [&[data-state=open]]:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-violet-500/10">
                      <User className="h-4 w-4 text-violet-500" />
                    </div>
                    <span className="font-semibold">Billed To (Client)</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="receiverName">Client Name *</Label>
                      <Input
                        id="receiverName"
                        placeholder="Client Name"
                        {...register("Receiver.name")}
                      />
                      {renderFieldError("Receiver.name")}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="receiverAddress">Address *</Label>
                      <Input
                        id="receiverAddress"
                        placeholder="Street, City, State - Pincode"
                        {...register("Receiver.address")}
                      />
                      {renderFieldError("Receiver.address")}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="receiverGSTIN">GSTIN</Label>
                      <Input
                        id="receiverGSTIN"
                        placeholder="29VGCED1234K2Z6"
                        {...register("Receiver.GSTIN")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="receiverPAN">PAN</Label>
                      <Input
                        id="receiverPAN"
                        placeholder="VGCED1234K"
                        {...register("Receiver.PAN")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="countryOfSupply">Country of Supply</Label>
                      <Input
                        id="countryOfSupply"
                        placeholder="e.g., India"
                        {...register("Receiver.countryOfSupply")}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </motion.div>

            {/* === Items === */}
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.25 }}
            >
              <AccordionItem
                value="items"
                className="border rounded-lg overflow-hidden bg-card"
              >
                <AccordionTrigger className="px-6 py-4 cursor-pointer hover:no-underline hover:bg-muted/50 [&[data-state=open]]:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-orange-500/10">
                      <Package className="h-4 w-4 text-orange-500" />
                    </div>
                    <span className="font-semibold">Invoice Items</span>
                    {fields.length > 0 && (
                      <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {fields.length} item{fields.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  {errors.Items?.message && (
                    <p className="text-sm text-destructive mb-4">
                      {errors.Items.message}
                    </p>
                  )}
                  <AnimatePresence mode="popLayout">
                    {fields.map((field, index) => (
                      <motion.div
                        key={field.id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                      >
                        <Card className="mb-4 border-dashed mt-4">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-sm font-medium text-muted-foreground">
                                Item #{index + 1}
                              </CardTitle>
                              {fields.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                                  onClick={() => remove(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              <div className="col-span-2 space-y-2">
                                <Label>Description *</Label>
                                <Input
                                  placeholder="Item description"
                                  {...register(`Items.${index}.description`)}
                                />
                                {renderFieldError(`Items.${index}.description`)}
                              </div>
                              <div className="space-y-2">
                                <Label>HSN</Label>
                                <Input
                                  placeholder="HSN Code"
                                  {...register(`Items.${index}.hsn`)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Qty *</Label>
                                <Input
                                  type="number"
                                  placeholder="1"
                                  {...register(`Items.${index}.qty`, {
                                    valueAsNumber: true,
                                  })}
                                />
                                {renderFieldError(`Items.${index}.qty`)}
                              </div>
                              <div className="space-y-2">
                                <Label>GST %</Label>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  {...register(`Items.${index}.gst`, {
                                    valueAsNumber: true,
                                  })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Taxable Amount</Label>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  {...register(`Items.${index}.taxableAmount`, {
                                    valueAsNumber: true,
                                  })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>SGST</Label>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  {...register(`Items.${index}.sgst`, {
                                    valueAsNumber: true,
                                  })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>CGST</Label>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  {...register(`Items.${index}.cgst`, {
                                    valueAsNumber: true,
                                  })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Amount</Label>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  {...register(`Items.${index}.amount`, {
                                    valueAsNumber: true,
                                  })}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-dashed gap-2 cursor-pointer"
                    onClick={addNewItem}
                  >
                    <Plus className="h-4 w-4" />
                    Add Item
                  </Button>
                </AccordionContent>
              </AccordionItem>
            </motion.div>

            {/* === Totals === */}
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
            >
              <AccordionItem
                value="totals"
                className="border rounded-lg overflow-hidden bg-card"
              >
                <AccordionTrigger className="px-6 py-4 cursor-pointer hover:no-underline hover:bg-muted/50 [&[data-state=open]]:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-pink-500/10">
                      <Receipt className="h-4 w-4 text-pink-500" />
                    </div>
                    <span className="font-semibold">Totals & Discounts</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="subTotal">Sub Total *</Label>
                      <Input
                        id="subTotal"
                        type="number"
                        placeholder="0"
                        {...register("Totals.subTotal", {
                          valueAsNumber: true,
                        })}
                      />
                      {renderFieldError("Totals.subTotal")}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discount">Discount</Label>
                      <Input
                        id="discount"
                        type="number"
                        placeholder="0"
                        {...register("Totals.discount", {
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxableAmount">Taxable Amount *</Label>
                      <Input
                        id="taxableAmount"
                        type="number"
                        placeholder="0"
                        {...register("Totals.taxableAmount", {
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="totalCgst">CGST</Label>
                      <Input
                        id="totalCgst"
                        type="number"
                        placeholder="0"
                        {...register("Totals.cgst", { valueAsNumber: true })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="totalSgst">SGST</Label>
                      <Input
                        id="totalSgst"
                        type="number"
                        placeholder="0"
                        {...register("Totals.sgst", { valueAsNumber: true })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="total">Total *</Label>
                      <Input
                        id="total"
                        type="number"
                        placeholder="0"
                        {...register("Totals.total", { valueAsNumber: true })}
                      />
                      {renderFieldError("Totals.total")}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="earlyPayDiscount">
                        EarlyPay Discount
                      </Label>
                      <Input
                        id="earlyPayDiscount"
                        type="number"
                        placeholder="0"
                        {...register("Totals.earlyPayDiscount", {
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="earlyPayAmount">EarlyPay Amount</Label>
                      <Input
                        id="earlyPayAmount"
                        placeholder="e.g., ₹42,280"
                        {...register("Totals.earlyPayAmount")}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </motion.div>

            {/* === Bank Details === */}
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.35 }}
            >
              <AccordionItem
                value="bank"
                className="border rounded-lg overflow-hidden bg-card"
              >
                <AccordionTrigger className="px-6 py-4 cursor-pointer hover:no-underline hover:bg-muted/50 [&[data-state=open]]:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-cyan-500/10">
                      <Landmark className="h-4 w-4 text-cyan-500" />
                    </div>
                    <span className="font-semibold">
                      Bank & Payment Details
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="accountName">Account Holder Name</Label>
                      <Input
                        id="accountName"
                        placeholder="Account Holder Name"
                        {...register("Bank.accountName")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        placeholder="45366287987"
                        {...register("Bank.accountNumber")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ifsc">IFSC Code</Label>
                      <Input
                        id="ifsc"
                        placeholder="HDFC0018159"
                        {...register("Bank.ifsc")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountType">Account Type</Label>
                      <Input
                        id="accountType"
                        placeholder="Savings / Current"
                        {...register("Bank.accountType")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        placeholder="HDFC Bank"
                        {...register("Bank.bank")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="upi">UPI ID</Label>
                      <Input
                        id="upi"
                        placeholder="yourname@upi"
                        {...register("Bank.upi")}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </motion.div>

            {/* === Terms & Notes === */}
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
            >
              <AccordionItem
                value="terms"
                className="border rounded-lg overflow-hidden bg-card"
              >
                <AccordionTrigger className="px-6 py-4 cursor-pointer hover:no-underline hover:bg-muted/50 [&[data-state=open]]:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-amber-500/10">
                      <ScrollText className="h-4 w-4 text-amber-500" />
                    </div>
                    <span className="font-semibold">
                      Terms & Additional Notes
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 mt-4">
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="terms">
                        Terms and Conditions
                        <span className="text-muted-foreground text-xs ml-2">
                          (separate each term with a new line)
                        </span>
                      </Label>
                      <Textarea
                        id="terms"
                        placeholder="Please pay within 15 days from the date of invoice..."
                        rows={4}
                        {...register("terms")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="additionalNotes">Additional Notes</Label>
                      <Textarea
                        id="additionalNotes"
                        placeholder="Any additional notes for the client..."
                        rows={3}
                        {...register("additionalNotes")}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          </Accordion>

          {/* Submit */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.45 }}
            className="flex gap-3 justify-end pt-4 pb-12"
          >
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2 cursor-pointer"
                >
                  <Eye className="h-4 w-4" />
                  Preview Invoice
                </Button>
              </DialogTrigger>
            </Dialog>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-2 min-w-[160px] cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Generate Invoice
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </main>
    </div>
  );
};

export default CreateInvoice;
