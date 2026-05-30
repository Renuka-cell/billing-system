import { useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import toast from "react-hot-toast";

function SearchCustomer() {

  const [name, setName] =
    useState("");

  const [mobile, setMobile] =
    useState("");

  const [customer, setCustomer] =
    useState(null);

  const [searched, setSearched] =
    useState(false);

  // =====================================
  // SEARCH CUSTOMER
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

        `search-customer/?name=${name}&mobile=${mobile}`

      );

      setCustomer(res.data);

      setSearched(true);

    } catch (err) {

      console.error(err);

      setCustomer(null);

      setSearched(true);
    }
  };

  return (

    <Layout>

      <div className="space-y-8">

        {/* HEADER */}
        <div>

          <h1 className="text-3xl font-bold text-slate-800">
            Search Customer
          </h1>

          <p className="text-slate-500 mt-2">
            Find customer details using
            customer name and mobile number.
          </p>

        </div>

        {/* SEARCH CARD */}
        <div className="bg-white rounded-2xl shadow-md p-8 border border-slate-100">

          <h2 className="text-xl font-bold text-slate-800 mb-6">
            Customer Lookup
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

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

          </div>

          <button
            onClick={handleSearch}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:opacity-90 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg"
          >
            Search
          </button>

        </div>

        {/* CUSTOMER FOUND */}
        {customer && (

          <div className="bg-white rounded-2xl shadow-md p-8 border border-slate-100">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

              <div className="flex items-center gap-5">

                <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg">

                  {customer.name?.charAt(0).toUpperCase()}

                </div>

                <div>

                  <h2 className="text-2xl font-bold text-slate-800">
                    {customer.name}
                  </h2>

                  <p className="text-slate-500 mt-1">
                    {customer.email}
                  </p>

                  <p className="text-slate-500 mt-1">
                    {customer.mobile}
                  </p>

                </div>

              </div>

              <div className="bg-green-100 text-green-700 px-6 py-3 rounded-2xl font-semibold text-center">

                Existing Customer

              </div>

            </div>

          </div>

        )}

        {/* CUSTOMER NOT FOUND */}
        {searched && !customer && (

          <div className="bg-white rounded-2xl shadow-md p-12 border border-slate-100 text-center">

            <div className="text-6xl mb-4">
              ❌
            </div>

            <h2 className="text-2xl font-bold text-red-600">
              Customer Not Found
            </h2>

            <p className="text-slate-500 mt-3">
              No customer exists with the entered details.
            </p>

          </div>

        )}

      </div>

    </Layout>
  );
}

export default SearchCustomer;