import React, { useState } from "react";
import axios from "axios";
import "./css/register.css";
import Navbar from "../Citizen/navBar";
import Footer from "../Footer/footer";
import Loader from "../Loader/loader";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [selectedOption, setSelectedOption] = useState("DMT");
  const [errorMessage, setErrorMessage] = useState("");
  const [loader, setLoader] = useState(false);

  async function submit(e) {
    e.preventDefault();

    setErrorMessage("");
    if (email.trim() === "") {
      setErrorMessage("Email cannot be null!");
      return;
    }
    const isValidEmail = /\S+@\S+\.\S+/.test(email);
    if (!isValidEmail) {
      setErrorMessage("email address is not valid!");
      return;
    }
    if (password.trim() === "") {
      setErrorMessage("password cannot be null!");
      return;
    }
    if (password.length < 8) {
      setErrorMessage("Password is too short!");
      return;
    }
    if (confPassword !== password) {
      setErrorMessage("Passwords Missmatch!");
      return;
    }

    if (selectedOption.trim() === "" || !selectedOption) {
      setErrorMessage("Please Select a Role!");
      return;
    }

    try {
      setLoader(true);
      await axios
        .post("http://localhost:8080/auth/register", {
          email,
          password,
          role: selectedOption,
        })
        .then((res) => {
          console.log(res.data);
          if (res.data.email === email) {
            alert("user registerd successfully");
            setLoader(false);
          } else if (res.data.email !== email) {
            setLoader(false);
            setErrorMessage("user not registered in!");
          }
          setLoader(false);
        })
        .catch((e) => {
          setLoader(false);
          setErrorMessage("Seems like User already exist with this userName!");
          console.log(e);
        });
    } catch (error) {
      setLoader(false);
      setErrorMessage("Something went Wrong!");
    }
  }

  return (
    <div>
      <Navbar />
      {loader && <Loader />}
      <div className="register">
        <h1>Create Account</h1>
        <form action="#">
          <p>Email</p>
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
          <p>Re-enter Password</p>
          <input
            type="password"
            name="pass2"
            id="pass2"
            onChange={(e) => {
              setConfPassword(e.target.value);
            }}
            placeholder="Re-enter Password"
          />
          <div>
            <p>Role</p>
            <select
              value={selectedOption}
              onChange={(e) => {
                setSelectedOption(e.target.value);
                console.log(selectedOption);
              }}
            >
              <option className="opt" value="DMT">
                DMT
              </option>
              <option className="opt" value="RGD">
                RGD
              </option>
              <option className="opt" value="DRP">
                DRP
              </option>
              <option className="opt" value="DIAE">
                DIAE
              </option>
            </select>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>

          <br />
          <input type="submit" onClick={submit} value="Create Account" />
        </form>
        <br />
      </div>
      <Footer />
    </div>
  );
}

export default Register;
