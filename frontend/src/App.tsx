import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TripList from "./components/TripList";
import TripForm from "./components/TripForm";

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <h1>ELD Tracker</h1>
        <Routes>
          <Route path="/" element={<TripList />} />
          <Route path="/create" element={<TripForm />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
