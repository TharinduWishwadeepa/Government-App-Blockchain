import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./Css/changeIdInfo.css";
import Navbar from "./navBar";
import Footer from "../Footer/footer";
import Loader from "../Loader/loader";

function ChangeIdInfo() {
  const location = useLocation();

  const [nic, setNic] = useState("");
  const [fullname, setFullname] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (location.state && location.state.data && location.state.NIC) {
      const { data } = location.state;
      setNic(location.state.NIC);
      setFullname(data.fullname);
      setBirthdate(data.birthdate);
      setGender(data.gender);
      setAddress(data.address);
    }
  }, [location]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");

    const currentDate = new Date();
    const selectedDate = new Date(birthdate);
    const nicRegex = /^(?:\d{9}(?:[vVxX]|\d{3}))|(?:\d{12})$/;

    function getBirthdateFromNIC(nic) {
      let birthdate = "";

      if (nic.length === 10) {
        // Old format NIC: 9 digits followed by a 'v', 'V', 'x', or 'X'
        const year = parseInt(nic.substr(0, 2));
        const days = parseInt(nic.substr(2, 3));
        const isMale =
          nic.charAt(9).toLowerCase() === "v" ||
          nic.charAt(9).toLowerCase() === "x";
        const centuryPrefix = isMale ? "19" : "20";
        const fullYear = centuryPrefix + year;

        const date = new Date(fullYear, 0); // January 1st of the year
        date.setDate(date.getDate() + days - 1); // Adjust for the number of days
        birthdate = date.toISOString().split("T")[0]; // Extract the birthdate (YYYY-MM-DD format)
      } else if (nic.length === 12) {
        // New format NIC: 12 digits
        const year = parseInt(nic.substr(0, 4));
        const days = parseInt(nic.substr(4, 3));

        const date = new Date(year, 0); // January 1st of the year
        date.setDate(date.getDate() + days - 1); // Adjust for the number of days
        birthdate = date.toISOString().split("T")[0]; // Extract the birthdate (YYYY-MM-DD format)
      }

      return birthdate;
    }

    if (nic.trim() === "") {
      setErrorMessage("NIC number cannot be empty!");
      return;
    }
    if (!nicRegex.test(nic)) {
      setErrorMessage("Invalid NIC Number!");
      return;
    }
    if (fullname.trim() === "") {
      setErrorMessage("Fullname cannot be empty!");
      return;
    }
    if (birthdate.trim() === "") {
      setErrorMessage("Birthdate cannot be empty!");
      return;
    }
    if (getBirthdateFromNIC(nic) !== birthdate) {
      setErrorMessage("Birthday and NIC numbers are missmatch!");
      return;
    }
    if (selectedDate > currentDate) {
      setErrorMessage("Birthdate Cannot be in Future!");
      return;
    }
    if (gender.trim() === "") {
      setErrorMessage("Gender Cannot be Null!");
      return;
    }
    if (address.trim() === "") {
      setErrorMessage("Address cannot be empty!");
      return;
    }
    try {
      setLoader(true);
      await axios
        .post("http://localhost:8080/changeidinfo", {
          NIC: nic,
          fullname: fullname,
          birthdate: birthdate,
          gender: gender,
          address: address,
        })
        .then((res) => {
          if (res.status === 200) {
            // Success
            console.log("Citizen Data Updated Successfully!");
            alert("Citizen Data Updated Successfully!");
            setLoader(false);
          } else {
            // Error
            console.log("Failed to Update Citizen");
            alert("Failed to Update Citizen!");
            setLoader(false);
          }
          setLoader(false);
        });
    } catch (error) {
      console.error("Error updating Citizen!", error);
      alert("Error updating Citizen!");
      setLoader(false);
    }
  }

  return (
    <div>
      {loader && <Loader />}
      <Navbar />
      <div className="form-container">
        <h1>Change ID Info Step2</h1>
        <form method="POST">
          <div className="form-group">
            <label htmlFor="nic">NIC</label>
            <input
              type="text"
              id="nic"
              value={nic}
              placeholder="Ex: 982412510V/197419202757"
              onChange={(e) => setNic(e.target.value)}
              disabled
            />
          </div>
          <div className="form-group">
            <label htmlFor="fullname">Fullname</label>
            <input
              type="text"
              id="fullname"
              value={fullname}
              placeholder="Ex: Ravi Hemachandra Silva"
              onChange={(e) => setFullname(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="birthdate">Date of Birth</label>
            <input
              type="date"
              id="birthdate"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              value={address}
              placeholder="House No,Road,City,District"
              onChange={(e) => setAddress(e.target.value)}
            ></textarea>
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <input
            type="submit"
            onClick={handleSubmit}
            value="Update"
            className="submit"
          />
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default ChangeIdInfo;
