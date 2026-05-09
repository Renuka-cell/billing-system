import { Navigate } from "react-router-dom";
import { getRole } from "../utils/auth";

function RoleRoute({ children, allowedRoles = [] }) {
  const role = getRole();

  if (!allowedRoles.includes(role)) {
    // If role not allowed, send to dashboard (or any safe page)
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default RoleRoute;