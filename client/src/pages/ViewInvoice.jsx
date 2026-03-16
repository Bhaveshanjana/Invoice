import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { usePDF } from "@react-pdf/renderer";
import axios from "axios";

import { InvoicePreview } from "@/components/InvoicePreview";
import { InvoicePDF } from "@/components/InvoicePDF";
import { ThemeToggle } from "@/components/theme-toggle";

import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Download,
  Loader2,
  Receipt,
  FileWarning,
  AlertCircle,
} from "lucide-react";

const ViewInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/invoices/${id}`);
        setInvoice(response.data.invoice);
      } catch (err) {
        console.error("Error fetching invoice:", err);
        setError("Failed to load invoice. Please check the URL and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  // Transform invoice data for preview
  const previewData = invoice ? {
    ...invoice,
    termsText: invoice.terms ? invoice.terms.join("\n") : "",
    additionalNotes: invoice.additionalNotes || "",
  } : null;

  // Use the PDF hook for better error tracking
  const [instance, updateInstance] = usePDF({ 
    document: previewData ? <InvoicePDF data={previewData} /> : <div /> 
  });

  useEffect(() => {
    if (previewData) {
      updateInstance();
    }
  }, [invoice]);

  useEffect(() => {
    if (instance.error) {
      console.error("PDF Generation Error:", instance.error);
    }
  }, [instance.error]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading invoice...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <div className="p-4 rounded-full bg-destructive/10">
            <FileWarning className="h-10 w-10 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold">Invoice Not Found</h2>
          <p className="text-muted-foreground max-w-md">
            {error || "The invoice you're looking for doesn't exist."}
          </p>
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="gap-2 mt-2 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Create Invoice
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md"
      >
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary">
                <Receipt className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold tracking-tight">InvoiceGen</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {instance.error ? (
              <span className="text-destructive flex items-center gap-1 text-xs">
                <AlertCircle className="h-3 w-3" />
                PDF Error
              </span>
            ) : (
              <Button 
                onClick={() => {
                  if (instance.url) {
                    const link = document.createElement('a');
                    link.href = instance.url;
                    link.download = `invoice-${id}.pdf`;
                    link.click();
                  }
                }}
                className="gap-2 cursor-pointer" 
                disabled={instance.loading || !instance.url}
              >
                {instance.loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {instance.loading ? "Preparing..." : "Download PDF"}
              </Button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </motion.header>

      {/* Invoice Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold tracking-tight">
            Invoice #{invoice.Header?.invoiceNo}
          </h2>
          <p className="text-muted-foreground mt-1">
            Your invoice has been generated successfully. Click "Download PDF"
            to save it.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg border overflow-hidden"
        >
          <InvoicePreview data={previewData} />
        </motion.div>
      </main>
    </div>
  );
};

export default ViewInvoice;
