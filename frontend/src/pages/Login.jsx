import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {

    try {

      const res = await API.post(
        "login/",
        form
      );

      // DEBUG RESPONSE
      console.log(
        "LOGIN RESPONSE:",
        res.data
      );

      // Save JWT token
      localStorage.setItem(
        "token",
        res.data.access
      );

      // Save JWT Refresh
      localStorage.setItem(
        "refresh",
        res.data.refresh
      );

      // Save role
      localStorage.setItem(
        "role",
        res.data.role
      );

      // Username on the navbar
      localStorage.setItem(
        "username",
        res.data.username
      );

      // DEBUG STORAGE
      console.log(
        "TOKEN SAVED:",
        localStorage.getItem("token")
      );

      toast.success("Login Successful");

      // Redirect
      //navigate("/dashboard");
      if (res.data.role === "admin") {

        navigate("/dashboard");

      } else {

        navigate("/create-invoice");
      }

    } catch (err) {

      console.error(err);

      toast.error(
        "Invalid credentials or server error"
      );
    }
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 flex items-center justify-center p-6 overflow-hidden">

      {/* Glow Effect */}
      <div className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-3xl rounded-full top-[-100px] left-[-100px]" />

      <div className="absolute w-[400px] h-[400px] bg-indigo-500/20 blur-3xl rounded-full bottom-[-100px] right-[-100px]" />

      {/* Login Card */}
      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-10">

        {/* Logo */}
        <div className="flex justify-center mb-6">

          <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl">

            B

          </div>

        </div>

        {/* Heading */}
        <div className="text-center mb-10">

          <h1 className="text-4xl font-bold text-white">
            Welcome Back
          </h1>

          <p className="text-slate-300 mt-3">
            Login to continue to BillingPro
          </p>

        </div>

        {/* Form */}
        <div className="space-y-6">

          {/* Username */}
          <div>

            <label className="block text-slate-300 mb-2 text-sm">
              Username
            </label>

            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              onChange={handleChange}
              className="w-full bg-white/10 border border-white/10 text-white placeholder:text-slate-400 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all duration-300"
            />

          </div>

          {/* Password */}
          <div>

            <label className="block text-slate-300 mb-2 text-sm">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              className="w-full bg-white/10 border border-white/10 text-white placeholder:text-slate-400 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all duration-300"
            />

          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-4 rounded-2xl font-semibold text-lg shadow-xl transition-all duration-300 hover:scale-[1.02]"
          >

            Login

          </button>

        </div>

        {/* Footer */}
        <div className="mt-8 text-center">

          <p className="text-slate-400 text-sm">
            Smart Billing & Invoice Management
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;