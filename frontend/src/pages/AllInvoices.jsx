import { useEffect, useState } from "react";

import Layout from "../components/Layout";

import API from "../services/api";

import {
  Eye,
  Download,
  Search,
} from "lucide-react";

function AllInvoices() {

  const formatInvoiceNumber = (invoice) => {
    if (!invoice) return "INV-000";

    return `INV-${String(
      invoice.invoice_id || 0
    ).padStart(3, "0")}`;
  };

  const [invoices, setInvoices] =
    useState([]);

  const [filteredInvoices, setFilteredInvoices] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [selectedPrescription, setSelectedPrescription] =
    useState(null);

  // =====================================
  // PAGINATION
  // =====================================
  const [currentPage, setCurrentPage] =
    useState(1);

  const recordsPerPage = 10;

  // =====================================
  // FETCH INVOICES
  // =====================================
  const fetchInvoices = async () => {

    try {

      const res = await API.get(
        "all-invoices/"
      );

      setInvoices(res.data);

      setFilteredInvoices(
        res.data
      );

    } catch (err) {

      console.error(err);

      alert(
        "Failed to load invoices"
      );
    }
  };

  const downloadInvoice = async (invoiceId) => {

    try {

      const response = await API.get(
        `download-invoice/${invoiceId}/`,
        {
          responseType: "blob",
        }
      );

      const file = new Blob(
        [response.data],
        {
          type: "application/pdf",
        }
      );

      const fileURL =
        window.URL.createObjectURL(file);

      const link =
        document.createElement("a");

      link.href = fileURL;

      link.download =
        `Invoice-${invoiceId}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

    } catch (error) {

      console.error(error);

      alert(
        "Failed to download invoice"
      );
    }
  };

  useEffect(() => {

    fetchInvoices();

  }, []);

  // =====================================
  // SEARCH
  // =====================================
  useEffect(() => {

  const filtered =
    invoices.filter((item) =>

      item.customer_name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||

      item.customer_mobile
        ?.includes(search) ||

      item.invoice_number
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  setFilteredInvoices(filtered);

  // Reset to first page after search
  setCurrentPage(1);

}, [search, invoices]);

// =====================================
// PAGINATION LOGIC
// =====================================
const indexOfLastRecord =
  currentPage * recordsPerPage;

const indexOfFirstRecord =
  indexOfLastRecord - recordsPerPage;

const currentInvoices =
  filteredInvoices.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

const totalPages =
  Math.ceil(
    filteredInvoices.length /
    recordsPerPage
  );

  return (

    <Layout>

      <div className="space-y-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <h1 className="text-3xl font-bold text-slate-800">
              All Invoices
            </h1>

            <p className="text-slate-500 mt-1">
              Customer Billing History
            </p>

          </div>

          {/* SEARCH */}
          <div className="relative w-full md:w-96">

            <Search
              className="absolute left-4 top-3.5 text-slate-400"
              size={18}
            />

            <input
              type="text"
              placeholder="Search customer / invoice"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full border border-slate-300 rounded-2xl pl-11 pr-4 py-3 bg-white"
            />

          </div>

        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-900 text-white">

                <tr>

                  <th className="px-4 py-4 text-left">
                    Sr No
                  </th>

                  <th className="px-4 py-4 text-left">
                    Invoice No
                  </th>

                  <th className="px-4 py-4 text-left">
                    Customer
                  </th>

                  <th className="px-4 py-4 text-left">
                    Mobile
                  </th>

                  <th className="px-4 py-4 text-left">
                    Frame
                  </th>

                  <th className="px-4 py-4 text-left">
                    Glass
                  </th>

                  <th className="px-4 py-4 text-left">
                    Total
                  </th>

                  <th className="px-4 py-4 text-left">
                    Status
                  </th>

                  <th className="px-4 py-4 text-center">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {currentInvoices.map(
                  (invoice, index) => (

                    <tr
                      key={invoice.invoice_id}
                      className="border-b hover:bg-slate-50"
                    >

                      <td className="px-4 py-4">
                        {indexOfFirstRecord + index + 1}
                      </td>

                      <td className="px-4 py-4 font-semibold text-blue-700">
                        {formatInvoiceNumber(invoice)}
                      </td>

                      <td className="px-4 py-4">
                        {invoice.customer_name}
                      </td>

                      <td className="px-4 py-4">
                        {invoice.customer_mobile}
                      </td>

                      <td className="px-4 py-4">
                        {invoice.frame_type}
                      </td>

                      <td className="px-4 py-4">
                        {invoice.glass_type}
                      </td>

                      <td className="px-4 py-4 font-semibold">
                        ₹ {invoice.total_amount}
                      </td>

                      <td className="px-4 py-4">

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold
                          ${
                            invoice.payment_status ===
                            "PAID"
                              ? "bg-green-100 text-green-700"
                              : invoice.payment_status ===
                                "PARTIAL"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >

                          {invoice.payment_status}

                        </span>

                      </td>

                      <td className="px-4 py-4">

                        <div className="flex items-center justify-center gap-3">

                          {/* PRESCRIPTION */}
                          <button
                            onClick={() =>
                              setSelectedPrescription(
                                invoice
                              )
                            }
                            className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-xl"
                          >

                            <Eye size={18} />

                          </button>

                          {/* DOWNLOAD */}
                          <button
                            onClick={() =>
                              downloadInvoice(
                                invoice.invoice_id
                              )
                            }
                            className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded-xl"
                          >
                            <Download size={18} />
                          </button>

                        </div>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

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
              currentPage === totalPages ||
              totalPages === 0
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

      {/* PRESCRIPTION MODAL */}
      {selectedPrescription && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-2xl w-full max-w-3xl p-8">

            <div className="flex items-center justify-between mb-6">

              <h2 className="text-2xl font-bold text-slate-800">
                Eye Prescription
              </h2>

              <button
                onClick={() =>
                  setSelectedPrescription(
                    null
                  )
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

export default AllInvoices;