import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";

import InvoiceManagement from "./pages/InvoiceManagement";

import CreateInvoice from "./pages/CreateInvoice";

import SearchCustomer from "./pages/SearchCustomer";

import CustomerHistory from "./pages/CustomerHistory";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* PUBLIC */}
        <Route
          path="/"
          element={<Login />}
        />

        {/* ADMIN ONLY */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute adminOnly={true}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* INVOICE MANAGEMENT */}
        <Route
          path="/invoice-management"
          element={
            <ProtectedRoute adminOnly={true}>
              <InvoiceManagement />
            </ProtectedRoute>
          }
        />

        {/* COMMON */}
        <Route
          path="/create-invoice"
          element={
            <ProtectedRoute>
              <CreateInvoice />
            </ProtectedRoute>
          }
        />

        <Route
          path="/search-customer"
          element={
            <ProtectedRoute>
              <SearchCustomer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer-history"
          element={
            <ProtectedRoute>
              <CustomerHistory />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;