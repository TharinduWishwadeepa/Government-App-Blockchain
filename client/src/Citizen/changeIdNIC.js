import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/loader";
import Navbar from "./navBar";
import Footer from "../Footer/footer";
import axios from "axios";
import "./Css/changeIdNIC.css";

const ChangeIdNIC = () => {
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
        navigate("/changeIdInfo", { state: { NIC: nic, data: response.data } });
        setLoader(false);
      } else {
        setError("Error Fetching User Data!");
        setLoader(false);
      }
      setLoader(false);
    } catch (error) {
      setError("Something Went Wrong!  " + error.message);
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

export default ChangeIdNIC;
