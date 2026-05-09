import { useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

function CreateInvoice() {

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    product_description: "",
    quantity: "",
    rate: "",
    paid_amount: "",
  });

  const [invoiceId, setInvoiceId] = useState(null);

  // =====================================
  // HANDLE INPUT CHANGE
  // =====================================
  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================
  // SEARCH CUSTOMER
  // =====================================
  const handleSearch = async () => {

    try {

      const res = await API.get(
        `search-customer/?query=${form.mobile}`
      );

      setForm({
        ...form,
        name: res.data.name,
        email: res.data.email,
      });

      alert("Customer Found");

    } catch {

      alert("Customer not found");
    }
  };

  // =====================================
  // CREATE INVOICE
  // =====================================
  const handleSubmit = async () => {

    try {

      const res = await API.post(
        "create-invoice/",
        form
      );

      alert(
        "Invoice Created Successfully"
      );

      // SAVE INVOICE ID
      setInvoiceId(
        res.data.invoice_id
      );

    } catch (err) {

      console.error(err);

      alert("Error creating invoice");
    }
  };

  // =====================================
  // SECURE PDF DOWNLOAD
  // =====================================
  const downloadInvoice = async () => {

    try {

      const response = await API.get(
        `download-invoice/${invoiceId}/`,
        {
          responseType: "blob",
        }
      );

      // CREATE FILE URL
      const url =
        window.URL.createObjectURL(
          new Blob([response.data])
        );

      // CREATE LINK
      const link =
        document.createElement("a");

      link.href = url;

      link.setAttribute(
        "download",
        `invoice_${invoiceId}.pdf`
      );

      document.body.appendChild(link);

      link.click();

      link.remove();

    } catch (err) {

      console.error(err);

      alert(
        "Failed to download invoice"
      );
    }
  };

  // =====================================
  // TOTAL CALCULATION
  // =====================================
  const total =
    Number(form.quantity || 0) *
    Number(form.rate || 0);

  return (

    <Layout>

      <div className="space-y-8">

        {/* HEADING */}
        <div>

          <h1 className="text-3xl font-bold text-slate-800">
            Create Invoice
          </h1>

          <p className="text-slate-500 mt-2">
            Generate professional customer invoices easily.
          </p>

        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* LEFT SIDE */}
          <div className="xl:col-span-2 bg-white rounded-2xl shadow-md p-8 border border-slate-100">

            <h2 className="text-xl font-bold text-slate-800 mb-6">
              Customer Details
            </h2>

            {/* NAME */}
            <div className="mb-5">

              <label className="block text-sm font-medium text-slate-600 mb-2">
                Customer Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter customer name"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* MOBILE */}
            <div className="mb-5">

              <label className="block text-sm font-medium text-slate-600 mb-2">
                Mobile Number
              </label>

              <div className="flex gap-3">

                <input
                  type="text"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                  className="flex-1 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  onClick={handleSearch}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl font-semibold transition-all duration-300"
                >
                  Search
                </button>

              </div>

            </div>

            {/* EMAIL */}
            <div className="mb-5">

              <label className="block text-sm font-medium text-slate-600 mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* PRODUCT */}
            <div className="mb-5">

              <label className="block text-sm font-medium text-slate-600 mb-2">
                Product Description
              </label>

              <input
                type="text"
                name="product_description"
                value={form.product_description}
                onChange={handleChange}
                placeholder="Enter product details"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* QUANTITY + RATE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">

              {/* QUANTITY */}
              <div>

                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Quantity
                </label>

                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="Enter quantity"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* RATE */}
              <div>

                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Rate
                </label>

                <input
                  type="number"
                  name="rate"
                  value={form.rate}
                  onChange={handleChange}
                  placeholder="Enter rate"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

            </div>

            {/* PAID AMOUNT */}
            <div className="mb-5">

              <label className="block text-sm font-medium text-slate-600 mb-2">
                Paid Amount
              </label>

              <input
                type="number"
                name="paid_amount"
                value={form.paid_amount}
                onChange={handleChange}
                placeholder="Enter paid amount"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* CREATE BUTTON */}
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:opacity-90 text-white py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg"
            >
              Create Invoice
            </button>

          </div>

          {/* RIGHT SIDE */}
          <div className="bg-white rounded-2xl shadow-md p-8 border border-slate-100 h-fit">

            <h2 className="text-xl font-bold text-slate-800 mb-6">
              Invoice Summary
            </h2>

            <div className="space-y-5">

              <div className="flex justify-between">

                <span className="text-slate-500">
                  Customer
                </span>

                <span className="font-semibold text-slate-800">
                  {form.name || "N/A"}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-slate-500">
                  Product
                </span>

                <span className="font-semibold text-slate-800">
                  {form.product_description || "N/A"}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-slate-500">
                  Quantity
                </span>

                <span className="font-semibold text-slate-800">
                  {form.quantity || 0}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-slate-500">
                  Rate
                </span>

                <span className="font-semibold text-slate-800">
                  ₹ {form.rate || 0}
                </span>

              </div>

              <hr />

              <div className="flex justify-between text-xl font-bold">

                <span>Total</span>

                <span className="text-blue-700">
                  ₹ {total}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-slate-500">
                  Paid Amount
                </span>

                <span className="font-semibold text-green-700">
                  ₹ {form.paid_amount || 0}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-slate-500">
                  Due Amount
                </span>

                <span className="font-semibold text-red-600">
                  ₹ {total - Number(form.paid_amount || 0)}
                </span>

              </div>

            </div>

            {/* DOWNLOAD BUTTON */}
            {invoiceId && (

              <button
                onClick={downloadInvoice}
                className="w-full mt-8 bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-semibold transition-all duration-300"
              >
                Download Invoice PDF
              </button>

            )}

          </div>

        </div>

      </div>

    </Layout>
  );
}

export default CreateInvoice;