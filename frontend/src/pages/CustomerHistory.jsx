import { useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

function CustomerHistory() {

  const [mobile, setMobile] = useState("");

  const [history, setHistory] = useState([]);

  const [customerInfo, setCustomerInfo] = useState(null);

  const [paymentInputs, setPaymentInputs] = useState({});

  // =====================================
  // FETCH CUSTOMER HISTORY
  // =====================================
  const handleSearch = async () => {

    try {

      const res = await API.get(
        `customer-history/${mobile}/`
      );

      setCustomerInfo({
        name: res.data.customer_name,
        mobile: res.data.customer_mobile,
        email: res.data.customer_email,
      });

      setHistory(res.data.history);

    } catch (err) {

      console.error(err);

      alert("No history found");

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
      [invoiceId]: value,
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

        alert("Enter payment amount");

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

      alert("Failed to update payment");
    }
  };

  // =====================================
  // SECURE PDF DOWNLOAD
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

      // CREATE FILE URL
      const url =
        window.URL.createObjectURL(
          new Blob([response.data])
        );

      // CREATE DOWNLOAD LINK
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

        {/* HEADER */}
        <div>

          <h1 className="text-3xl font-bold text-slate-800">
            Customer History
          </h1>

          <p className="text-slate-500 mt-2">
            View complete customer billing records and payment history.
          </p>

        </div>

        {/* SEARCH */}
        <div className="bg-white rounded-2xl shadow-md p-8 border border-slate-100">

          <h2 className="text-xl font-bold text-slate-800 mb-6">
            Search Customer Records
          </h2>

          <div className="flex flex-col md:flex-row gap-4">

            <input
              type="text"
              placeholder="Enter mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="flex-1 border border-slate-300 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={handleSearch}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:opacity-90 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg"
            >
              Search
            </button>

          </div>

        </div>

        {/* CUSTOMER INFO */}
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

        {/* HISTORY */}
        {history.length > 0 ? (

          <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">

            <div className="p-6 border-b border-slate-100">

              <h2 className="text-xl font-bold text-slate-800">
                Invoice Records
              </h2>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-slate-50">

                  <tr>

                    <th className="px-6 py-4 text-left">
                      Invoice
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
                      Payment
                    </th>

                    <th className="px-6 py-4 text-left">
                      PDF
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {history.map((item, index) => (

                    <tr
                      key={index}
                      className="border-t border-slate-100"
                    >

                      <td className="px-6 py-5 font-semibold">
                        {item.invoice_number}
                      </td>

                      <td className="px-6 py-5">
                        ₹ {item.total_amount}
                      </td>

                      <td className="px-6 py-5 text-green-700 font-semibold">
                        ₹ {item.paid_amount}
                      </td>

                      <td className="px-6 py-5 text-red-600 font-semibold">
                        ₹ {item.due_amount}
                      </td>

                      <td className="px-6 py-5">

                        <span
                          className={`px-4 py-2 rounded-xl text-sm font-semibold ${getStatusStyle(item.payment_status)}`}
                        >
                          {item.payment_status}
                        </span>

                      </td>

                      {/* PAYMENT */}
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

                      {/* PDF DOWNLOAD */}
                      <td className="px-6 py-5">

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
              Search using a mobile number to view invoice records.
            </p>

          </div>

        )}

      </div>

    </Layout>
  );
}

export default CustomerHistory;