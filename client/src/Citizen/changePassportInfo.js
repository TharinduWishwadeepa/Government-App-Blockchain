import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./Css/changePassportInfo.css";
import Navbar from "./navBar";
import Footer from "../Footer/footer";
import Loader from "../Loader/loader";

function ChangePassportInfo() {
  const location = useLocation();

  const [nic, setNic] = useState("");
  const [passportId, setPassportId] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (location.state && location.state.data && location.state.NIC) {
      const { data } = location.state;
      setNic(location.state.NIC);
      setPassportId(data.passportid);
      setIssueDate(data.passportissuedate);
      setExpiryDate(data.passportexpirydate);
    }
  }, [location]);

  const handleSubmit = async (e) => {
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
        .post("http://localhost:8080/changePassportInfo", {
          NIC: nic,
          passportid: passportId,
          passportissuedate: issueDate,
          passportexpirydate: expiryDate,
        })
        .then((res) => {
          if (res.status === 200) {
            // Success
            console.log("Passport Info Updated successfully");
            alert("Passport Information Updated Successfully!");
            setLoader(false);
          } else {
            // Error
            console.log("Failed to Update Passport Information");
            alert("Failed to Update Passport Information!");
            setLoader(false);
          }
          setLoader(false);
        });
    } catch (error) {
      console.error("Error Update Passport Information", error);
      alert("Error Update Passport Information!");
      setLoader(false);
    }
  };

  return (
    <div>
      {loader && <Loader />}
      <Navbar />
      <div className="add-passport-info">
        <h1>Change Passport Info</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nic">NIC</label>
            <input
              type="text"
              id="nic"
              value={nic}
              onChange={(e) => setNic(e.target.value)}
              placeholder="NIC"
              disabled
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
}

export default ChangePassportInfo;
