import React, { useState } from "react";
import axios from "axios";
import Navbar from "./navBar";
import Footer from "../Footer/footer";
import "./Css/viewCitizen.css";
import { Card } from "react-bootstrap";
import Loader from "../Loader/loader";

function GetHistory() {
  const [nic, setNic] = useState("");
  const [history, setHistory] = useState([]);
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
        `http://localhost:8080/gethistory/${nic}`
      );

      if (response.status === 200) {
        setHistory(response.data);
        // setHistory(JSON.stringify(response.data));
        // console.log("resdata "+history[1].Value);
        console.log(response.data);

        setLoader(false);
      }
      setLoader(false);
    } catch (error) {
      setError("Error retrieving history" + error.message);
      setLoader(false);
    }
    console.log("res " + history[0].Value);
  };

  function convertEpochToTime(epoch) {
    const date = new Date(epoch * 1000);
    const formattedDate = date.toLocaleString();
    return formattedDate;
  }

  function convertToPascalCase(key) {
    const words = key.split(" ");
    const capitalizedWords = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    );
    return capitalizedWords.join(" ");
  }

  return (
    <div>
      {loader && <Loader />}
      <Navbar />
      <div className="get-history-container">
        <h1>Get History of Citizen Information</h1>
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
          <button type="submit">Get History</button>
        </form>
        {error && <p className="error-message">{error}</p>}
        {history &&
          history.map((item, index) => (
            <Card key={index}>
              <Card.Title>
                <strong>TimeStamp: </strong>
                {convertEpochToTime(item.Timestamp.seconds)}
              </Card.Title>
              <Card.Body>
                {Object.entries(item.Value).map(([key, value]) => (
                  <div key={key}>
                    <strong>{convertToPascalCase(key)}: </strong> {value}
                  </div>
                ))}
              </Card.Body>
            </Card>
          ))}
        {/* {history && <p className="history">{history}</p>} */}
      </div>
      <Footer />
    </div>
  );
}

export default GetHistory;
