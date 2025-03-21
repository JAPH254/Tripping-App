import React, { useState } from "react";
import { createTrip, Trip } from "../api";

const TripForm: React.FC = () => {
  const [formData, setFormData] = useState<Trip>({
    current_location: "",
    pickup_location: "",
    dropoff_location: "",
    cycle_hours_used: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTrip(formData);
    alert("Trip created successfully!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create a Trip</h2>
      <input
        type="text"
        name="current_location"
        placeholder="Current Location"
        value={formData.current_location}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="pickup_location"
        placeholder="Pickup Location"
        value={formData.pickup_location}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="dropoff_location"
        placeholder="Dropoff Location"
        value={formData.dropoff_location}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="cycle_hours_used"
        placeholder="Cycle Hours Used"
        value={formData.cycle_hours_used}
        onChange={handleChange}
        required
      />
      <button type="submit">Create Trip</button>
    </form>
  );
};

export default TripForm;
