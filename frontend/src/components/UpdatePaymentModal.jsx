import { useState } from "react";

import API from "../services/api";

function UpdatePaymentModal({
  invoice,
  onClose,
  onSuccess,
}) {

  const [amount, setAmount] =
    useState("");

  const handleSubmit = async () => {

    if (!amount || Number(amount) <= 0) {

      alert(
        "Enter valid payment amount"
      );

      return;
    }

    try {

      await API.put(
        `update-payment/${invoice.invoice_id}/`,
        {
          amount: Number(amount),
        }
      );

      alert(
        "Payment Updated Successfully"
      );

      onSuccess();

      onClose();

    } catch (err) {

      console.error(err);

      alert(
        err?.response?.data?.error ||
        "Failed to update payment"
      );
    }
  };

  return (

    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">

      <div className="bg-white rounded-2xl w-full max-w-md p-8 relative">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-red-500 text-2xl font-bold"
        >
          ×
        </button>

        {/* HEADER */}
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          Update Payment
        </h2>

        {/* INFO */}
        <div className="space-y-3 mb-6">

          <div className="flex justify-between">
            <span>Total Amount</span>

            <span className="font-bold">
              ₹ {invoice.total_amount}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Paid Amount</span>

            <span className="font-bold text-green-600">
              ₹ {invoice.paid_amount}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Due Amount</span>

            <span className="font-bold text-red-600">
              ₹ {invoice.due_amount}
            </span>
          </div>

        </div>

        {/* INPUT */}
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value)
          }
          placeholder="Enter Additional Payment"
          className="w-full border border-slate-300 rounded-xl px-4 py-3 mb-6"
        />

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold"
        >
          Update Payment
        </button>

      </div>

    </div>
  );
}

export default UpdatePaymentModal;