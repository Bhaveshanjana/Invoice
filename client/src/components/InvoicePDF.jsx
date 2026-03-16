import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";

// Create the Tailwind config for react-pdf
const tw = createTw({
  theme: {
    fontFamily: {
      sans: ["Helvetica"],
      "ui-sans-serif": ["Helvetica"],
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
    : typeof terms === "string"
      ? terms.split("\n").filter((t) => t.trim())
      : [];

  return (
    <Document>
      <Page size="A4" style={tw("p-8 bg-white")}>
        {/* Header */}
        <View style={tw("flex flex-row justify-between items-start mb-8")}>
          <View>
            <Text style={tw("text-3xl font-bold text-violet-700 italic")}>
              Invoice
            </Text>
            <View style={tw("mt-4")}>
              <View style={tw("flex flex-row mb-1")}>
                <Text style={tw("text-xs text-gray-500 w-24")}>Invoice#</Text>
                <Text style={tw("text-xs font-bold text-gray-900")}>
                  {String(Header.invoiceNo || "—")}
                </Text>
              </View>
              <View style={tw("flex flex-row mb-1")}>
                <Text style={tw("text-xs text-gray-500 w-24")}>
                  Invoice Date
                </Text>
                <Text style={tw("text-xs font-bold text-gray-900")}>
                  {String(formatDate(Header.date) || "—")}
                </Text>
              </View>
              <View style={tw("flex flex-row mb-1")}>
                <Text style={tw("text-xs text-gray-500 w-24")}>Due Date</Text>
                <Text style={tw("text-xs font-bold text-gray-900")}>
                  {String(formatDate(Header.dueDate) || "—")}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Billed By & Billed To */}
        <View style={tw("flex flex-row mb-6")}>
          <View
            style={[
              tw("bg-gray-50 p-4 rounded-lg border border-gray-200"),
              { flex: 1, marginRight: 10 },
            ]}
          >
            <Text style={tw("text-xs font-bold text-violet-600 mb-2")}>
              Billed by
            </Text>
            <Text style={tw("text-sm font-bold text-gray-900")}>
              {String(Sender.name || "—")}
            </Text>
            <Text style={[tw("text-gray-600 mt-1"), { fontSize: 10 }]}>
              {String(Sender.address || "")}
            </Text>
            {Sender.GSTIN && (
              <Text style={[tw("text-gray-500 mt-2"), { fontSize: 10 }]}>
                GSTIN: {String(Sender.GSTIN)}
              </Text>
            )}
            {Sender.PAN && (
              <Text style={[tw("text-gray-500"), { fontSize: 10 }]}>
                PAN: {String(Sender.PAN)}
              </Text>
            )}
          </View>
          <View
            style={[
              tw("bg-gray-50 p-4 rounded-lg border border-gray-200"),
              { flex: 1, marginLeft: 10 },
            ]}
          >
            <Text style={tw("text-xs font-bold text-emerald-600 mb-2")}>
              Billed to
            </Text>
            <Text style={tw("text-sm font-bold text-gray-900")}>
              {String(Receiver.name || "—")}
            </Text>
            <Text style={[tw("text-gray-600 mt-1"), { fontSize: 10 }]}>
              {String(Receiver.address || "")}
            </Text>
            {Receiver.GSTIN && (
              <Text style={[tw("text-gray-500 mt-2"), { fontSize: 10 }]}>
                GSTIN: {String(Receiver.GSTIN)}
              </Text>
            )}
            {Receiver.PAN && (
              <Text style={[tw("text-gray-500"), { fontSize: 10 }]}>
                PAN: {String(Receiver.PAN)}
              </Text>
            )}
          </View>
        </View>

        {/* Place / Country of Supply */}
        <View style={tw("flex flex-row justify-between mb-4 pl-2 pr-2")}>
          {Sender.placeOfSupply && (
            <View style={tw("flex flex-row")}>
              <Text style={[tw("text-gray-500 mr-2"), { fontSize: 10 }]}>
                Place of Supply:
              </Text>
              <Text style={[tw("font-bold text-gray-800"), { fontSize: 10 }]}>
                {String(Sender.placeOfSupply)}
              </Text>
            </View>
          )}
          {Receiver.countryOfSupply && (
            <View style={tw("flex flex-row")}>
              <Text style={[tw("text-gray-500 mr-2"), { fontSize: 10 }]}>
                Country of Supply:
              </Text>
              <Text style={[tw("font-bold text-gray-800"), { fontSize: 10 }]}>
                {String(Receiver.countryOfSupply)}
              </Text>
            </View>
          )}
        </View>

        {/* Items Table */}
        <View style={tw("mb-8")}>
          {/* Table Header */}
          <View style={tw("flex flex-row bg-violet-600 p-2")}>
            <Text
              style={[tw("font-bold text-white"), { flex: 3, fontSize: 10 }]}
            >
              Item / Description
            </Text>
            <Text
              style={[
                tw("font-bold text-white text-center"),
                { flex: 1, fontSize: 10 },
              ]}
            >
              HSN
            </Text>
            <Text
              style={[
                tw("font-bold text-white text-center"),
                { flex: 0.5, fontSize: 10 },
              ]}
            >
              Qty
            </Text>
            <Text
              style={[
                tw("font-bold text-white text-right"),
                { flex: 1, fontSize: 10 },
              ]}
            >
              Taxable
            </Text>
            <Text
              style={[
                tw("font-bold text-white text-right"),
                { flex: 1, fontSize: 10 },
              ]}
            >
              Amount
            </Text>
          </View>
          {/* Table Rows */}
          {Items.map((item, index) => (
            <View
              key={index}
              style={tw(
                `flex flex-row p-2 border-b border-gray-200 ${index % 2 !== 0 ? "bg-gray-50" : "bg-white"}`,
              )}
            >
              <View style={[tw(""), { flex: 3 }]}>
                <Text style={[tw("font-bold"), { fontSize: 10 }]}>
                  <Text style={tw("text-gray-400 font-normal")}>
                    {index + 1}.{" "}
                  </Text>
                  {String(item.description || "—")}
                </Text>
              </View>
              <Text style={[tw("text-center"), { flex: 1, fontSize: 10 }]}>
                {String(item.hsn || "—")}
              </Text>
              <Text style={[tw("text-center"), { flex: 0.5, fontSize: 10 }]}>
                {String(item.qty || "0")}
              </Text>
              <Text style={[tw("text-right"), { flex: 1, fontSize: 10 }]}>
                {String(formatCurrency(item.taxableAmount))}
              </Text>
              <Text
                style={[tw("font-bold text-right"), { flex: 1, fontSize: 10 }]}
              >
                {String(formatCurrency(item.amount))}
              </Text>
            </View>
          ))}
        </View>

        {/* Bank & Totals side by side */}
        <View style={tw("flex flex-row mb-8")}>
          {/* Bank Details */}
          <View style={[tw(""), { flex: 1, marginRight: 10 }]}>
            <Text style={tw("text-xs font-bold text-violet-600 mb-2")}>
              Bank & Payment Details
            </Text>
            {Bank && (Bank.accountName || Bank.accountNumber) ? (
              <View>
                <View style={tw("flex flex-row mb-1")}>
                  <Text style={[tw("text-gray-500 w-20"), { fontSize: 10 }]}>
                    Name:
                  </Text>
                  <Text style={[tw("font-bold"), { flex: 1, fontSize: 10 }]}>
                    {String(Bank.accountName || "")}
                  </Text>
                </View>
                <View style={tw("flex flex-row mb-1")}>
                  <Text style={[tw("text-gray-500 w-20"), { fontSize: 10 }]}>
                    A/C Number:
                  </Text>
                  <Text style={[tw("font-bold"), { flex: 1, fontSize: 10 }]}>
                    {String(Bank.accountNumber || "")}
                  </Text>
                </View>
                <View style={tw("flex flex-row mb-1")}>
                  <Text style={[tw("text-gray-500 w-20"), { fontSize: 10 }]}>
                    IFSC:
                  </Text>
                  <Text style={[tw("font-bold"), { flex: 1, fontSize: 10 }]}>
                    {String(Bank.ifsc || "")}
                  </Text>
                </View>
                <View style={tw("flex flex-row mb-1")}>
                  <Text style={[tw("text-gray-500 w-20"), { fontSize: 10 }]}>
                    Bank:
                  </Text>
                  <Text style={[tw("font-bold"), { flex: 1, fontSize: 10 }]}>
                    {String(Bank.bank || "")}
                  </Text>
                </View>
              </View>
            ) : (
              <Text style={[tw("text-gray-400 italic"), { fontSize: 10 }]}>
                No bank details provided
              </Text>
            )}
          </View>

          {/* Totals */}
          <View style={[tw(""), { flex: 1, marginLeft: 10 }]}>
            <View>
              <View style={tw("flex flex-row justify-between mb-1")}>
                <Text style={[tw("text-gray-500"), { fontSize: 10 }]}>
                  Sub Total
                </Text>
                <Text style={[tw("font-bold"), { fontSize: 10 }]}>
                  {String(formatCurrency(Totals.subTotal))}
                </Text>
              </View>
              {Totals.discount > 0 && (
                <View style={tw("flex flex-row justify-between mb-1")}>
                  <Text style={[tw("text-emerald-600"), { fontSize: 10 }]}>
                    Discount
                  </Text>
                  <Text style={[tw("text-emerald-600"), { fontSize: 10 }]}>
                    - {String(formatCurrency(Totals.discount))}
                  </Text>
                </View>
              )}
              <View style={tw("flex flex-row justify-between mb-1")}>
                <Text style={[tw("text-gray-500"), { fontSize: 10 }]}>
                  Taxable Amount
                </Text>
                <Text style={[tw("font-bold"), { fontSize: 10 }]}>
                  {String(formatCurrency(Totals.taxableAmount))}
                </Text>
              </View>
              <View
                style={tw(
                  "border-t border-gray-300 pt-2 mt-2 flex flex-row justify-between items-center",
                )}
              >
                <Text style={tw("text-xs font-bold text-gray-900")}>Total</Text>
                <Text style={tw("text-sm font-bold text-violet-700")}>
                  {String(formatCurrency(Totals.total))}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Terms */}
        {termsArray.length > 0 && (
          <View style={tw("mb-6")}>
            <Text style={tw("text-xs font-bold text-violet-600 mb-1")}>
              Terms and Conditions
            </Text>
            <View>
              {termsArray.map((term, i) => (
                <Text
                  key={i}
                  style={[tw("text-gray-600 mb-1"), { fontSize: 10 }]}
                >
                  {i + 1}. {String(term || "")}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Additional Notes */}
        {additionalNotes && (
          <View style={tw("mb-6")}>
            <Text style={tw("text-xs font-bold text-violet-600 mb-1")}>
              Additional Notes
            </Text>
            <Text style={[tw("text-gray-600"), { fontSize: 10 }]}>
              {String(additionalNotes || "")}
            </Text>
          </View>
        )}

        {/* Footer */}
        <View style={tw("mt-auto border-t border-gray-200 pt-3")}>
          <Text style={[tw("text-gray-400 text-center"), { fontSize: 10 }]}>
            This is a computer generated invoice.
          </Text>
        </View>
      </Page>
    </Document>
  );
};
