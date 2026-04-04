import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import api from "../api/axios";

export default function RequireAdmin() {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!token) {
      setIsAuthorized(false);
      return;
    }

    const verifyToken = async () => {
      try {
        await api.get("/admin/me");
        setIsAuthorized(true);
      } catch (err) {
        setIsAuthorized(false);
      }
    };

    verifyToken();
  }, [token]);

  if (isAuthorized === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}
