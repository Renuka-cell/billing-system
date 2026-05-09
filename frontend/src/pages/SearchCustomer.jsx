import { useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

function SearchCustomer() {
  const [mobile, setMobile] = useState("");
  const [customer, setCustomer] = useState(null);

  // Search Customer
  const handleSearch = async () => {
    try {
      const res = await API.get(
        `search-customer/?query=${mobile}`
      );

      setCustomer(res.data);

    } catch (err) {
      console.error(err);

      alert("Customer not found");

      setCustomer(null);
    }
  };

  return (
    <Layout>

      <div className="space-y-8">

        {/* Heading */}
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Search Customer
          </h1>

          <p className="text-slate-500 mt-2">
            Find customer details instantly using mobile number.
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-2xl shadow-md p-8 border border-slate-100">

          <h2 className="text-xl font-bold text-slate-800 mb-6">
            Customer Lookup
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

        {/* Customer Result */}
        {customer && (

          <div className="bg-white rounded-2xl shadow-md p-8 border border-slate-100">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

              {/* Left Section */}
              <div className="flex items-center gap-5">

                {/* Avatar */}
                <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg">
                  {customer.name?.charAt(0).toUpperCase()}
                </div>

                {/* Details */}
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

              {/* Status Card */}
              <div className="bg-green-100 text-green-700 px-6 py-3 rounded-2xl font-semibold text-center">
                Existing Customer
              </div>

            </div>

          </div>

        )}

        {/* Empty State */}
        {!customer && (

          <div className="bg-white rounded-2xl shadow-md p-12 border border-slate-100 text-center">

            <div className="text-6xl mb-4">
              🔍
            </div>

            <h2 className="text-2xl font-bold text-slate-700">
              Search for a customer
            </h2>

            <p className="text-slate-500 mt-3">
              Enter a mobile number to view customer details.
            </p>

          </div>

        )}

      </div>

    </Layout>
  );
}

export default SearchCustomer;