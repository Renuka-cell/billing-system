import { useEffect, useState } from "react";

import API from "../services/api";

import Layout from "../components/Layout";

import EditInvoiceModal from "../components/EditInvoiceModal";

import toast from "react-hot-toast";

import {
  Eye,
  Download,
  Search,
} from "lucide-react";

function InvoiceManagement() {

  const formatInvoiceNumber = (invoice) => {
    if (!invoice) return "INV-000";

    return `INV-${String(
      invoice.invoice_id || 0
    ).padStart(3, "0")}`;
  };

  const [invoices, setInvoices] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedInvoice, setSelectedInvoice] =
    useState(null);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [paymentModal, setPaymentModal] =
    useState(false);

  const [paymentInvoice, setPaymentInvoice] =
    useState(null);

  const [paymentAmount, setPaymentAmount] =
    useState("");

  const [
    selectedPrescription,
    setSelectedPrescription
  ] = useState(null);

  // =====================================
  // PAGINATION
  // =====================================
  const [currentPage, setCurrentPage] =
    useState(1);

  const recordsPerPage = 10;

  // =====================================
  // FETCH ALL INVOICES
  // =====================================
  const fetchInvoices = async () => {

    try {

      const res = await API.get(
        "all-invoices/"
      );

      if (Array.isArray(res.data)) {

        setInvoices(res.data);

      } else {

        console.error(
          "Invalid invoices response:",
          res.data
        );

        setInvoices([]);
      }

    } catch (err) {

      console.error(err);

      toast.error("Failed to load invoices");

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchInvoices();

  }, []);

  // =====================================
  // PAGINATION LOGIC
  // =====================================
  const indexOfLastRecord =
    currentPage * recordsPerPage;

  const indexOfFirstRecord =
    indexOfLastRecord - recordsPerPage;

  const currentInvoices =
    invoices.slice(
      indexOfFirstRecord,
      indexOfLastRecord
    );

  const totalPages =
    Math.ceil(
      invoices.length /
      recordsPerPage
    );

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

      toast.error("Failed to download invoice");
    }
  };

    // =====================================
  // DELETE INVOICE
  // =====================================
  const deleteInvoice = async (
    invoiceId
  ) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this invoice?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      await API.delete(
        `delete-invoice/${invoiceId}/`
      );

      toast.success(
        "Invoice deleted successfully"
      );

      fetchInvoices();

    } catch (err) {

      console.error(err);

      toast.error(
        err?.response?.data?.error ||
        "Failed to delete invoice"
      );
    }
  };

  // =====================================
  // OPEN EDIT MODAL
  // =====================================
  const openEditModal = (invoice) => {

    setSelectedInvoice(invoice);

    setShowEditModal(true);
  };

  // =====================================
  // OPEN PAYMENT MODAL
  // =====================================
  const openPaymentModal = (invoice) => {

    setPaymentInvoice(invoice);

    setPaymentAmount("");

    setPaymentModal(true);
  };

  // =====================================
  // UPDATE PAYMENT
  // =====================================
  const handlePaymentUpdate = async () => {

    try {

      if (
        !paymentAmount ||
        Number(paymentAmount) <= 0
      ) {

        toast.error("Enter valid payment amount");

        return;
      }

      await API.put(
        `update-payment/${paymentInvoice.invoice_id}/`,
        {
          amount:
            Number(paymentAmount),
        }
      );

      toast.success("Payment Updated Successfully"  );

      setPaymentModal(false);

      setPaymentAmount("");

      fetchInvoices();

    } catch (err) {

      console.error(err);

      toast.error(
        err?.response?.data?.error ||
        "Failed to update payment"
      );
    }
  };

  return (

    <Layout>

      <div className="space-y-8">

        {/* ===================================== */}
        {/* PAGE HEADER */}
        {/* ===================================== */}
        <div>

          <h1 className="text-3xl font-bold text-slate-800">
            Invoice Management
          </h1>

          <p className="text-slate-500 mt-2">
            Manage optical invoices,
            billing records and customer transactions.
          </p>

        </div>

        {/* ===================================== */}
        {/* TABLE SECTION */}
        {/* ===================================== */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">

          {/* HEADER */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">

            <div>

              <h2 className="text-xl font-bold text-slate-800">
                All Invoices
              </h2>

              <p className="text-slate-500 text-sm mt-1">
                Complete billing history of your optical shop
              </p>

            </div>

            <div className="bg-blue-100 text-blue-700 px-5 py-2 rounded-xl font-semibold text-sm">
              {invoices.length} Records
            </div>

          </div>

          {/* LOADING */}
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

                {/* ===================================== */}
                {/* TABLE HEADER */}
                {/* ===================================== */}
                <thead className="bg-slate-50 border-b border-slate-200">

                  <tr>

                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                        Date
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                        Invoice
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                        Customer
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                        Frame Type
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                        Frame Price
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                        Glass Type
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                        Glass Price
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                        Eye Description
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
                        Created By
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-bold text-slate-700">
                        Edit
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-bold text-slate-700">
                        Delete
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-bold text-slate-700">
                        Payment
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-bold text-slate-700">
                        PDF
                    </th>

                    </tr>

                </thead>

                {/* ===================================== */}
                {/* TABLE BODY */}
                {/* ===================================== */}
                <tbody>

                  {currentInvoices.map((item) => (

                    <tr
                      key={item.invoice_id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-all duration-200"
                    >
                      {/* DATE */}
                      <td className="px-6 py-5 text-slate-700">
                        {item.date}
                      </td>

                      {/* INVOICE */}
                      <td className="px-6 py-5">
                        <div className="font-bold text-slate-800">
                          {formatInvoiceNumber(item)}
                        </div>
                      </td>

                      {/* CUSTOMER */}
                      <td className="px-6 py-5">
                        <div className="font-semibold text-slate-800">
                          {item.customer_name}
                        </div>

                        <div className="text-sm text-slate-500 mt-1">
                          {item.customer_mobile}
                        </div>
                      </td>

                      {/* FRAME TYPE */}
                      <td className="px-6 py-5">
                        {item.frame_type || "N/A"}
                      </td>

                      {/* FRAME PRICE */}
                      <td className="px-6 py-5">
                        ₹ {item.frame_price}
                      </td>

                      {/* GLASS TYPE */}
                      <td className="px-6 py-5">
                        {item.glass_type || "N/A"}
                      </td>

                      {/* GLASS PRICE */}
                      <td className="px-6 py-5">
                        ₹ {item.glass_price}
                      </td>
                      

                      {/* EYE PRESCRIPTION */}
                      <td className="px-6 py-5 text-center">

                        <button
                          onClick={() =>
                            setSelectedPrescription(item)
                          }
                          className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-xl"
                        >

                          <Eye size={18} />

                        </button>

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

                      {/* CREATED BY */}
                      <td className="px-6 py-5">
                        <div className="font-medium text-slate-700">
                          {item.created_by}
                        </div>
                      </td>

                      {/* EDIT */}
                      <td className="px-6 py-5 text-center">
                        <button
                          onClick={() => openEditModal(item)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl text-sm font-semibold"
                        >
                          Edit
                        </button>
                      </td>

                      {/* DELETE */}
                      <td className="px-6 py-5 text-center">
                        <button
                          onClick={() => deleteInvoice(item.invoice_id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-semibold"
                        >
                          Delete
                        </button>
                      </td>

                      {/* PAYMENT UPDATE */}
                      <td className="px-6 py-5 text-center">
                        <button
                          onClick={() => openPaymentModal(item)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold"
                        >
                          Update Payment
                        </button>
                      </td>

                      {/* DOWNLOAD */}
                      <td className="px-6 py-5 text-center">
                        <button
                          onClick={() =>
                            downloadInvoice(
                              item.invoice_id,
                              item.invoice_number
                            )
                          }
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 shadow-sm"
                        >
                          Download
                        </button>
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

              {/* PAGINATION */}
              <div className="flex justify-center items-center gap-4 p-6 border-t">

                <button
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage(
                      currentPage - 1
                    )
                  }
                  className="bg-slate-200 px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>

                <span className="font-semibold">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  disabled={
                    currentPage === totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      currentPage + 1
                    )
                  }
                  className="bg-slate-200 px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  Next
                </button>

              </div>

            </div>

          )}

        </div>

      </div>

      {/* ===================================== */}
      {/* EDIT MODAL */}
      {/* ===================================== */}
      {showEditModal && selectedInvoice && (

        <EditInvoiceModal
          invoice={selectedInvoice}
          onClose={() =>
            setShowEditModal(false)
          }
          onSuccess={fetchInvoices}
        />

      )}

      {/* ===================================== */}
      {/* PAYMENT MODAL */}
      {/* ===================================== */}
      {paymentModal && paymentInvoice && (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">

          <div className="bg-white rounded-2xl w-full max-w-md p-8 relative">

            {/* CLOSE */}
            <button
              onClick={() =>
                setPaymentModal(false)
              }
              className="absolute top-4 right-5 text-2xl font-bold text-red-500"
            >
              ×
            </button>

            {/* TITLE */}
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Update Payment
            </h2>

            {/* INVOICE DETAILS */}
            <div className="space-y-3 mb-6">

              <div className="flex justify-between">

                <span className="text-slate-600">
                  Total Amount
                </span>

                <span className="font-bold text-blue-700">
                  ₹ {paymentInvoice.total_amount}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-slate-600">
                  Already Paid
                </span>

                <span className="font-bold text-green-700">
                  ₹ {paymentInvoice.paid_amount}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-slate-600">
                  Due Amount
                </span>

                <span className="font-bold text-red-600">
                  ₹ {paymentInvoice.due_amount}
                </span>

              </div>

            </div>

            {/* INPUT */}
            <input
              type="number"
              step="0.01"
              value={paymentAmount}
              onChange={(e) =>
                setPaymentAmount(
                  e.target.value
                )
              }
              placeholder="Enter Payment Amount"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 mb-6"
            />

            {/* BUTTON */}
            <button
              onClick={handlePaymentUpdate}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold"
            >
              Update Payment
            </button>

          </div>

        </div>

      )}

      {/* ===================================== */}
      {/* PRESCRIPTION MODAL */}
      {/* ===================================== */}
      {selectedPrescription && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-2xl w-full max-w-3xl p-8">

            <div className="flex items-center justify-between mb-6">

              <h2 className="text-2xl font-bold text-slate-800">
                Eye Prescription
              </h2>

              <button
                onClick={() =>
                  setSelectedPrescription(null)
                }
                className="text-red-500 font-bold text-xl"
              >
                ✕
              </button>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full border border-slate-300">

                <thead className="bg-slate-100">

                  <tr>

                    <th className="border px-4 py-3">
                      Eye
                    </th>

                    <th className="border px-4 py-3">
                      SPH
                    </th>

                    <th className="border px-4 py-3">
                      CYL
                    </th>

                    <th className="border px-4 py-3">
                      Axis
                    </th>

                    <th className="border px-4 py-3">
                      ADD
                    </th>

                  </tr>

                </thead>

                <tbody>

                  <tr>

                    <td className="border px-4 py-3 font-semibold">
                      RE
                    </td>

                    <td className="border px-4 py-3">
                      {selectedPrescription.right_sph || "--"}
                    </td>

                    <td className="border px-4 py-3">
                      {selectedPrescription.right_cyl || "--"}
                    </td>

                    <td className="border px-4 py-3">
                      {selectedPrescription.right_axis || "--"}
                    </td>

                    <td className="border px-4 py-3">
                      {selectedPrescription.right_add || "--"}
                    </td>

                  </tr>

                  <tr>

                    <td className="border px-4 py-3 font-semibold">
                      LE
                    </td>

                    <td className="border px-4 py-3">
                      {selectedPrescription.left_sph || "--"}
                    </td>

                    <td className="border px-4 py-3">
                      {selectedPrescription.left_cyl || "--"}
                    </td>

                    <td className="border px-4 py-3">
                      {selectedPrescription.left_axis || "--"}
                    </td>

                    <td className="border px-4 py-3">
                      {selectedPrescription.left_add || "--"}
                    </td>

                  </tr>

                </tbody>

              </table>

            </div>

            <div className="mt-6">

              <h3 className="font-semibold text-slate-700">
                Lens Type:
              </h3>

              <p className="mt-2 bg-slate-100 rounded-xl px-4 py-3">
                {selectedPrescription.lens_type || "--"}
              </p>

            </div>

          </div>

        </div>

      )}

    </Layout>
  );
}

export default InvoiceManagement;