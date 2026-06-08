import { getRole, logout } from "../utils/auth";

function Navbar() {
  const role = getRole();
  const username =
    localStorage.getItem(
      "username"
    );

  return (
    <div className="flex justify-between items-center bg-blue-600 text-white px-6 py-3 shadow-md">
      <h1 className="text-xl font-bold">Billing System</h1>

      <div className="flex gap-4">
        <button onClick={() => window.location.href="/dashboard"}>Dashboard</button>
        <button onClick={() => window.location.href="/create-invoice"}>Invoice</button>
        <button onClick={() => window.location.href="/search-customer"}>Search</button>
        <button onClick={() => window.location.href="/customer-history"}>History</button>
      </div>

      <div className="flex items-center gap-3">
        <span className="bg-white text-blue-600 px-3 py-1 rounded-lg text-sm">
          {username}
        </span>

        <button
          onClick={logout}
          className="bg-red-500 px-3 py-1 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;