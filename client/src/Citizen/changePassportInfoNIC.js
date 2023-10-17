import React, { useState } from "react";
import Footer from "../Footer/footer";
import Navbar from "./navBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Css/changeIdNIC.css";
import Loader from "../Loader/loader";

const ChangePassportInfoNIC = () => {
  const navigate = useNavigate();

  const [nic, setNic] = useState("");
  const [error, setError] = useState("");
  const [loader, setLoader] = useState(false);

  const handleInputChange = (event) => {
    setNic(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      setLoader(true);
      const response = await axios.get(
        `http://localhost:8080/viewcitizen/${nic}`
      );

      if (response.status === 200) {
        navigate("/changePassportInfo", {
          state: { NIC: nic, data: response.data },
        });
        setLoader(false);
      } else {
        setError("Error Fetching User Data!");
        setLoader(false);
      }
      setLoader(false);
    } catch (error) {
      setError("Something Went Wrong! " + error.message);
      setLoader(false);
    }
  };

  return (
    <div>
      {loader && <Loader />}
      <Navbar />
      <div className="container">
        <div className="get-nic">
          <h1>Update User Step 1</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="nic">NIC:</label>
            <input
              type="text"
              id="nic"
              value={nic}
              onChange={handleInputChange}
              placeholder="Enter NIC"
              required
            />
            <button type="submit">Find User</button>
          </form>
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ChangePassportInfoNIC;
