import { useEffect, useState } from "react";

import API from "../services/api";

import Layout from "../components/Layout";

function InvoiceManagement() {

  const [invoices, setInvoices] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // =====================================
  // FETCH ALL INVOICES
  // =====================================
  const fetchInvoices = async () => {

    try {

      const res = await API.get(
        "all-invoices/"
      );

      setInvoices(res.data);

    } catch (err) {

      console.error(err);

      alert("Failed to load invoices");

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchInvoices();

  }, []);

  // =====================================
  // STATUS COLORS
  // =====================================
  const getStatusStyle = (status) => {

    if (status === "PAID") {

      return "bg-green-100 text-green-700";
    }

    if (status === "PARTIAL") {

      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-red-100 text-red-700";
  };

  // =====================================
  // DOWNLOAD PDF
  // =====================================
  const downloadInvoice = async (
    invoiceId,
    invoiceNumber
  ) => {

    try {

      const response = await API.get(
        `download-invoice/${invoiceId}/`,
        {
          responseType: "blob",
        }
      );

      const url =
        window.URL.createObjectURL(
          new Blob([response.data])
        );

      const link =
        document.createElement("a");

      link.href = url;

      link.setAttribute(
        "download",
        `invoice-${invoiceNumber}.pdf`
      );

      document.body.appendChild(link);

      link.click();

      link.remove();

    } catch (err) {

      console.error(err);

      alert("Failed to download invoice");
    }
  };

  return (

    <Layout>

      <div className="space-y-8">

        {/* HEADER */}
        <div>

          <h1 className="text-3xl font-bold text-slate-800">
            Invoice Management
          </h1>

          <p className="text-slate-500 mt-2">
            Manage all billing invoices,
            payments and customer transactions.
          </p>

        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">

          <div className="p-6 border-b border-slate-100">

            <h2 className="text-xl font-bold text-slate-800">
              All Invoices
            </h2>

          </div>

          {loading ? (

            <div className="p-10 text-center text-slate-500">
              Loading invoices...
            </div>

          ) : invoices.length === 0 ? (

            <div className="p-10 text-center text-slate-500">
              No invoices found
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-slate-50">

                  <tr>

                    <th className="px-6 py-4 text-left">
                      Invoice
                    </th>

                    <th className="px-6 py-4 text-left">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-left">
                      Date
                    </th>

                    <th className="px-6 py-4 text-left">
                      Total
                    </th>

                    <th className="px-6 py-4 text-left">
                      Paid
                    </th>

                    <th className="px-6 py-4 text-left">
                      Due
                    </th>

                    <th className="px-6 py-4 text-left">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left">
                      Created By
                    </th>

                    <th className="px-6 py-4 text-left">
                      PDF
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {invoices.map((item) => (

                    <tr
                      key={item.invoice_id}
                      className="border-t border-slate-100 hover:bg-slate-50"
                    >

                      {/* Invoice */}
                      <td className="px-6 py-5 font-semibold text-slate-700">
                        {item.invoice_number}
                      </td>

                      {/* Customer */}
                      <td className="px-6 py-5">

                        <div className="font-semibold text-slate-800">
                          {item.customer_name}
                        </div>

                        <div className="text-sm text-slate-500">
                          {item.customer_mobile}
                        </div>

                      </td>

                      {/* Date */}
                      <td className="px-6 py-5 text-slate-700">
                        {item.date}
                      </td>

                      {/* Total */}
                      <td className="px-6 py-5 font-semibold text-blue-700">
                        ₹ {item.total_amount}
                      </td>

                      {/* Paid */}
                      <td className="px-6 py-5 font-semibold text-green-700">
                        ₹ {item.paid_amount}
                      </td>

                      {/* Due */}
                      <td className="px-6 py-5 font-semibold text-red-600">
                        ₹ {item.due_amount}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">

                        <span
                          className={`px-4 py-2 rounded-xl text-sm font-semibold ${getStatusStyle(item.payment_status)}`}
                        >
                          {item.payment_status}
                        </span>

                      </td>

                      {/* Created By */}
                      <td className="px-6 py-5 font-medium text-slate-700">
                        {item.created_by}
                      </td>

                      {/* Download */}
                      <td className="px-6 py-5">

                        <button
                          onClick={() =>
                            downloadInvoice(
                              item.invoice_id,
                              item.invoice_number
                            )
                          }
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300"
                        >
                          Download
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </Layout>
  );
}

export default InvoiceManagement;