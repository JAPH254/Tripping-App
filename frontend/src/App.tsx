import React from "react";
import MapComponent from "./components/MapComponent";

const App: React.FC = () => {
  return (
    <div>
      <h2>Click to Set Pickup & Dropoff Locations</h2>
      <MapComponent />
    </div>
  );
};

export default App;


// import React from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import TripList from "./components/TripList";
// import TripForm from "./components/TripForm";
// import MapComponent from "./components/MapComponent";

// const App: React.FC = () => {
//   const pickupLocation = { lat: 40.7128, lng: -74.006 };
//   const dropoffLocation = { lat: 34.0522, lng: -118.2437 };
//   return (
//     <Router>
//       <div>
//         <h1>ELD Tracker</h1>
//         <Routes>
//           <Route path="/" element={<TripList />} />
//           <Route path="/create" element={<TripForm />} />
//         </Routes>
//         <div>
//           <h2>Trip Route</h2>
//           <MapComponent pickup={pickupLocation} dropoff={dropoffLocation} />
//         </div>
//       </div>
//     </Router>
//   );
// };

// export default App;
