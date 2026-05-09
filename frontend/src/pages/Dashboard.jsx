import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {

  const [stats, setStats] = useState({
    total_sales: 0,
    total_invoices: 0,
    total_customers: 0,
    today_sales: 0,
  });

  // Demo Sales Data for Chart
  const salesData = [
    { month: "Jan", sales: 4000 },
    { month: "Feb", sales: 7000 },
    { month: "Mar", sales: 5000 },
    { month: "Apr", sales: 9000 },
    { month: "May", sales: 12000 },
    { month: "Jun", sales: 8000 },
  ];

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Fetch Dashboard Data
  const fetchDashboard = async () => {
    try {
      const res = await API.get("admin-dashboard/");

      setStats(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout>

      <div className="space-y-8">

        {/* Page Heading */}
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Dashboard Overview
          </h1>

          <p className="text-slate-500 mt-2">
            Welcome back! Here's your billing summary.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          {/* Total Sales */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 hover:shadow-xl transition-all duration-300">

            <p className="text-slate-500 text-sm">
              Total Sales
            </p>

            <h2 className="text-3xl font-bold text-slate-800 mt-3">
              ₹ {stats.total_sales}
            </h2>

          </div>

          {/* Total Invoices */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 hover:shadow-xl transition-all duration-300">

            <p className="text-slate-500 text-sm">
              Total Invoices
            </p>

            <h2 className="text-3xl font-bold text-slate-800 mt-3">
              {stats.total_invoices}
            </h2>

          </div>

          {/* Customers */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 hover:shadow-xl transition-all duration-300">

            <p className="text-slate-500 text-sm">
              Customers
            </p>

            <h2 className="text-3xl font-bold text-slate-800 mt-3">
              {stats.total_customers}
            </h2>

          </div>

          {/* Today's Sales */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 hover:shadow-xl transition-all duration-300">

            <p className="text-slate-500 text-sm">
              Today's Sales
            </p>

            <h2 className="text-3xl font-bold text-slate-800 mt-3">
              ₹ {stats.today_sales}
            </h2>

          </div>

        </div>

        {/* Analytics Chart */}
        <div className="bg-white rounded-2xl shadow-md p-8 border border-slate-100">

          <div className="flex items-center justify-between mb-8">

            <div>

              <h2 className="text-2xl font-bold text-slate-800">
                Sales Analytics
              </h2>

              <p className="text-slate-500 mt-1">
                Monthly revenue overview
              </p>

            </div>

          </div>

          {/* Chart */}
          <div className="h-[350px]">

            <ResponsiveContainer width="100%" height="100%">

              <LineChart data={salesData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#2563eb"
                  strokeWidth={4}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">

            <h2 className="text-xl font-bold text-slate-800 mb-4">
              Recent Activity
            </h2>

            <div className="space-y-4">

              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl">

                <div>

                  <p className="font-semibold text-slate-700">
                    New Invoice Created
                  </p>

                  <p className="text-sm text-slate-500">
                    Customer billing completed
                  </p>

                </div>

                <span className="text-sm text-slate-400">
                  Just now
                </span>

              </div>

              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl">

                <div>

                  <p className="font-semibold text-slate-700">
                    Customer Added
                  </p>

                  <p className="text-sm text-slate-500">
                    New customer saved
                  </p>

                </div>

                <span className="text-sm text-slate-400">
                  Today
                </span>

              </div>

            </div>

          </div>

          {/* Business Insights */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 text-white">

            <h2 className="text-2xl font-bold">
              Business Insights
            </h2>

            <p className="mt-4 text-blue-100 leading-relaxed">
              Your billing system is running smoothly.
              Track invoices, monitor customer activity,
              and manage sales efficiently using the dashboard.
            </p>

            <button className="mt-6 bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-100 transition-all duration-300">
              View Reports
            </button>

          </div>

        </div>

      </div>

    </Layout>
  );
}

export default Dashboard;