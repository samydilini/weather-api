import React, { useState } from "react";
import axios from "axios";

const WeatherApp: React.FC = () => {
  const [apiUrl, setApiUrl] = useState("");
  const [city, setCity] = useState("");
  const [data, setData] = useState(null);
  const [isHistory, setIsHistory] = useState(false);

  const fetchData = async () => {
    const endpoint = isHistory ? "history/" : "";
    try {
      const response = await axios.get(
        `${apiUrl}/prod/weather/${endpoint}${city}`
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Weather App</h1>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          value={apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
          placeholder="Enter API Gateway URL"
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
        />
      </div>
      <div className="d-flex justify-content-center gap-2">
        <button
          type="button"
          className={`btn ${isHistory ? "btn-secondary" : "btn-primary"}`}
          onClick={() => setIsHistory(false)}
        >
          Current
        </button>
        <button
          type="button"
          className={`btn ${isHistory ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setIsHistory(true)}
        >
          History
        </button>
        <button className="btn btn-success" onClick={fetchData}>
          Fetch Data
        </button>
      </div>
      {data && <pre className="mt-4">{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};

export default WeatherApp;
