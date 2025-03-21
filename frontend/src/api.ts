import axios from "axios";


const API_URL = "http://127.0.0.1:8000/api/";

export interface Trip {
  id?: number;
  current_location: string;
  pickup_location: string;
  dropoff_location: string;
  cycle_hours_used: number;
}

export const getTrips = async () => {
  const response = await axios.get<Trip[]>(`${API_URL}trips/`);
  return response.data;
};

export const createTrip = async (tripData: Trip) => {
  const response = await axios.post<Trip>(`${API_URL}trips/`, tripData);
  return response.data;
};
