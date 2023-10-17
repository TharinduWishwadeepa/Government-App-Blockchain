import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./Css/changeDrivingLicenceInfo.css";
import Navbar from "./navBar";
import Footer from "../Footer/footer";
import Loader from "../Loader/loader";

function ChangeDrivingLicInfo() {
  const location = useLocation();

  const [nic, setNic] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [licenseIssueDate, setLicenseIssueDate] = useState("");
  const [licenseExpiryDate, setLicenseExpiryDate] = useState("");
  const [vehicleTypesSelected, setVehicleTypesSelected] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (location.state && location.state.data && location.state.NIC) {
      const { data } = location.state;
      setNic(location.state.NIC);
      setBloodGroup(data.bloodgroup);
      setLicenseIssueDate(data.drivinglicenseissuedate);
      setLicenseExpiryDate(data.drivinglicenseexpirydate);
      const selectedVehicleTypes = data.typeofvehicles.split(",");
      setVehicleTypesSelected(selectedVehicleTypes);
    }
  }, [location]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");

    const currentDate = new Date();
    const issDate = new Date(licenseIssueDate);
    const expDate = new Date(licenseExpiryDate);

    const nicRegex = /^(?:\d{9}(?:[vVxX]|\d{3}))|(?:\d{12})$/;

    if (nic.trim() === "") {
      setErrorMessage("NIC number cannot be empty!");
      return;
    }
    if (!nicRegex.test(nic)) {
      setErrorMessage("Invalid NIC Number!");
      return;
    }
    if (bloodGroup.trim() === "") {
      setErrorMessage("Blood Group is Empty!");
      return;
    }

    if (licenseIssueDate.trim() === "") {
      setErrorMessage("Provide Valid Issue Date!");
      return;
    }
    if (licenseExpiryDate.trim() === "") {
      setErrorMessage("Provide Valid Expired Date!");
      return;
    }
    if (issDate > currentDate) {
      setErrorMessage("Issue Date cannot be in Future");
      return;
    }

    if (expDate < currentDate) {
      setErrorMessage("License is Expired");
      return;
    }
    if (vehicleTypesSelected.length === 0) {
      setErrorMessage("Please Select Vehicle Type!");
      return;
    }

    // Validate form data
    if (
      !nic ||
      !bloodGroup ||
      !licenseIssueDate ||
      !licenseExpiryDate ||
      vehicleTypesSelected.length === 0
    ) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {
      setLoader(true);
      // Combine selected vehicle types into a single string
      const vehicleTypesString = vehicleTypesSelected.join(", ");
      // Make API request to save driving license info
      await axios
        .post("http://localhost:8080/changeDrivingLicInfo", {
          NIC: nic,
          bloodgroup: bloodGroup,
          drivinglicenseissuedate: licenseIssueDate,
          drivinglicenseexpirydate: licenseExpiryDate,
          typeofvehicles: vehicleTypesString,
        })
        .then((res) => {
          if (res.status === 200) {
            // Success
            console.log(" License Info Updated successfully");
            alert("License Information Updated Successfully!");
            setLoader(false);
          } else {
            // Error
            console.log("Failed to Update License Information");
            alert("Failed to Update License Information!");
            setLoader(false);
          }
          setLoader(false);
        });
    } catch (error) {
      console.error("Error Update License Information", error);
      alert("Error Update License Information!");
      setLoader(false);
    }
  }
  const bloodGroupOptions = ["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"];
  const vehicleTypeOptions = [
    "A",
    "B1",
    "C",
    "A1",
    "B",
    "C1",
    "CE",
    "D1",
    "D",
    "DE",
    "G1",
    "G",
    "J",
  ];
  const handleVehicleTypeChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setVehicleTypesSelected((prevSelected) => [...prevSelected, value]);
    } else {
      setVehicleTypesSelected((prevSelected) =>
        prevSelected.filter((type) => type !== value)
      );
    }
  };

  return (
    <div>
      {loader && <Loader />}
      <Navbar />
      <div className="add-driving-lic-info">
        <h1>Change License Information</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>NIC:</label>
            <input
              type="text"
              value={nic}
              onChange={(e) => setNic(e.target.value)}
              placeholder="NIC"
              disabled
            />
          </div>

          <div className="form-group">
            <label>Blood Group:</label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
            >
              {bloodGroupOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>License Issue Date:</label>
            <input
              type="date"
              value={licenseIssueDate}
              onChange={(e) => setLicenseIssueDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>License Expiry Date:</label>
            <input
              type="date"
              value={licenseExpiryDate}
              onChange={(e) => setLicenseExpiryDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Type of Vehicles:</label>
            <div className="checkbox-grid">
              {vehicleTypeOptions.map((type) => (
                <label key={type}>
                  <input
                    type="checkbox"
                    value={type}
                    checked={vehicleTypesSelected.includes(type)}
                    onChange={handleVehicleTypeChange}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <input
            type="submit"
            value="Update"
            onClick={handleSubmit}
            className="submit"
          />
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default ChangeDrivingLicInfo;
