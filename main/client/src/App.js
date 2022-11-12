import React from "react";
 
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
 
// We import all the components we need in our app
import Navbar from "./components/navbar";
import YearList from "./components/yearList";
import EditEnvelope from "./components/editEnvelope";
import EditYear from "./components/editYear";
import CreateEnvelope from "./components/createEnvelope";
import CreateYear from "./components/createYear";
 
const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<YearList />} />
        <Route path="/editEnvelope/:id" element={<EditEnvelope />} />
        <Route path="/editYear/:year" element={<EditYear />} />
        <Route path="/createEnvelope/:year/:month" element={<CreateEnvelope type="Envelope" />} />
        <Route path="/createYear" element={<CreateYear type="Year" />} />
      </Routes>
    </div>
  );
};
 
export default App;
