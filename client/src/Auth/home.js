import jwtDecode from "jwt-decode";
import "./css/home.css";
import Navbar from "../Citizen/navBar";
import Footer from "../Footer/footer";
import UserList from "./userList";

function Home() {
  let token = localStorage.getItem("Token");
  let decodeToken = jwtDecode(token);
  const userName = decodeToken.email;
  const role = decodeToken.role;

  const isTokenExpired = () => {
    if (!token) return true; // No token available, consider it expired
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convert current time to seconds
    return decodedToken.exp < currentTime; // Compare expiration time with current time
  };
  return (
    <div className="Home">
      <Navbar />
      <h1>home Page {userName}</h1>
      {role === "DRP" && !isTokenExpired() ? (
        <UserList />
      ) : (
        <p>
          {role === "DRP" &&
            "The token has expired. Please re-login to see the data."}
        </p>
      )}
      <Footer />
    </div>
  );
}

export default Home;
