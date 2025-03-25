import { render, screen } from "@testing-library/react";
import TripList from "./TripList";
import { getTrips } from "../api";

jest.mock("../api", () => ({
  getTrips: jest.fn(),
}));

test("renders trip list", async () => {
  (getTrips as jest.Mock).mockResolvedValue([
    {
      id: 1,
      current_location: "New York",
      pickup_location: "Los Angeles",
      dropoff_location: "Chicago",
      cycle_hours_used: 10,
    },
  ]);

  render(<TripList />);

  expect(await screen.findByText(/Los Angeles → Chicago/i)).toBeInTheDocument();
});
