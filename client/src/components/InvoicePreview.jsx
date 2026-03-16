
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

export function InvoicePreview({ data }) {
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
    ? terms.filter((t) => t.trim()) // If it's already an array, just filter empty lines
    : (typeof terms === "string" 
        ? terms.split("\n").filter((t) => t.trim()) // If it's a string, split it
        : []);

  return (
    <div
      className="bg-white text-gray-900 p-8 max-w-[800px] mx-auto font-sans text-[13px] leading-relaxed"
      id="invoice-preview"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-violet-700 italic">
            Invoice
          </h1>
          <div className="mt-3 space-y-1 text-sm text-gray-600">
            <div className="flex gap-2">
              <span className="text-gray-500">Invoice#</span>
              <span className="font-medium text-gray-900">
                {Header.invoiceNo || "—"}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-500">Invoice Date</span>
              <span className="font-medium text-gray-900">
                {formatDate(Header.date)}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-500">Due Date</span>
              <span className="font-medium text-gray-900">
                {formatDate(Header.dueDate)}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="w-20 h-20 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <span className="text-xs text-gray-400 text-center">Logo</span>
          </div>
        </div>
      </div>

      {/* Billed By & Billed To */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="text-sm font-semibold text-violet-600 mb-2">
            Billed by
          </h3>
          <p className="font-semibold text-gray-900">{Sender.name || "—"}</p>
          <p className="text-gray-600 text-xs mt-1">{Sender.address}</p>
          {Sender.GSTIN && (
            <p className="text-xs text-gray-500 mt-2">
              <span className="font-medium">GSTIN</span> {Sender.GSTIN}
            </p>
          )}
          {Sender.PAN && (
            <p className="text-xs text-gray-500">
              <span className="font-medium">PAN</span> {Sender.PAN}
            </p>
          )}
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="text-sm font-semibold text-emerald-600 mb-2">
            Billed to
          </h3>
          <p className="font-semibold text-gray-900">
            {Receiver.name || "—"}
          </p>
          <p className="text-gray-600 text-xs mt-1">{Receiver.address}</p>
          {Receiver.GSTIN && (
            <p className="text-xs text-gray-500 mt-2">
              <span className="font-medium">GSTIN</span> {Receiver.GSTIN}
            </p>
          )}
          {Receiver.PAN && (
            <p className="text-xs text-gray-500">
              <span className="font-medium">PAN</span> {Receiver.PAN}
            </p>
          )}
        </div>
      </div>

      {/* Place / Country of Supply */}
      <div className="flex justify-between mb-4 px-2">
        {Sender.placeOfSupply && (
          <div className="text-xs text-gray-500">
            <span>Place of Supply</span>{" "}
            <span className="font-semibold text-gray-800 ml-2">
              {Sender.placeOfSupply}
            </span>
          </div>
        )}
        {Receiver.countryOfSupply && (
          <div className="text-xs text-gray-500">
            <span>Country of Supply</span>{" "}
            <span className="font-semibold text-gray-800 ml-2">
              {Receiver.countryOfSupply}
            </span>
          </div>
        )}
      </div>

      {/* Items Table */}
      <div className="mb-6">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-violet-600 text-white">
              <th className="py-2 px-3 text-left rounded-tl-md">
                Item #/Item description
              </th>
              <th className="py-2 px-3 text-center">HSN</th>
              <th className="py-2 px-3 text-center">Qty.</th>
              <th className="py-2 px-3 text-center">GST</th>
              <th className="py-2 px-3 text-right">Taxable Amount</th>
              <th className="py-2 px-3 text-right">SGST</th>
              <th className="py-2 px-3 text-right">CGST</th>
              <th className="py-2 px-3 text-right rounded-tr-md">Amount</th>
            </tr>
          </thead>
          <tbody>
            {Items.map((item, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="py-2 px-3 border-b border-gray-200">
                  <span className="text-gray-400 mr-1">{index + 1}.</span>{" "}
                  {item.description || "—"}
                </td>
                <td className="py-2 px-3 text-center border-b border-gray-200">
                  {item.hsn || "—"}
                </td>
                <td className="py-2 px-3 text-center border-b border-gray-200">
                  {item.qty}
                </td>
                <td className="py-2 px-3 text-center border-b border-gray-200">
                  {item.gst}%
                </td>
                <td className="py-2 px-3 text-right border-b border-gray-200">
                  {formatCurrency(item.taxableAmount)}
                </td>
                <td className="py-2 px-3 text-right border-b border-gray-200">
                  {formatCurrency(item.sgst)}
                </td>
                <td className="py-2 px-3 text-right border-b border-gray-200">
                  {formatCurrency(item.cgst)}
                </td>
                <td className="py-2 px-3 text-right border-b border-gray-200 font-medium">
                  {formatCurrency(item.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Section: Bank + Totals side by side */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Bank Details */}
        <div>
          <h3 className="text-sm font-semibold text-violet-600 mb-3">
            Bank & Payment Details
          </h3>
          {Bank && (Bank.accountName || Bank.accountNumber) ? (
            <div className="text-xs space-y-1">
              <div className="grid grid-cols-[140px_1fr]">
                <span className="text-gray-500">Account Holder Name</span>
                <span className="font-medium">{Bank.accountName}</span>
              </div>
              <div className="grid grid-cols-[140px_1fr]">
                <span className="text-gray-500">Account Number</span>
                <span className="font-medium">{Bank.accountNumber}</span>
              </div>
              <div className="grid grid-cols-[140px_1fr]">
                <span className="text-gray-500">IFSC</span>
                <span className="font-medium">{Bank.ifsc}</span>
              </div>
              <div className="grid grid-cols-[140px_1fr]">
                <span className="text-gray-500">Account Type</span>
                <span className="font-medium">{Bank.accountType}</span>
              </div>
              <div className="grid grid-cols-[140px_1fr]">
                <span className="text-gray-500">Bank</span>
                <span className="font-medium">{Bank.bank}</span>
              </div>
              <div className="grid grid-cols-[140px_1fr]">
                <span className="text-gray-500">UPI</span>
                <span className="font-medium">{Bank.upi}</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic">
              No bank details provided
            </p>
          )}
        </div>

        {/* Totals */}
        <div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Sub Total</span>
              <span className="font-medium">
                {formatCurrency(Totals.subTotal)}
              </span>
            </div>
            {Totals.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span>- {formatCurrency(Totals.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">Taxable Amount</span>
              <span className="font-medium">
                {formatCurrency(Totals.taxableAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">CGST</span>
              <span className="font-medium">
                {formatCurrency(Totals.cgst)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">SGST</span>
              <span className="font-medium">
                {formatCurrency(Totals.sgst)}
              </span>
            </div>
            <div className="border-t border-gray-300" />
            <div className="flex justify-between text-base font-bold text-gray-900">
              <span>Total</span>
              <span>{formatCurrency(Totals.total)}</span>
            </div>
            {Totals.earlyPayDiscount > 0 && (
              <>
                <div className="border-t border-gray-300" />
                <div className="flex justify-between text-emerald-600">
                  <span>EarlyPay Discount</span>
                  <span>{formatCurrency(Totals.earlyPayDiscount)}</span>
                </div>
                {Totals.earlyPayAmount && (
                  <div className="flex justify-between font-semibold">
                    <span>EarlyPay Amount</span>
                    <span>{Totals.earlyPayAmount}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Terms */}
      {termsArray.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-violet-600 mb-2">
            Terms and Conditions
          </h3>
          <ol className="list-decimal list-inside text-xs text-gray-600 space-y-1">
            {termsArray.map((term, i) => (
              <li key={i}>{term}</li>
            ))}
          </ol>
        </div>
      )}

      {/* Additional Notes */}
      {additionalNotes && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-violet-600 mb-2">
            Additional Notes
          </h3>
          <p className="text-xs text-gray-600">{additionalNotes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-gray-300" />
      <div className="text-xs text-gray-400 text-center">
        {Sender.name && (
          <p>
            For any enquiries, email us on{" "}
            <span className="text-violet-600">contact@{Sender.name.toLowerCase().replace(/\s+/g, "")}.com</span>
          </p>
        )}
      </div>
    </div>
  );
}
