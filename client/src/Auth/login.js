import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import "./css/login.css";
import Footer from "../Footer/footer";
import Loader from "../Loader/loader";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loader, setLoader] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErrorMessage("");
    try {
      setLoader(true);
      await axios
        .post(
          "http://localhost:8080/auth/login",
          { email, password },
          { headers: { "Cache-Control": "no-cache" } }
        )
        .then((res) => {
          const authToken = res.data;
          const decodedToken = jwtDecode(authToken);
          const userRole = decodedToken.role;

          if (authToken) {
            localStorage.setItem("Token", authToken);
            navigate("/home", { state: { id: email, role: userRole } });
          } else {
            setErrorMessage("user not signed in!");
          }

          setLoader(false);
        })
        .catch((e) => {
          setErrorMessage("Incorrect Credentails!");
          console.log(e);
          setLoader(false);
        });
    } catch (error) {
      setErrorMessage("Something went wrong!");
      setLoader(false);
    }
  }

  return (
    <div className="login">
      {loader && <Loader />}
      <h1>Login Page</h1>
      <form action="POST">
        <p>Username</p>
        <input
          type="text"
          name="name"
          id="name"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          placeholder="Email"
        />
        <p>Password</p>
        <input
          type="password"
          name="pass"
          id="pass"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          placeholder="Password"
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <br />
        <input type="submit" onClick={submit} value="Login" />
      </form>
      <br />
      <Footer />
    </div>
  );
}

export default Login;
