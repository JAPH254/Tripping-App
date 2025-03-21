import React, { useEffect, useState } from "react";
import { getTrips, Trip } from "../api";

const TripList: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    const fetchTrips = async () => {
      const data = await getTrips();
      setTrips(data);
    };

    fetchTrips();
  }, []);

  return (
    <div>
      <h2>Trip List</h2>
      <ul>
        {trips.map((trip) => (
          <li key={trip.id}>
            {trip.pickup_location} → {trip.dropoff_location} ({trip.cycle_hours_used} hrs)
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TripList;
