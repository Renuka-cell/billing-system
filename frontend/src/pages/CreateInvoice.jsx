import { useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import toast from "react-hot-toast";

function CreateInvoice() {

  // =====================================
  // POWER OPTIONS FOR SPH / CYL
  // =====================================
  const powerOptions = [];

  for (
    let i = 5;
    i >= -5;
    i -= 0.25
  ) {

    powerOptions.push(

      i > 0
        ? `+${i.toFixed(2)}`
        : i.toFixed(2)

    );
  }

  const [form, setForm] = useState({

    // CUSTOMER
    name: "",
    mobile: "",
    email: "",

    // PRODUCT
    product_description: "",

    // FRAME
    frame_type: "Metal",
    frame_quantity: 1,
    frame_price: "",

    // GLASS
    glass_type: "",
    glass_quantity: 1,
    glass_price: "",

    // LENS
    lens_type: "",

    // PAYMENT
    paid_amount: "",
    payment_mode: "Cash",

    // RIGHT EYE
    right_sph: "",
    right_cyl: "",
    right_axis: "",
    right_add: "",

    // LEFT EYE
    left_sph: "",
    left_cyl: "",
    left_axis: "",
    left_add: "",
  });

  const [pdfUrl, setPdfUrl] =
    useState("");

  const [errors, setErrors] =
    useState({});

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

        frame_price: "",
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

        glass_price: "",
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
  // SEARCH CUSTOMER
  // =====================================
  const handleSearch = async () => {

    if (!form.mobile) {

      toast.error("Enter mobile number");

      return;
    }

    try {

      const res = await API.get(
        `search-customer/?mobile=${form.mobile}`
      );

      setForm((prev) => ({

        ...prev,

        name: res.data.name || "",

        email: res.data.email || "",
      }));

      toast.success("Customer found");

    } catch (err) {

      console.error(err);

      toast.success("Customer Found");
    }
  };

  // =====================================
  // VALIDATION
  // =====================================
  const validateForm = () => {

  let newErrors = {};

  // ==========================
  // NAME VALIDATION
  // ==========================
  if (!form.name.trim()) {

    newErrors.name =
      "Customer name is required";
  }

  // ==========================
  // MOBILE VALIDATION
  // ==========================
  const mobileRegex =
    /^[0-9]{10}$/;

  if (
    !form.mobile.trim()
  ) {

    newErrors.mobile =
      "Mobile number is required";

  } else if (
    !mobileRegex.test(form.mobile)
  ) {

    newErrors.mobile =
      "Mobile number must be exactly 10 digits";
  }

  // ==========================
  // EMAIL VALIDATION
  // ==========================
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    !form.email.trim()
  ) {

    newErrors.email =
      "Email is required";

  } else if (
    !emailRegex.test(form.email)
  ) {

    newErrors.email =
      "Please enter a valid email";
  }

  // ==========================
  // FRAME VALIDATION
  // ==========================
  if (
    form.frame_type !==
      "Not Required"
  ) {

    if (
      !form.frame_price ||
      Number(form.frame_price) <= 0
    ) {

      newErrors.frame_price =
        "Valid frame price required";
    }

    if (
      !form.frame_quantity ||
      Number(form.frame_quantity) <= 0
    ) {

      newErrors.frame_quantity =
        "Valid frame quantity required";
    }
  }

  // ==========================
  // GLASS VALIDATION
  // ==========================
  if (
    form.glass_type &&
    form.glass_type !==
      "Not Required"
  ) {

    if (
      !form.glass_price ||
      Number(form.glass_price) <= 0
    ) {

      newErrors.glass_price =
        "Valid glass price required";
    }

    if (
      !form.glass_quantity ||
      Number(form.glass_quantity) <= 0
    ) {

      newErrors.glass_quantity =
        "Valid glass quantity required";
    }
  }

  // ==========================
  // PAID AMOUNT VALIDATION
  // ==========================
  if (
    form.paid_amount &&
    Number(form.paid_amount) < 0
  ) {

    newErrors.paid_amount =
      "Amount cannot be negative";
  }

  else if(
    form.paid_amount &&
    Number(form.paid_amount) > total
  ){
    newErrors.paid_amount =
      "Amount cannot be greater than total";
  }

  // ==========================
  // SAVE ERRORS
  // ==========================
  setErrors(newErrors);

  if (
    Object.keys(newErrors).length > 0
  ) {

    toast.error(
      Object.values(newErrors)[0]
    );

    return false;
  }

  return true;
};

  // =====================================
  // CREATE INVOICE
  // =====================================
  const handleSubmit = async () => {

    if (!validateForm()) {
      return;
    }

    try {

      const payload = {

        ...form,

        frame_quantity:
          parseFloat(
            form.frame_quantity
          ) || 0,

        frame_price:
          parseFloat(
            form.frame_price
          ) || 0,

        glass_quantity:
          parseFloat(
            form.glass_quantity
          ) || 0,

        glass_price:
          parseFloat(
            form.glass_price
          ) || 0,

        paid_amount:
          parseFloat(
            form.paid_amount
          ) || 0,
      };

      const res = await API.post(
        "create-invoice/",
        payload
      );

      toast.success(
        "Invoice Created Successfully"
      );

      setPdfUrl(
        `http://127.0.0.1:8000/media/${res.data.pdf}`
      );

    } catch (err) {

      console.error(err);

      toast.error(
        err?.response?.data?.error ||
        "Error creating invoice"
      );
    }
  };

  // =====================================
  // TOTALS
  // =====================================

  const frameQty =
    parseFloat(
      form.frame_quantity
    ) || 0;

  const framePrice =
    parseFloat(
      form.frame_price
    ) || 0;

  const glassQty =
    parseFloat(
      form.glass_quantity
    ) || 0;

  const glassPrice =
    parseFloat(
      form.glass_price
    ) || 0;

  const frameTotal =
    frameQty * framePrice;

  const glassTotal =
    glassQty * glassPrice;

  const total =
    frameTotal + glassTotal;

  const due =
    total -
    (
      parseFloat(
        form.paid_amount
      ) || 0
    );

  return (

    <Layout>

      <div className="space-y-8">

        {/* HEADER */}
        <div>

          <h1 className="text-3xl font-bold text-slate-800">
            Create Invoice
          </h1>

          <p className="text-slate-500 mt-2">
            Optical Billing &
            Prescription Management
          </p>

        </div>

        {/* MAIN */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="xl:col-span-2 bg-white rounded-2xl shadow-md p-8 border border-slate-100">

            {/* CUSTOMER */}
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              Customer Details
            </h2>

            <div className="mb-5">

              <label className="block mb-2 text-sm font-medium text-slate-600">
                Customer Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Customer Name"
                className={`w-full border rounded-xl px-4 py-3 ${
                  errors.name
                    ? "border-red-500"
                    : "border-slate-300"
                }`}
              />

              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name}
                </p>
              )}

            </div>

            <div className="mb-5">

              <label className="block mb-2 text-sm font-medium text-slate-600">
                Mobile Number
              </label>

              <div className="flex gap-3">

                <input
                    type="text"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    placeholder="10 digits number only"
                    className={`flex-1 rounded-xl px-4 py-3 border ${
                    errors.mobile
                      ? "border-red-500"
                      : "border-slate-300"
                  }`}
                />

                <button
                  type="button"
                  onClick={handleSearch}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl font-semibold"
                >
                  Search
                </button>

              </div>

              {errors.mobile && (

                <p className="text-red-500 text-sm mt-2">
                  {errors.mobile}
                </p>

              )}

            </div>

            <div className="mb-8">

              <label className="block mb-2 text-sm font-medium text-slate-600">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Customer's Email ID"
                className={`w-full border rounded-xl px-4 py-3 ${
                  errors.email
                    ? "border-red-500"
                    : "border-slate-300"
                }`}
              />

              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email}
                </p>
              )}

            </div>

            {/* FRAME */}
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              Frame Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

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

              <input
                type="number"
                name="frame_quantity"
                value={form.frame_quantity}
                onChange={handleChange}
                placeholder="Frame quantity"
                disabled={
                  form.frame_type ===
                  "Not Required"
                }
                className={`border rounded-xl px-4 py-3 disabled:bg-slate-100 ${
                  errors.frame_quantity
                    ? "border-red-500"
                    : "border-slate-300"
                }`}
              />

              {errors.frame_quantity && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.frame_quantity}
                </p>
              )}

              <input
                type="text"
                inputMode="decimal"
                name="frame_price"
                value={form.frame_price}
                onChange={handleChange}
                placeholder="Per Frame price"
                disabled={
                  form.frame_type ===
                  "Not Required"
                }
                className={`border rounded-xl px-4 py-3 disabled:bg-slate-100 ${
                  errors.frame_price
                    ? "border-red-500"
                    : "border-slate-300"
                }`}
              />

              {errors.frame_price && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.frame_price}
                </p>
              )}

            </div>

            {/* GLASS */}
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              Glass Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

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

              <input
                type="number"
                name="glass_quantity"
                value={form.glass_quantity}
                onChange={handleChange}
                placeholder="Glass quantity"
                disabled={
                  form.glass_type ===
                  "Not Required"
                }
                className={`border rounded-xl px-4 py-3 disabled:bg-slate-100 ${
                  errors.glass_quantity
                    ? "border-red-500"
                    : "border-slate-300"
                }`}
              />

              {errors.glass_quantity && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.glass_quantity}
                </p>
              )}

              <input
                type="text"
                inputMode="decimal"
                name="glass_price"
                value={form.glass_price}
                onChange={handleChange}
                placeholder="Per Glass price"
                disabled={
                  form.glass_type ===
                  "Not Required"
                }
                className={`border rounded-xl px-4 py-3 disabled:bg-slate-100 ${
                  errors.glass_price
                    ? "border-red-500"
                    : "border-slate-300"
                }`}
              />

              {errors.glass_price && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.glass_price}
                </p>
              )}

            </div>

            {/* LENS */}
            <div className="mb-8">

              <label className="block mb-2 text-sm font-medium text-slate-600">
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

            {/* PAYMENT */}
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              Payment Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">

              <input
                type="text"
                inputMode="decimal"
                name="paid_amount"
                value={form.paid_amount}
                onChange={handleChange}
                placeholder="Paid Amount"
                className={`border rounded-xl px-4 py-3 ${
                  errors.paid_amount
                    ? "border-red-500"
                    : "border-slate-300"
                }`}
              />

              {errors.paid_amount && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.paid_amount}
                </p>
              )}

              <select
                name="payment_mode"
                value={form.payment_mode}
                onChange={handleChange}
                className="border border-slate-300 rounded-xl px-4 py-3"
              >

                <option value="Cash">
                  Cash
                </option>

                <option value="UPI">
                  UPI
                </option>

                <option value="Card">
                  Card
                </option>

                <option value="Net Banking">
                  Net Banking
                </option>

              </select>

            </div>

            {/* EYE PRESCRIPTION */}
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              Eye Prescription
            </h2>

            <div className="overflow-x-auto mb-8">

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

                  {/* RIGHT EYE */}
                  <tr>

                    <td className="border px-4 py-3 font-semibold">
                      RE
                    </td>

                    <td className="border p-2">

                      <input
                        list="powerOptions"
                        type="text"
                        name="right_sph"
                        value={form.right_sph}
                        onChange={handleChange}
                        placeholder="Select or type"
                        className="w-full outline-none"
                      />

                    </td>

                    <td className="border p-2">

                      <input
                        list="powerOptions"
                        type="text"
                        name="right_cyl"
                        value={form.right_cyl}
                        onChange={handleChange}
                        placeholder="Select or type"
                        className="w-full outline-none"
                      />

                    </td>

                    <td className="border p-2">

                      <input
                        type="text"
                        name="right_axis"
                        value={form.right_axis}
                        onChange={handleChange}
                        className="w-full outline-none"
                      />

                    </td>

                    <td className="border p-2">

                      <input
                        type="text"
                        name="right_add"
                        value={form.right_add}
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

                    <td className="border p-2">

                      <input
                        list="powerOptions"
                        type="text"
                        name="left_sph"
                        value={form.left_sph}
                        onChange={handleChange}
                        placeholder="Select or type"
                        className="w-full outline-none"
                      />

                    </td>

                    <td className="border p-2">

                      <input
                        list="powerOptions"
                        type="text"
                        name="left_cyl"
                        value={form.left_cyl}
                        onChange={handleChange}
                        placeholder="Select or type"
                        className="w-full outline-none"
                      />

                    </td>

                    <td className="border p-2">

                      <input
                        type="text"
                        name="left_axis"
                        value={form.left_axis}
                        onChange={handleChange}
                        className="w-full outline-none"
                      />

                    </td>

                    <td className="border p-2">

                      <input
                        type="text"
                        name="left_add"
                        value={form.left_add}
                        onChange={handleChange}
                        className="w-full outline-none"
                      />

                    </td>

                  </tr>

                </tbody>

              </table>

            </div>

            {/* SUBMIT */}
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full mt-10 bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 rounded-2xl font-semibold text-lg"
            >
              Create Invoice
            </button>

          </div>

          {/* RIGHT */}
          <div className="bg-white rounded-2xl shadow-md p-8 border border-slate-100 h-fit">

            <h2 className="text-xl font-bold text-slate-800 mb-6">
              Invoice Summary
            </h2>

            <div className="space-y-5">

              <div className="flex justify-between">

                <span>
                  Customer
                </span>

                <span className="font-semibold">
                  {form.name || "N/A"}
                </span>

              </div>

              <div className="flex justify-between">

                <span>
                  Frame Total
                </span>

                <span>
                  ₹ {frameTotal}
                </span>

              </div>

              <div className="flex justify-between">

                <span>
                  Glass Total
                </span>

                <span>
                  ₹ {glassTotal}
                </span>

              </div>

              <div className="flex justify-between font-bold text-blue-700">

                <span>
                  Total
                </span>

                <span>
                  ₹ {total}
                </span>

              </div>

              <div className="flex justify-between text-red-600 font-bold">

                <span>
                  Due
                </span>

                <span>
                  ₹ {due}
                </span>

              </div>

            </div>

            {pdfUrl && (

              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-8 text-center bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-semibold"
              >
                Download Invoice PDF
              </a>

            )}

          </div>

        </div>

      </div>

      {/* POWER OPTIONS */}
      <datalist id="powerOptions">

        {powerOptions.map((value) => (

          <option
            key={value}
            value={value}
          />

        ))}

      </datalist>

    </Layout>
  );
}

export default CreateInvoice;