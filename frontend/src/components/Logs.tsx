import React, { useEffect, useState } from "react";
import axios from "axios";

const ELDLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/eld-logs/")
      .then(response => setLogs(response.data))
      .catch(error => console.error("Error fetching logs:", error));
  }, []);

  return (
    <div>
      <h2>ELD Log Sheets</h2>
      <table>
        <thead>
          <tr>
            <th>Driver</th>
            <th>Date</th>
            <th>Driving Hours</th>
            <th>Rest Hours</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{log.driver_name}</td>
              <td>{log.date}</td>
              <td>{log.driving_hours}</td>
              <td>{log.rest_hours}</td>
              <td>{log.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ELDLogs;
