import { Menu } from "lucide-react";

function Header({ setSidebarOpen }) {

  //const role = localStorage.getItem("role");

  const username =
    localStorage.getItem(
      "username"
    );

  return (
    <div className="h-20 bg-white shadow-sm border-b border-slate-200 flex items-center justify-between px-4 md:px-8">

      {/* Left Section */}
      <div className="flex items-center gap-4">

        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden"
        >

          <Menu size={28} />

        </button>

        <div>

          <h1 className="text-2xl font-bold text-slate-800">
            Billing Dashboard
          </h1>

          <p className="text-slate-500 text-sm mt-1 hidden md:block">
            Manage invoices, customers and billing
          </p>

        </div>

      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">

        {/* Role Badge */}
        <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl text-sm font-semibold capitalize hidden sm:block">

          {username}

        </div>

        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-lg">

          {username
            ? username.charAt(0).toUpperCase()
            : "U"}

        </div>

      </div>

    </div>
  );
}

export default Header;