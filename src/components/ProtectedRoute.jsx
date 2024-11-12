import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; 
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "../Slice/AuthSlice";

const ProtectedRoute = ({ children }) => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user || !token) {
      dispatch(logout());
      toast.error("You need to log in to access this page.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else if (user.role !== "admin") {
      toast.error("Access restricted to administrators only.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  }, [user, token]);

  if (!user || !token || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
