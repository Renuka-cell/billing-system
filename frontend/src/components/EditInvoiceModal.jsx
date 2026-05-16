import { useState } from "react";

import API from "../services/api";

function EditInvoiceModal({
  invoice,
  onClose,
  onSuccess,
}) {

  const [form, setForm] =
    useState({

      ...invoice,

      frame_quantity:
        invoice.frame_quantity || 0,

      frame_price:
        invoice.frame_price || "",

      glass_quantity:
        invoice.glass_quantity || 0,

      glass_price:
        invoice.glass_price || "",
    });

  // =====================================
  // POWER OPTIONS
  // =====================================
  const powerOptions = [

    "+0.25",
    "+0.50",
    "+0.75",
    "+1.00",
    "+1.25",
    "+1.50",
    "+1.75",
    "+2.00",
    "+2.25",
    "+2.50",
    "+2.75",
    "+3.00",
    "+3.25",
    "+3.50",
    "+3.75",
    "+4.00",

    "-0.25",
    "-0.50",
    "-0.75",
    "-1.00",
    "-1.25",
    "-1.50",
    "-1.75",
    "-2.00",
    "-2.25",
    "-2.50",
    "-2.75",
    "-3.00",
    "-3.25",
    "-3.50",
    "-3.75",
    "-4.00",
  ];

  // =====================================
  // HANDLE CHANGE
  // =====================================
  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;

    // =====================================
    // FRAME NOT REQUIRED
    // =====================================
    if (
      name === "frame_type" &&
      value === "Not Required"
    ) {

      setForm({

        ...form,

        frame_type: value,

        frame_quantity: 0,

        frame_price: 0,
      });

      return;
    }

    // =====================================
    // GLASS NOT REQUIRED
    // =====================================
    if (
      name === "glass_type" &&
      value === "Not Required"
    ) {

      setForm({

        ...form,

        glass_type: value,

        glass_quantity: 0,

        glass_price: 0,
      });

      return;
    }

    // =====================================
    // LENS NOT REQUIRED
    // =====================================
    if (
      name === "lens_type" &&
      value === "Not Required"
    ) {

      setForm({

        ...form,

        lens_type: value,
      });

      return;
    }

    setForm({

      ...form,

      [name]: value,
    });
  };

  // =====================================
  // UPDATE INVOICE
  // =====================================
  const handleSubmit = async () => {

    try {

      const payload = {

        ...form,

        frame_quantity:
          Number(
            form.frame_quantity || 0
          ),

        frame_price:
          Number(
            form.frame_price || 0
          ),

        glass_quantity:
          Number(
            form.glass_quantity || 0
          ),

        glass_price:
          Number(
            form.glass_price || 0
          ),
      };

      await API.put(
        `update-invoice/${invoice.invoice_id}/`,
        payload
      );

      alert(
        "Invoice Updated Successfully"
      );

      onSuccess();

      onClose();

    } catch (err) {

      console.error(err);

      alert(
        err?.response?.data?.error ||
        "Failed to update invoice"
      );
    }
  };

  return (

    <div className="fixed inset-0 bg-black/50 flex justify-center items-start z-50 p-4 overflow-y-auto">

      {/* ===================================== */}
      {/* MODAL */}
      {/* ===================================== */}
      <div className="bg-white rounded-2xl w-full max-w-5xl p-8 my-10 relative max-h-[95vh] overflow-y-auto">

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-5 right-6 text-red-500 text-3xl font-bold hover:text-red-700"
        >
          ×
        </button>

        {/* HEADER */}
        <h2 className="text-3xl font-bold text-slate-800 mb-10">
          Edit Invoice
        </h2>

        {/* ===================================== */}
        {/* FRAME DETAILS */}
        {/* ===================================== */}
        <h3 className="text-xl font-bold mb-5 text-slate-800">
          Frame Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">

          {/* FRAME TYPE */}
          <select
            name="frame_type"
            value={form.frame_type}
            onChange={handleChange}
            className="border border-slate-300 rounded-xl px-4 py-3"
          >

            <option value="Metal">
              Metal
            </option>

            <option value="Plastic">
              Plastic
            </option>

            <option value="Three-pic">
              Three-pic
            </option>

            <option value="Carbon">
              Carbon
            </option>

            <option value="Supra">
              Supra
            </option>

            <option value="Goggle">
              Goggle
            </option>

            <option value="Others">
              Others
            </option>

            <option value="Not Required">
              Not Required
            </option>

          </select>

          {/* FRAME QUANTITY */}
          <input
            type="number"
            name="frame_quantity"
            value={form.frame_quantity}
            onChange={handleChange}
            placeholder="Frame Quantity"
            disabled={
              form.frame_type ===
              "Not Required"
            }
            className="border border-slate-300 rounded-xl px-4 py-3 disabled:bg-slate-100"
          />

          {/* FRAME PRICE */}
          <input
            type="number"
            step="0.01"
            name="frame_price"
            value={form.frame_price}
            onChange={handleChange}
            placeholder="Frame Price"
            disabled={
              form.frame_type ===
              "Not Required"
            }
            className="border border-slate-300 rounded-xl px-4 py-3 disabled:bg-slate-100"
          />

        </div>

        {/* ===================================== */}
        {/* GLASS DETAILS */}
        {/* ===================================== */}
        <h3 className="text-xl font-bold mb-5 text-slate-800">
          Glass Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">

          {/* GLASS TYPE */}
          <select
            name="glass_type"
            value={form.glass_type}
            onChange={handleChange}
            className="border border-slate-300 rounded-xl px-4 py-3"
          >

            <option value="">
              Select Glass
            </option>

            <option value="Single Vision">
              Single Vision
            </option>

            <option value="Blue Cut">
              Blue Cut
            </option>

            <option value="Progressive">
              Progressive
            </option>

            <option value="Bifocal">
              Bifocal
            </option>

            <option value="Photochromic">
              Photochromic
            </option>

            <option value="Not Required">
              Not Required
            </option>

          </select>

          {/* GLASS QUANTITY */}
          <input
            type="number"
            name="glass_quantity"
            value={form.glass_quantity}
            onChange={handleChange}
            placeholder="Glass Quantity"
            disabled={
              form.glass_type ===
              "Not Required"
            }
            className="border border-slate-300 rounded-xl px-4 py-3 disabled:bg-slate-100"
          />

          {/* GLASS PRICE */}
          <input
            type="number"
            step="0.01"
            name="glass_price"
            value={form.glass_price}
            onChange={handleChange}
            placeholder="Glass Price"
            disabled={
              form.glass_type ===
              "Not Required"
            }
            className="border border-slate-300 rounded-xl px-4 py-3 disabled:bg-slate-100"
          />

        </div>

        {/* ===================================== */}
        {/* LENS TYPE */}
        {/* ===================================== */}
        <div className="mb-10">

          <label className="text-xl font-bold block mb-5 text-slate-800">
            Lens Type
          </label>

          <select
            name="lens_type"
            value={form.lens_type}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-xl px-4 py-3"
          >

            <option value="">
              Select Lens
            </option>

            <option value="Blue Cut">
              Blue Cut
            </option>

            <option value="Progressive">
              Progressive
            </option>

            <option value="CR">
              CR
            </option>

            <option value="Photochromic">
              Photochromic
            </option>

            <option value="Not Required">
              Not Required
            </option>

          </select>

        </div>

        {/* ===================================== */}
        {/* EYE PRESCRIPTION */}
        {/* ===================================== */}
        <h3 className="text-xl font-bold mb-5 text-slate-800">
          Eye Prescription
        </h3>

        <div className="overflow-x-auto mb-10">

          <table className="w-full border border-slate-300">

            <thead>

              <tr className="bg-slate-100">

                <th className="border p-4">
                  Eye
                </th>

                <th className="border p-4">
                  SPH
                </th>

                <th className="border p-4">
                  CYL
                </th>

                <th className="border p-4">
                  AXIS
                </th>

                <th className="border p-4">
                  ADD
                </th>

              </tr>

            </thead>

            <tbody>

              {/* RIGHT EYE */}
              <tr>

                <td className="border px-4 py-3 font-semibold">
                  RE
                </td>

                {/* RIGHT SPH */}
                <td className="border p-2">

                  <select
                    name="right_sph"
                    value={form.right_sph || ""}
                    onChange={handleChange}
                    className="w-full outline-none bg-transparent"
                  >

                    <option value="">
                      Select
                    </option>

                    {powerOptions.map((power) => (

                      <option
                        key={power}
                        value={power}
                      >
                        {power}
                      </option>

                    ))}

                  </select>

                </td>

                {/* RIGHT CYL */}
                <td className="border p-2">

                  <select
                    name="right_cyl"
                    value={form.right_cyl || ""}
                    onChange={handleChange}
                    className="w-full outline-none bg-transparent"
                  >

                    <option value="">
                      Select
                    </option>

                    {powerOptions.map((power) => (

                      <option
                        key={power}
                        value={power}
                      >
                        {power}
                      </option>

                    ))}

                  </select>

                </td>

                {/* RIGHT AXIS */}
                <td className="border p-2">

                  <input
                    type="text"
                    name="right_axis"
                    value={form.right_axis || ""}
                    onChange={handleChange}
                    className="w-full outline-none"
                  />

                </td>

                {/* RIGHT ADD */}
                <td className="border p-2">

                  <input
                    type="text"
                    name="right_add"
                    value={form.right_add || ""}
                    onChange={handleChange}
                    className="w-full outline-none"
                  />

                </td>

              </tr>

              {/* LEFT EYE */}
              <tr>

                <td className="border px-4 py-3 font-semibold">
                  LE
                </td>

                {/* LEFT SPH */}
                <td className="border p-2">

                  <select
                    name="left_sph"
                    value={form.left_sph || ""}
                    onChange={handleChange}
                    className="w-full outline-none bg-transparent"
                  >

                    <option value="">
                      Select
                    </option>

                    {powerOptions.map((power) => (

                      <option
                        key={power}
                        value={power}
                      >
                        {power}
                      </option>

                    ))}

                  </select>

                </td>

                {/* LEFT CYL */}
                <td className="border p-2">

                  <select
                    name="left_cyl"
                    value={form.left_cyl || ""}
                    onChange={handleChange}
                    className="w-full outline-none bg-transparent"
                  >

                    <option value="">
                      Select
                    </option>

                    {powerOptions.map((power) => (

                      <option
                        key={power}
                        value={power}
                      >
                        {power}
                      </option>

                    ))}

                  </select>

                </td>

                {/* LEFT AXIS */}
                <td className="border p-2">

                  <input
                    type="text"
                    name="left_axis"
                    value={form.left_axis || ""}
                    onChange={handleChange}
                    className="w-full outline-none"
                  />

                </td>

                {/* LEFT ADD */}
                <td className="border p-2">

                  <input
                    type="text"
                    name="left_add"
                    value={form.left_add || ""}
                    onChange={handleChange}
                    className="w-full outline-none"
                  />

                </td>

              </tr>

            </tbody>

          </table>

        </div>

        {/* ===================================== */}
        {/* NOTE */}
        {/* ===================================== */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mb-8">

          <p className="text-yellow-800 font-medium">

            Payment details cannot be edited here.

          </p>

          <p className="text-yellow-700 text-sm mt-2">

            Use the separate "Update Payment"
            button from Invoice Management page
            to update payment status.

          </p>

        </div>

        {/* ===================================== */}
        {/* UPDATE BUTTON */}
        {/* ===================================== */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg"
        >
          Update Invoice
        </button>

      </div>

    </div>
  );
}

export default EditInvoiceModal;