import React from 'react';

// We use Route in order to define the different routes of our application
import { Route, Routes } from 'react-router-dom';

// We import all the components we need in our app
import Navbar from './components/navbar';
import YearList from './components/yearList';
import RecordList from './components/envelopeList';
import Edit from './components/edit';
import CreateEnvelope from './components/createEnvelope';
import CreateYear from './components/createYear';

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<YearList />} />
        {/* <Route exact path="/" element={<RecordList />} /> */}
        {/* <Route path="/edit/:id" element={<Edit />} /> */}
        <Route
          path="/createEnvelope"
          element={<CreateEnvelope type="Envelope" />}
        />
        <Route path="/createYear" element={<CreateYear type="Year" />} />
      </Routes>
    </div>
  );
};

export default App;
