import { useEffect, useState } from "react";
import { api } from "../../api/api";
import KPICard from "../components/KPICard";

export default function Weather() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [correlation, setCorrelation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        const [weatherRes, forecastRes, correlationRes] = await Promise.all([
          api.get("/weather/mumbai"),
          api.get("/weather/forecast/mumbai"),
          api.get("/analytics/weather-load-correlation")
        ]);
        setWeather(weatherRes.data);
        setForecast(forecastRes.data);
        setCorrelation(correlationRes.data);
      } catch (e) {
        setError(e.toString());
      } finally {
        setLoading(false);
      }
    };
    fetchWeatherData();
  }, []);

  return (
    <>
      <section className="card">
        <h2>Weather Impact Monitor</h2>
        <p style={{ color: "#555" }}>
          Current & forecasted weather conditions and their correlation with load demand.
        </p>

        {loading ? (
          "Loading..."
        ) : error ? (
          <div style={{ color: 'red' }}>Error: {error}</div>
        ) : (
          <>
            {weather && (
              <div style={{ marginBottom: 16 }}>
                <h4>Current Weather</h4>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <KPICard title="Temperature" value={`${weather.temperature}°C`} />
                  <KPICard title="Humidity" value={`${weather.humidity}%`} />
                  <KPICard title="Condition" value={weather.condition} />
                  <KPICard title="Wind Speed" value={`${weather.wind_speed} km/h`} />
                </div>
              </div>
            )}

            {forecast.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <h4>Weather Forecast (Next 24h)</h4>
                <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: 8 }}>
                  {forecast.slice(0, 8).map((item, idx) => (
                    <div key={idx} style={{ minWidth: 120, padding: 8, background: "#f3f4f6", borderRadius: 4, textAlign: "center" }}>
                      <div style={{ fontSize: "12px", color: "#666" }}>{item.time}</div>
                      <div style={{ fontSize: "18px", margin: "4px 0" }}>{item.temp}°C</div>
                      <div style={{ fontSize: "12px" }}>{item.condition}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {correlation && (
              <div style={{ padding: 12, background: "#e0f2fe", borderRadius: 8 }}>
                <h4>Load Correlation Analysis</h4>
                <p><strong>Temperature vs Load:</strong> {correlation.temp_correlation}</p>
                <p><strong>Humidity vs Load:</strong> {correlation.humidity_correlation}</p>
                <p><strong>Weather Impact:</strong> {correlation.weather_impact}</p>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
