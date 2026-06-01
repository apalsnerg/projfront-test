import { isAuthenticated } from "../models/auth";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;
