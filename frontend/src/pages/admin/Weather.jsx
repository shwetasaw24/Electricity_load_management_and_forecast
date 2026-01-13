import { useEffect, useState } from "react";
import { api } from "../../api/api";

export default function Weather() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    api.get("/weather/mumbai").then(r => setWeather(r.data));
  }, []);

  return (
    <>
      <h2>Weather Monitor</h2>
      {weather && <pre>{JSON.stringify(weather, null, 2)}</pre>}
    </>
  );
}
