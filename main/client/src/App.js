import React from "react";
 
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
 
// We import all the components we need in our app
import Navbar from "./components/nav/navbar";
import CreateEnvelope from "./components/envelope/CreateEnvelope";
import CreateYear from "./components/year/CreateYear";
import Years from "./components/year/Years";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Years />} />
        <Route path="/:year/:month/createEnvelope" element={<CreateEnvelope />} />
        <Route path="/createYear" element={<CreateYear type="Year" />} />
      </Routes>
    </div>
  );
};
 
export default App;
