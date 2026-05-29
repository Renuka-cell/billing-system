import { useState } from "react";

import API from "../services/api";

import Layout from "../components/Layout";

function CustomerHistory() {

  const [name, setName] =
  useState("");

  const [mobile, setMobile] =
    useState("");

  const [history, setHistory] =
    useState([]);

  const [customerInfo, setCustomerInfo] =
    useState(null);

  const [paymentInputs, setPaymentInputs] =
    useState({});

  // =====================================
  // SEARCH CUSTOMER HISTORY
  // =====================================
  const handleSearch = async () => {

  if (
    !name.trim() &&
    !mobile.trim()
  ) {

    alert(
      "Enter customer name or mobile number"
    );

    return;
  }

  try {

    const res = await API.get(

      `customer-history/?name=${name}&mobile=${mobile}`

    );

    setCustomerInfo({

      name:
        res.data.customer_name,

      mobile:
        res.data.customer_mobile,

      email:
        res.data.customer_email,
    });

    setHistory(
      res.data.history
    );

  } catch (err) {

    console.error(err);

    alert(
      "Customer history not found"
    );

    setHistory([]);

    setCustomerInfo(null);
  }
};

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
  // HANDLE PAYMENT INPUT
  // =====================================
  const handlePaymentInput = (
    invoiceId,
    value
  ) => {

    setPaymentInputs({

      ...paymentInputs,

      [invoiceId]:
        value,
    });
  };

  // =====================================
  // UPDATE PAYMENT
  // =====================================
  const updatePayment = async (
    invoiceId
  ) => {

    try {

      const amount =
        paymentInputs[invoiceId];

      if (!amount) {

        alert(
          "Enter payment amount"
        );

        return;
      }

      await API.put(
        `update-payment/${invoiceId}/`,
        {
          amount: amount,
        }
      );

      alert(
        "Payment updated successfully"
      );

      handleSearch();

    } catch (err) {

      console.error(err);

      alert(
        "Failed to update payment"
      );
    }
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
        `${invoiceNumber}.pdf`
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

  return (

    <Layout>

      <div className="space-y-8">

        {/* ===================================== */}
        {/* HEADER */}
        {/* ===================================== */}
        <div>

          <h1 className="text-3xl font-bold text-slate-800">
            Customer History
          </h1>

          <p className="text-slate-500 mt-2">
            View customer invoices,
            prescription history and payment records.
          </p>

        </div>

        {/* ===================================== */}
        {/* SEARCH SECTION */}
        {/* ===================================== */}
        <div className="bg-white rounded-2xl shadow-md p-8 border border-slate-100">

          <h2 className="text-xl font-bold text-slate-800 mb-6">
            Search Customer
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* NAME */}
            <input
              type="text"
              placeholder="Enter customer name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="border border-slate-300 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* MOBILE */}
            <input
              type="text"
              placeholder="Enter mobile number"
              value={mobile}
              onChange={(e) =>
                setMobile(e.target.value)
              }
              className="border border-slate-300 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={handleSearch}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:opacity-90 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg"
            >
              Search
            </button>

          </div>

        </div>

        {/* ===================================== */}
        {/* CUSTOMER INFO */}
        {/* ===================================== */}
        {customerInfo && (

          <div className="bg-white rounded-2xl shadow-md p-8 border border-slate-100">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

              <div>

                <h2 className="text-2xl font-bold text-slate-800">
                  {customerInfo.name}
                </h2>

                <p className="text-slate-500 mt-2">
                  {customerInfo.email}
                </p>

                <p className="text-slate-500 mt-1">
                  {customerInfo.mobile}
                </p>

              </div>

              <div className="bg-blue-100 text-blue-700 px-6 py-3 rounded-2xl font-semibold">
                Existing Customer
              </div>

            </div>

          </div>

        )}

        {/* ===================================== */}
        {/* HISTORY TABLE */}
        {/* ===================================== */}
        {history.length > 0 ? (

          <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">

            {/* TABLE HEADER */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-slate-800">
                  Invoice Records
                </h2>

                <p className="text-slate-500 text-sm mt-1">
                  Complete optical billing history
                </p>

              </div>

              <div className="bg-indigo-100 text-indigo-700 px-5 py-2 rounded-xl text-sm font-semibold">
                {history.length} Invoices
              </div>

            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">

              <table className="w-full">

                {/* TABLE HEAD */}
                <thead className="bg-slate-50 border-b border-slate-200">

                  <tr>

                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                      Invoice
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                      Frame
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                      Glass
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                      Total
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                      Paid
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                      Due
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                      Payment Mode
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                      Payment
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-bold text-slate-700">
                      PDF
                    </th>

                  </tr>

                </thead>

                {/* TABLE BODY */}
                <tbody>

                  {history.map((item, index) => (

                    <tr
                      key={index}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-all duration-200"
                    >

                      {/* INVOICE */}
                      <td className="px-6 py-5">

                        <div className="font-bold text-slate-800">
                          {item.invoice_number}
                        </div>

                        <div className="text-sm text-slate-500 mt-1">
                          {item.date}
                        </div>

                      </td>

                      {/* FRAME */}
                      <td className="px-6 py-5">

                        <div className="font-medium text-slate-700">
                          {item.frame_type || "N/A"}
                        </div>

                      </td>

                      {/* GLASS */}
                      <td className="px-6 py-5">

                        <div className="font-medium text-slate-700">
                          {item.glass_type || "N/A"}
                        </div>

                      </td>

                      {/* TOTAL */}
                      <td className="px-6 py-5">

                        <span className="font-bold text-blue-700">
                          ₹ {item.total_amount}
                        </span>

                      </td>

                      {/* PAID */}
                      <td className="px-6 py-5">

                        <span className="font-bold text-green-700">
                          ₹ {item.paid_amount}
                        </span>

                      </td>

                      {/* DUE */}
                      <td className="px-6 py-5">

                        <span className="font-bold text-red-600">
                          ₹ {item.due_amount}
                        </span>

                      </td>

                      {/* PAYMENT MODE */}
                      <td className="px-6 py-5">

                        <span className="bg-slate-100 text-slate-700 px-3 py-2 rounded-xl text-sm font-semibold">
                          {item.payment_mode}
                        </span>

                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-5">

                        <span
                          className={`px-4 py-2 rounded-xl text-sm font-semibold ${getStatusStyle(item.payment_status)}`}
                        >
                          {item.payment_status}
                        </span>

                      </td>

                      {/* PAYMENT UPDATE */}
                      <td className="px-6 py-5">

                        {item.payment_status !== "PAID" ? (

                          <div className="flex gap-2">

                            <input
                              type="number"
                              placeholder="Amount"
                              value={
                                paymentInputs[
                                  item.invoice_id
                                ] || ""
                              }
                              onChange={(e) =>
                                handlePaymentInput(
                                  item.invoice_id,
                                  e.target.value
                                )
                              }
                              className="border border-slate-300 rounded-lg px-3 py-2 w-28"
                            />

                            <button
                              onClick={() =>
                                updatePayment(
                                  item.invoice_id
                                )
                              }
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                            >
                              Update
                            </button>

                          </div>

                        ) : (

                          <span className="text-green-700 font-semibold">
                            Completed
                          </span>

                        )}

                      </td>

                      {/* PDF */}
                      <td className="px-6 py-5 text-center">

                        <button
                          onClick={() =>
                            downloadInvoice(
                              item.invoice_id,
                              item.invoice_number
                            )
                          }
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300"
                        >
                          Download
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        ) : (

          <div className="bg-white rounded-2xl shadow-md p-12 border border-slate-100 text-center">

            <div className="text-6xl mb-4">
              📜
            </div>

            <h2 className="text-2xl font-bold text-slate-700">
              No customer history loaded
            </h2>

            <p className="text-slate-500 mt-3">
              Search using customer mobile number
              to view invoice records.
            </p>

          </div>

        )}

      </div>

    </Layout>
  );
}

export default CustomerHistory;