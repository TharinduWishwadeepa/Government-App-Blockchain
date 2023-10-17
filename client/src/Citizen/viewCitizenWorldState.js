import React, { useState } from "react";
import axios from "axios";
import Navbar from "./navBar";
import Footer from "../Footer/footer";
import "./Css/viewCitizen.css";
import Loader from "../Loader/loader";
import { Card } from "react-bootstrap";

function GetCitizen() {
  const [nic, setNic] = useState("");
  const [history, setHistory] = useState({});
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
        setHistory(response.data);
        setLoader(false);
      }
      setLoader(false);
    } catch (error) {
      setError("Error retrieving history" + error.message);
      setLoader(false);
    }
  };

  return (
    <div>
      {loader && <Loader />}
      <Navbar />
      <div className="get-history-container">
        <h1>Get Latest Citizen Information</h1>
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
          <button type="submit">Get Information</button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <div>
          <Card>
            <Card.Body>
              {Object.entries(history).map(([key, value]) => (
                <div key={key}>
                  <strong>{key}:</strong> {value}
                </div>
              ))}
            </Card.Body>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default GetCitizen;
