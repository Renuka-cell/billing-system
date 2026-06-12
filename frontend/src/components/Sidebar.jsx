import {
  LayoutDashboard,
  FileText,
  Search,
  History,
  ClipboardList,
  Users,
  Settings,
  LogOut,
  X,
} from "lucide-react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}) {

  const location = useLocation();

  const navigate = useNavigate();

  //const role =
    //localStorage.getItem("role");

  const username =
    localStorage.getItem(
      "username"
    );

  // =====================================
  // MENU BASED ON ROLE
  // =====================================
  const adminMenu = [

    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },

    {
      name: "Invoice Management",
      path: "/invoice-management",
      icon: <ClipboardList size={20} />,
    },

    {
      name: "All Invoices",
      path: "/all-invoices",
      icon: <ClipboardList size={20} />,
    },

    {
      name: "Create Invoice",
      path: "/create-invoice",
      icon: <FileText size={20} />,
    },

    {
      name: "Search Customer",
      path: "/search-customer",
      icon: <Search size={20} />,
    },

    {
      name: "Customer History",
      path: "/customer-history",
      icon: <History size={20} />,
    },

    {
      name: "Staff Management",
      path: "/staff-management",
      icon: <Users size={20} />,
    },

    {
      name: "Shop Settings",
      path: "/shop-settings",
      icon: <Settings size={20} />,
    },
  ];

  const staffMenu = [

    {
      name: "Create Invoice",
      path: "/create-invoice",
      icon: <FileText size={20} />,
    },

    {
      name: "Search Customer",
      path: "/search-customer",
      icon: <Search size={20} />,
    },

    {
      name: "Customer History",
      path: "/customer-history",
      icon: <History size={20} />,
    },
  ];

  const menuItems =
    username === "admin"
      ? adminMenu
      : staffMenu;

  // =====================================
  // LOGOUT
  // =====================================
  const handleLogout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "refresh"
    );

    localStorage.removeItem(
      "role"
    );

    navigate("/");
  };

  return (
    <>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (

        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() =>
            setSidebarOpen(false)
          }
        />

      )}

      {/* SIDEBAR */}
      <div
        className={`fixed md:static z-50 top-0 left-0
        h-screen overflow-y-auto
        w-72 bg-slate-950 text-white flex flex-col shadow-2xl
        transform transition-transform duration-300
        ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }
        md:translate-x-0`}
      >

        {/* TOP */}
        <div className="p-8 border-b border-slate-800 flex items-center justify-between">

          <div>

            <h1 className="text-3xl font-bold tracking-wide">
              BillingPro
            </h1>

            <p className="text-slate-400 mt-2 text-sm">
              Smart Billing Dashboard
            </p>

          </div>

          <button
            className="md:hidden"
            onClick={() =>
              setSidebarOpen(false)
            }
          >

            <X size={26} />

          </button>

        </div>

        {/* NAVIGATION */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">

          {menuItems.map((item) => {

            const isActive =
              location.pathname === item.path;

            return (

              <Link
                key={item.path}
                to={item.path}
                onClick={() =>
                  setSidebarOpen(false)
                }
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-medium group
                ${
                  isActive
                    ? "bg-blue-600 shadow-lg text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >

                <div className="group-hover:scale-110 transition-all duration-300">
                  {item.icon}
                </div>

                <span className="text-[15px]">
                  {item.name}
                </span>

              </Link>

            );
          })}

        </div>

        {/* BOTTOM */}
        <div className="p-5 border-t border-slate-800">

          {/* USER CARD */}
          <div className="bg-slate-900 rounded-2xl p-4 mb-5">

            <p className="text-sm text-slate-400">
              Logged in as
            </p>

            <div className="flex items-center gap-3 mt-3">

              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-bold text-lg shadow-lg">

                {username
                  ? username.charAt(0).toUpperCase()
                  : "U"}

              </div>

              <div>

                <p className="font-semibold capitalize">
                  {username}
                </p>

                <p className="text-xs text-slate-400">
                  Active Session
                </p>

              </div>

            </div>

          </div>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 transition-all duration-300 py-4 rounded-2xl font-semibold shadow-lg"
          >

            <LogOut size={18} />

            Logout

          </button>

        </div>

      </div>

    </>
  );
}

export default Sidebar;