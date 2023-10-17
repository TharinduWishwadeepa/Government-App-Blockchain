import jwtDecode from "jwt-decode";
import { Outlet, Navigate } from "react-router-dom";

const DiaeRoutes = () => {
  let token = localStorage.getItem("Token");
  let decodeToken;
  let expTime;
  let currentTime;
  let isTokenExpired;

  try {
    decodeToken = jwtDecode(token);
    expTime = decodeToken.exp * 1000;
    currentTime = new Date().getTime();
    isTokenExpired = currentTime > expTime;
  } catch (error) {
    return <Navigate to="/login" />;
  }

  const role = decodeToken.role;

  return token && role === "DIAE" && !isTokenExpired ? (
    <Outlet />
  ) : (
    (localStorage.clear(), (<Navigate to="/login" />))
  );
};

export default DiaeRoutes;
