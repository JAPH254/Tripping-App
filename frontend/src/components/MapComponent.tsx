import React, { useEffect, useState } from "react";
import ELDLogs from "./Logs";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

interface Location {
  lat: number;
  lng: number;
}

const MapComponent: React.FC = () => {
  const [pickup, setPickup] = useState<Location | null>(null);
  const [dropoff, setDropoff] = useState<Location | null>(null);
  const [route, setRoute] = useState<[number, number][]>([]);
  const [stops, setStops] = useState<Location[]>([]);
  const [searchPickup, setSearchPickup] = useState("");
  const [searchDropoff, setSearchDropoff] = useState("");

  const handleSearch = async (query: string, type: "pickup" | "dropoff") => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;
    try {
      const response = await axios.get(url);
      if (response.data.length > 0) {
        const location = {
          lat: parseFloat(response.data[0].lat),
          lng: parseFloat(response.data[0].lon),
        };
        type === "pickup" ? setPickup(location) : setDropoff(location);
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  const LocationPicker = () => {
    useMapEvents({
      click(e) {
        if (!pickup) {
          setPickup({ lat: e.latlng.lat, lng: e.latlng.lng });
          setRoute([]);
        } else if (!dropoff) {
          setDropoff({ lat: e.latlng.lat, lng: e.latlng.lng });
        }
      },
    });
    return null;
  };

  useEffect(() => {
    if (!pickup || !dropoff) return;
    const fetchRoute = async () => {
      const API_KEY =
        "5b3ce3597851110001cf62485ca0cf7dee75450bbbcb5f414de7634f";
      const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${API_KEY}&start=${pickup.lng},${pickup.lat}&end=${dropoff.lng},${dropoff.lat}`;
      try {
        const response = await axios.get(url);
        
        if (response.data.features?.length) {
          const decodedCoordinates =
            response.data.features[0].geometry.coordinates.map(
              ([lng, lat]: [number, number]) => [lat, lng]
            );
          setRoute(decodedCoordinates);
          generateStops(decodedCoordinates);
        }
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };
    fetchRoute();
  }, [pickup, dropoff]);
  const generateStops = (routeCoords: [number, number][]) => {
    let distance = 0;
    let stopsList: Location[] = [];
    const MILES_PER_DEGREE = 69; // Approximation for lat/lng degrees to miles

    for (let i = 1; i < routeCoords.length; i++) {
      const [lat1, lng1] = routeCoords[i - 1];
      const [lat2, lng2] = routeCoords[i];
      const segmentDistance =
        Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2)) *
        MILES_PER_DEGREE;
      distance += segmentDistance;

      // Add rest stop every ~8 driving hours (~500 miles at 60mph)
      if (distance >= 500) {
        stopsList.push({ lat: lat2, lng: lng2 });
        distance = 0;
      }

      // Add fuel stop every ~1,000 miles
      if (distance >= 1000) {
        stopsList.push({ lat: lat2, lng: lng2 });
        distance = 0;
      }
    }
    setStops(stopsList);
  };

  return (
    <div>
      <div>
        <ELDLogs />
      </div>
      <div>
        <input
          type="text"
          value={searchPickup}
          onChange={(e) => setSearchPickup(e.target.value)}
          placeholder="Search Pickup Location"
        />
        <button onClick={() => handleSearch(searchPickup, "pickup")}>
          Search Pickup
        </button>

        <input
          type="text"
          value={searchDropoff}
          onChange={(e) => setSearchDropoff(e.target.value)}
          placeholder="Search Drop-off Location"
        />
        <button onClick={() => handleSearch(searchDropoff, "dropoff")}>
          Search Drop-off
        </button>
      </div>
      <MapContainer
        center={{ lat: 0, lng: 0 }}
        zoom={2}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationPicker />
        {pickup && (
          <Marker position={pickup}>
            <Popup>Pickup Location</Popup>
          </Marker>
        )}
        {dropoff && (
          <Marker position={dropoff}>
            <Popup>Dropoff Location</Popup>
          </Marker>
        )}
        {route.length > 0 && <Polyline positions={route} color="blue" />}
        {stops.map((stop, index) => (
          <Marker key={index} position={stop}>
            <Popup>{index % 2 === 0 ? "Rest Stop" : "Fuel Stop"}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
