import jwtDecode from "jwt-decode";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoutes = () => {
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

  return token && !isTokenExpired ? (
    <Outlet />
  ) : (
    (localStorage.clear(), (<Navigate to="/login" />))
  );
};

export default PrivateRoutes;
