import React, { useState } from "react";
import axios from "axios";
import "./Css/addPassportInfo.css";
import Navbar from "./navBar";
import Footer from "../Footer/footer";
import Loader from "../Loader/loader";

const AddPassportInfo = () => {
  const [nic, setNIC] = useState("");
  const [passportId, setPassportId] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loader, setLoader] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");

    const currentDate = new Date();
    const issDate = new Date(issueDate);
    const expDate = new Date(expiryDate);

    const nicRegex = /^(?:\d{9}(?:[vVxX]|\d{3}))|(?:\d{12})$/;

    if (nic.trim() === "") {
      setErrorMessage("NIC number cannot be empty!");
      return;
    }
    if (!nicRegex.test(nic)) {
      setErrorMessage("Invalid NIC Number!");
      return;
    }

    if (passportId.trim() === "") {
      setErrorMessage("Passport ID cannot be empty!");
      return;
    }
    if (issueDate.trim() === "") {
      setErrorMessage("Provide Valid Issue Date!");
      return;
    }
    if (expiryDate.trim() === "") {
      setErrorMessage("Provide Valid Expired Date!");
      return;
    }
    if (issDate > currentDate) {
      setErrorMessage("Issue Date cannot be in Future");
      return;
    }

    if (expDate < currentDate) {
      setErrorMessage("Passport is Expired");
      return;
    }

    try {
      setLoader(true);
      await axios
        .post("http://localhost:8080/addpassportinfo", {
          NIC: nic,
          passportid: passportId,
          passportissuedate: issueDate,
          passportexpirydate: expiryDate,
        })
        .then((res) => {
          if (res.status === 200) {
            // Success
            console.log("Passport Info added successfully");
            alert("New Passport Information Added Successfully!");
            setLoader(false);
          } else {
            // Error
            console.log("Failed to add new Passport Information");
            alert("Failed to add new Passport Information!");
            setLoader(false);
          }
          setLoader(false);
        });
    } catch (error) {
      console.error("Error adding new Passport Information", error);
      alert("Error adding new Passport Information!");
      setLoader(false);
    }
  }

  return (
    <div>
      {loader && <Loader />}
      <Navbar />
      <div className="add-passport-info">
        <h1>Add Passport Info</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nic">NIC</label>
            <input
              type="text"
              id="nic"
              value={nic}
              onChange={(e) => setNIC(e.target.value)}
              placeholder="NIC"
            />
          </div>

          <div className="form-group">
            <label htmlFor="passport-id">Passport ID</label>
            <input
              type="text"
              id="passport-id"
              value={passportId}
              onChange={(e) => setPassportId(e.target.value)}
              placeholder="Passport ID"
            />
          </div>

          <div className="form-group">
            <label htmlFor="issue-date">Issue Date</label>
            <input
              type="date"
              id="issue-date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="expiry-date">Expiry Date</label>
            <input
              type="date"
              id="expiry-date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <input
            type="submit"
            value="Submit"
            onClick={handleSubmit}
            className="submit"
          />
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default AddPassportInfo;
