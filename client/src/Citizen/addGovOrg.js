import React, { useState } from "react";
import axios from "axios";
import "../Auth/css/register.css";
import Navbar from "../Citizen/navBar";
import Footer from "../Footer/footer";
import Loader from "../Loader/loader";

const AddGovOrg = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("gov");
  const [confPassword, setConfPassword] = useState("");
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
    if (name.trim() === "") {
      setErrorMessage("Name cannot be null!");
      return;
    }
    if (role.trim() === "") {
      setErrorMessage("Role cannot be null!");
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

    try {
      setLoader(true);
      await axios
        .post("http://localhost:8080/auth/createGov", {
          email: email,
          password: password,
          name: name,
          role: role,
        })
        .then((res) => {
          console.log(res.data);
          if (res.data.email === email) {
            alert("Government Organization registerd successfully");
            setLoader(false);
          } else if (res.data.email !== email) {
            setLoader(false);
            setErrorMessage("Organization not registered in!");
          }
          setLoader(false);
        })
        .catch((e) => {
          setLoader(false);
          setErrorMessage("Seems like Email already exist with this userName!");
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
        <h1>Create Government Organization</h1>
        <form action="#">
          <p>Name</p>
          <input
            type="text"
            name="name"
            id="name"
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder="Name"
          />
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
          <p>Role</p>
          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              console.log(role);
            }}
          >
            <option className="opt" value="gov">
              Government Organization
            </option>
            <option className="opt" value="fiae">
              Foreign Immigration
            </option>
          </select>
          <div>
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
};

export default AddGovOrg;
