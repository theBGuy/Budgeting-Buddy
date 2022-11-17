import React from "react";
 
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
 
// We import all the components we need in our app
import Navbar from "./components/nav/navbar";
import CreateYear from "./components/year/CreateYear";
import EditYear from "./components/year/EditYear";
import Years from "./components/year/Years";
import EnvelopeForm from "./components/envelope/EnvelopeForm";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Years />} />
        <Route path="/createYear" element={<CreateYear type="Year" />} />
        <Route path="/editYear/:year" element={<EditYear type="Year" />} />
        <Route path="/:year/:month/createEnvelope" element={<EnvelopeForm />} />
        <Route path="/:year/:month/:category/edit" element={<EnvelopeForm />} />
      </Routes>
    </div>
  );
};
 
export default App;
