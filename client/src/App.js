import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./Auth/login";
import Register from "./Auth/register";
import Home from "./Auth/home";
import AddCitizen from "./Citizen/addCitizen";
import AddBirthInfo from "./Citizen/addBirthInfo";
import AddPassportInfo from "./Citizen/addPassportInfo";
import AddDrivingLicInfo from "./Citizen/addDrivingLicInfo";
import ChangeIdInfo from "./Citizen/changeIdInfo";
import ChangeBirthInfo from "./Citizen/changeBirthInfo";
import ChangePassportInfo from "./Citizen/changePassportInfo";
import ChangeDrivingLicInfo from "./Citizen/changeDrivingLicenceInfo";
import PrivateRoutes from "./Auth/PrivateRoutes/privateRoutes";
import RgdRoutes from "./Auth/PrivateRoutes/rgdRoutes";
import DrpRoutes from "./Auth/PrivateRoutes/drpRoutes";
import DmtRoutes from "./Auth/PrivateRoutes/dmtRoutes";
import DiaeRoutes from "./Auth/PrivateRoutes/diaeRoutes";
import UserList from "./Auth/userList";
import GetHistory from "./Citizen/viewCitizen";
import GetCitizen from "./Citizen/viewCitizenWorldState";
import ChangeIdNIC from "./Citizen/changeIdNIC";
import ChangeBirthInfoNIC from "./Citizen/changeBirthInfoNIC";
import ChangeDrivingLicenceInfoNIC from "./Citizen/changeDrivingLicenceInfoNIC";
import ChangePassportInfoNIC from "./Citizen/changePassportInfoNIC";
import AddGovOrg from "./Citizen/addGovOrg";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/home" element={<Home />} />
            <Route path="/getHistory" element={<GetHistory />} />
            <Route path="/getWorldState" element={<GetCitizen />} />
          </Route>

          <Route element={<DrpRoutes />}>
            <Route path="/signup" element={<Register />} />
            <Route path="/addCitizen" element={<AddCitizen />} />
            <Route path="/changeIdInfo" element={<ChangeIdInfo />} />
            <Route path="/changeIdNIC" element={<ChangeIdNIC />} />
            <Route path="/getAll" element={<UserList />} />
            <Route path="/createGovOrg" element={<AddGovOrg />} />
          </Route>

          <Route element={<RgdRoutes />}>
            <Route path="/changeBirthInfo" element={<ChangeBirthInfo />} />
            <Route path="/addBirthInfo" element={<AddBirthInfo />} />
            <Route path="/changeBirthNIC" element={<ChangeBirthInfoNIC />} />
          </Route>

          <Route element={<DiaeRoutes />}>
            <Route path="/addPassportInfo" element={<AddPassportInfo />} />
            <Route
              path="/changePassportInfo"
              element={<ChangePassportInfo />}
            />
            <Route
              path="/changePassportInfoNIC"
              element={<ChangePassportInfoNIC />}
            />
          </Route>

          <Route element={<DmtRoutes />}>
            <Route path="/addDrivingLicInfo" element={<AddDrivingLicInfo />} />
            <Route
              path="/changeDrivingLicInfo"
              element={<ChangeDrivingLicInfo />}
            />
            <Route
              path="/changeDrivingLicInfoNIC"
              element={<ChangeDrivingLicenceInfoNIC />}
            />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
