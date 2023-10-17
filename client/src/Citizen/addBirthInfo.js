import React, { useState } from "react";
import "./Css/addBirthInfo.css";
import Navbar from "./navBar";
import Footer from "../Footer/footer";
import Loader from "../Loader/loader";
import axios from "axios";

function AddBirthInfo() {
  const [nic, setNic] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [religion, setReligion] = useState("Buddhism");
  const [nationality, setNationality] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loader, setLoader] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");
    const nicRegex = /^(?:\d{9}(?:[vVxX]|\d{3}))|(?:\d{12})$/;

    if (nic.trim() === "") {
      setErrorMessage("NIC number cannot be empty!");
      return;
    }
    if (!nicRegex.test(nic)) {
      setErrorMessage("Invalid NIC Number!");
      return;
    }
    if (fatherName.trim() === "") {
      setErrorMessage("Father's Name Cannot be Null!");
      return;
    }
    if (motherName.trim() === "") {
      setErrorMessage("Mother's Name Cannot be Null!");
      return;
    }
    if (birthPlace.trim() === "") {
      setErrorMessage("Birth Place Cannot be Null!");
      return;
    }
    if (religion.trim() === "") {
      setErrorMessage("Please Select a Religion!");
      return;
    }
    if (nationality.trim() === "") {
      setErrorMessage("Nationality Cannot be Null!");
      return;
    }
    try {
      setLoader(true);
      await axios
        .post("http://localhost:8080/addBirthInfo", {
          NIC: nic,
          fathername: fatherName,
          mothername: motherName,
          birthplace: birthPlace,
          religion: religion,
          nationality: nationality,
        })
        .then((res) => {
          if (res.status === 200) {
            // Success
            console.log("Birth Information Added successfully");
            alert("Birth Information Added Successfully!");
            setLoader(false);
          } else {
            // Error
            console.log("Failed to add New Birth Information");
            alert("Failed to add New Birth Information!");
            setLoader(false);
          }
          setLoader(false);
        });
    } catch (error) {
      console.error("Error adding Birth Info", error);
      alert("Error adding new Birth Information!");
      setLoader(false);
    }
  }

  const religionOptions = [
    "Buddhism",
    "Islam",
    "Hinduism",
    "Christianity",
    "Other",
  ];

  return (
    <div>
      {loader && <Loader />}
      <Navbar />
      <div className="form-container">
        <h1>Add Birth Information</h1>
        <form>
          <div className="form-group">
            <label htmlFor="nic">NIC:</label>
            <input
              type="text"
              id="nic"
              value={nic}
              onChange={(e) => setNic(e.target.value)}
              placeholder="Enter NIC"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="fatherName">Father's Name:</label>
            <input
              type="text"
              id="fatherName"
              value={fatherName}
              onChange={(e) => setFatherName(e.target.value)}
              placeholder="Enter Father's Name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="motherName">Mother's Name:</label>
            <input
              type="text"
              id="motherName"
              value={motherName}
              onChange={(e) => setMotherName(e.target.value)}
              placeholder="Enter Mother's Name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="birthPlace">Birth Place:</label>
            <input
              type="text"
              id="birthPlace"
              value={birthPlace}
              onChange={(e) => setBirthPlace(e.target.value)}
              placeholder="Enter Birth Place"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="religion">Religion:</label>
            <select
              value={religion}
              onChange={(e) => setReligion(e.target.value)}
            >
              {religionOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="nationality">Nationality:</label>
            <input
              type="text"
              id="nationality"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              placeholder="Enter Nationality"
              required
            />
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <input
            type="submit"
            onClick={handleSubmit}
            value="Submit"
            className="submit"
          />
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default AddBirthInfo;
