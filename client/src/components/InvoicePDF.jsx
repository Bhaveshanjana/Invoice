import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { createTw } from 'react-pdf-tailwind';

// Create the Tailwind config for react-pdf
const tw = createTw({
  theme: {
    fontFamily: {
      sans: ["Helvetica"],
    },
    extend: {
      colors: {
        violet: {
          600: "#7c3aed",
          700: "#6d28d9",
        },
        emerald: {
          600: "#059669",
        },
      },
    },
  },
});

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return "₹0";
  return `₹${Number(amount).toLocaleString("en-IN")}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

export const InvoicePDF = ({ data }) => {
  if (!data) return null;

  const {
    Header = {},
    Sender = {},
    Receiver = {},
    Items = [],
    Totals = {},
    Bank = {},
    terms = "",
    additionalNotes = "",
  } = data;

  const termsArray = Array.isArray(terms)
    ? terms.filter((t) => t.trim())
    : (typeof terms === "string" 
        ? terms.split("\n").filter((t) => t.trim())
        : []);

  return (
    <Document>
      <Page size="A4" style={tw("p-10 font-sans text-gray-900 bg-white")}>
        {/* Header */}
        <View style={tw("flex flex-row justify-between items-start mb-8")}>
          <View>
            <Text style={tw("text-3xl font-bold text-violet-700 italic")}>
              Invoice
            </Text>
            <View style={tw("mt-4 space-y-1")}>
              <View style={tw("flex flex-row gap-2")}>
                <Text style={tw("text-xs text-gray-500")}>Invoice#</Text>
                <Text style={tw("text-xs font-medium text-gray-900")}>
                  {String(Header.invoiceNo || "—")}
                </Text>
              </View>
              <View style={tw("flex flex-row gap-2")}>
                <Text style={tw("text-xs text-gray-500")}>Invoice Date</Text>
                <Text style={tw("text-xs font-medium text-gray-900")}>
                  {String(formatDate(Header.date) || "—")}
                </Text>
              </View>
              <View style={tw("flex flex-row gap-2")}>
                <Text style={tw("text-xs text-gray-500")}>Due Date</Text>
                <Text style={tw("text-xs font-medium text-gray-900")}>
                  {String(formatDate(Header.dueDate) || "—")}
                </Text>
              </View>
            </View>
          </View>
          <View style={tw("h-20 w-20 bg-gray-100 flex items-center justify-center border border-gray-200")}>
            <Text style={tw("text-[10px] text-gray-400")}>Logo</Text>
          </View>
        </View>

        {/* Billed By & Billed To */}
        <View style={tw("flex flex-row gap-6 mb-8")}>
          <View style={tw("flex-1 bg-gray-50 p-4 rounded-lg border border-gray-200")}>
            <Text style={tw("text-xs font-bold text-violet-600 mb-2")}>
              Billed by
            </Text>
            <Text style={tw("text-sm font-bold text-gray-900")}>{String(Sender.name || "—")}</Text>
            <Text style={tw("text-[10px] text-gray-600 mt-1")}>{String(Sender.address || "")}</Text>
            {Sender.GSTIN && (
              <Text style={tw("text-[10px] text-gray-500 mt-2")}>
                GSTIN: {String(Sender.GSTIN)}
              </Text>
            )}
            {Sender.PAN && (
              <Text style={tw("text-[10px] text-gray-500")}>
                PAN: {String(Sender.PAN)}
              </Text>
            )}
          </View>
          <View style={tw("flex-1 bg-gray-50 p-4 rounded-lg border border-gray-200")}>
            <Text style={tw("text-xs font-bold text-emerald-600 mb-2")}>
              Billed to
            </Text>
            <Text style={tw("text-sm font-bold text-gray-900")}>{String(Receiver.name || "—")}</Text>
            <Text style={tw("text-[10px] text-gray-600 mt-1")}>{String(Receiver.address || "")}</Text>
            {Receiver.GSTIN && (
              <Text style={tw("text-[10px] text-gray-500 mt-2")}>
                GSTIN: {String(Receiver.GSTIN)}
              </Text>
            )}
            {Receiver.PAN && (
              <Text style={tw("text-[10px] text-gray-500")}>
                PAN: {String(Receiver.PAN)}
              </Text>
            )}
          </View>
        </View>

        {/* Place / Country of Supply */}
        <View style={tw("flex flex-row justify-between mb-4 px-2")}>
          {Sender.placeOfSupply && (
            <View style={tw("flex flex-row gap-2")}>
              <Text style={tw("text-[10px] text-gray-500")}>Place of Supply:</Text>
              <Text style={tw("text-[10px] font-bold text-gray-800")}>{String(Sender.placeOfSupply)}</Text>
            </View>
          )}
          {Receiver.countryOfSupply && (
            <View style={tw("flex flex-row gap-2")}>
              <Text style={tw("text-[10px] text-gray-500")}>Country of Supply:</Text>
              <Text style={tw("text-[10px] font-bold text-gray-800")}>{String(Receiver.countryOfSupply)}</Text>
            </View>
          )}
        </View>

        {/* Items Table */}
        <View style={tw("mb-8")}>
          <View style={tw("flex flex-row bg-violet-600 p-2")}>
            <Text style={tw("flex-[3] text-[10px] font-bold text-white")}>Item / Description</Text>
            <Text style={tw("flex-[1] text-[10px] font-bold text-white text-center")}>HSN</Text>
            <Text style={tw("flex-[0.5] text-[10px] font-bold text-white text-center")}>Qty</Text>
            <Text style={tw("flex-[1] text-[10px] font-bold text-white text-right")}>Taxable</Text>
            <Text style={tw("flex-[1] text-[10px] font-bold text-white text-right")}>Amount</Text>
          </View>
          {Items.map((item, index) => (
            <View key={index} style={tw(`flex flex-row p-2 border-b border-gray-200 ${index % 2 !== 0 ? 'bg-gray-50' : ''}`)}>
              <View style={tw("flex-[3]")}>
                <Text style={tw("text-[10px]")}>
                  <Text style={tw("text-gray-400")}>{index + 1}. </Text>
                  {String(item.description || "—")}
                </Text>
              </View>
              <Text style={tw("flex-[1] text-[10px] text-center")}>{String(item.hsn || "—")}</Text>
              <Text style={tw("flex-[0.5] text-[10px] text-center")}>{String(item.qty || "0")}</Text>
              <Text style={tw("flex-[1] text-[10px] text-right")}>{String(formatCurrency(item.taxableAmount))}</Text>
              <Text style={tw("flex-[1] text-[10px] font-bold text-right")}>{String(formatCurrency(item.amount))}</Text>
            </View>
          ))}
        </View>

        {/* Bank & Totals side by side */}
        <View style={tw("flex flex-row gap-6 mb-8")}>
          {/* Bank Details */}
          <View style={tw("flex-1")}>
            <Text style={tw("text-xs font-bold text-violet-600 mb-3")}>
              Bank & Payment Details
            </Text>
            {Bank && (Bank.accountName || Bank.accountNumber) ? (
              <View style={tw("space-y-1")}>
                <View style={tw("flex flex-row")}>
                  <Text style={tw("w-24 text-[10px] text-gray-500")}>Name:</Text>
                  <Text style={tw("flex-1 text-[10px] font-bold")}>{String(Bank.accountName || "")}</Text>
                </View>
                <View style={tw("flex flex-row")}>
                  <Text style={tw("w-24 text-[10px] text-gray-500")}>A/C Number:</Text>
                  <Text style={tw("flex-1 text-[10px] font-bold")}>{String(Bank.accountNumber || "")}</Text>
                </View>
                <View style={tw("flex flex-row")}>
                  <Text style={tw("w-24 text-[10px] text-gray-500")}>IFSC:</Text>
                  <Text style={tw("flex-1 text-[10px] font-bold")}>{String(Bank.ifsc || "")}</Text>
                </View>
                <View style={tw("flex flex-row")}>
                  <Text style={tw("w-24 text-[10px] text-gray-500")}>Bank:</Text>
                  <Text style={tw("flex-1 text-[10px] font-bold")}>{String(Bank.bank || "")}</Text>
                </View>
              </View>
            ) : (
              <Text style={tw("text-[10px] text-gray-400 italic")}>No bank details provided</Text>
            )}
          </View>

          {/* Totals */}
          <View style={tw("flex-1")}>
            <View style={tw("space-y-2")}>
              <View style={tw("flex flex-row justify-between")}>
                <Text style={tw("text-[10px] text-gray-500")}>Sub Total</Text>
                <Text style={tw("text-[10px] font-bold")}>{String(formatCurrency(Totals.subTotal))}</Text>
              </View>
              {Totals.discount > 0 && (
                <View style={tw("flex flex-row justify-between")}>
                  <Text style={tw("text-[10px] text-emerald-600")}>Discount</Text>
                  <Text style={tw("text-[10px] text-emerald-600")}>- {String(formatCurrency(Totals.discount))}</Text>
                </View>
              )}
              <View style={tw("flex flex-row justify-between")}>
                <Text style={tw("text-[10px] text-gray-500")}>Taxable Amount</Text>
                <Text style={tw("text-[10px] font-bold")}>{String(formatCurrency(Totals.taxableAmount))}</Text>
              </View>
              <View style={tw("border-t border-gray-300 pt-2 flex flex-row justify-between items-center")}>
                <Text style={tw("text-sm font-bold text-gray-900")}>Total</Text>
                <Text style={tw("text-lg font-bold text-violet-700")}>{String(formatCurrency(Totals.total))}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Terms */}
        {termsArray.length > 0 && (
          <View style={tw("mb-8")}>
            <Text style={tw("text-xs font-bold text-violet-600 mb-2")}>
              Terms and Conditions
            </Text>
            <View style={tw("space-y-1")}>
              {termsArray.map((term, i) => (
                <Text key={i} style={tw("text-[10px] text-gray-600")}>{i + 1}. {String(term || "")}</Text>
              ))}
            </View>
          </View>
        )}

        {/* Additional Notes */}
        {additionalNotes && (
          <View style={tw("mb-8")}>
            <Text style={tw("text-xs font-bold text-violet-600 mb-2")}>
              Additional Notes
            </Text>
            <Text style={tw("text-[10px] text-gray-600")}>{String(additionalNotes || "")}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={tw("mt-auto border-t border-gray-200 pt-4")}>
          <Text style={tw("text-[10px] text-gray-400 text-center")}>
            This is a computer generated invoice.
          </Text>
        </View>
      </Page>
    </Document>
  );
};
