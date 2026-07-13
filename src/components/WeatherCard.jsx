import { getWeatherEmoji } from "../utils/helpers";

const glass = {
  background: "rgba(255,255,255,0.15)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.3)",
  borderRadius: 24,
  color: "#fff",
};

const statBox = {
  background: "rgba(255,255,255,0.15)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: 14,
  padding: "10px 8px",
  textAlign: "center",
};

export default function WeatherCard({ data }) {
  const { name, main, weather, wind, sys, visibility } = data;
  const emoji = getWeatherEmoji(weather[0].main);

  const stats = [
    { label: "Feels like",  value: `${Math.round(main.feels_like)}°C` },
    { label: "Humidity",    value: `💧 ${main.humidity}%` },
    { label: "Wind",        value: `💨 ${wind.speed} m/s` },
    { label: "High / Low",  value: `${Math.round(main.temp_max)}° / ${Math.round(main.temp_min)}°` },
    { label: "Visibility",  value: `👁 ${(visibility / 1000).toFixed(1)} km` },
    { label: "Pressure",    value: `🔵 ${main.pressure} hPa` },
  ];

  return (
    <div style={{ ...glass, padding: "28px 28px 24px", marginBottom: 24 }}>

      {/* Top row — city + emoji */}
      <div className="d-flex justify-content-between align-items-start mb-2">
        <div>
          <h2 style={{ fontWeight: 800, fontSize: 28, margin: 0, textShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
            {name}, {sys.country}
          </h2>
          <p style={{ margin: "4px 0 0", opacity: 0.8, textTransform: "capitalize", fontSize: 16 }}>
            {weather[0].description}
          </p>
        </div>
        <span style={{ fontSize: 68, lineHeight: 1, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))" }}>
          {emoji}
        </span>
      </div>

      {/* Big temp */}
      <p style={{ fontSize: 80, fontWeight: 900, margin: "8px 0 20px", lineHeight: 1, textShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
        {Math.round(main.temp)}°C
      </p>

      {/* Stats grid */}
      <div className="row g-2">
        {stats.map((s) => (
          <div className="col-6 col-md-4" key={s.label}>
            <div style={statBox}>
              <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.5 }}>
                {s.label}
              </div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}