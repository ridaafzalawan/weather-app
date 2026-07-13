import { getWeatherEmoji, formatDay } from "../utils/helpers";

export default function ForecastCard({ data }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h5 style={{ color: "#fff", fontWeight: 700, marginBottom: 14, textShadow: "0 1px 6px rgba(0,0,0,0.3)" }}>
        📅 5-Day Forecast
      </h5>
      <div className="row row-cols-2 row-cols-sm-3 row-cols-md-5 g-3">
        {data.map((day) => (
          <div className="col" key={day.dt}>
            <div style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: 18,
              padding: "16px 10px",
              textAlign: "center",
              color: "#fff",
              transition: "transform 0.2s, background 0.2s",
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.background = "rgba(255,255,255,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = "rgba(255,255,255,0.15)";
              }}
            >
              <p style={{ margin: "0 0 8px", fontSize: 12, opacity: 0.75, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                {formatDay(day.dt)}
              </p>
              <div style={{ fontSize: 36, marginBottom: 8, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }}>
                {getWeatherEmoji(day.weather[0].main)}
              </div>
              <p style={{ fontSize: 22, fontWeight: 800, margin: "0 0 6px" }}>
                {Math.round(day.main.temp)}°C
              </p>
              <div style={{
                display: "inline-block",
                background: "rgba(255,255,255,0.2)",
                borderRadius: 20,
                padding: "2px 10px",
                fontSize: 11,
                fontWeight: 600,
              }}>
                {day.weather[0].main}
              </div>
              <div style={{ marginTop: 8, fontSize: 12, opacity: 0.75 }}>
                💧 {day.main.humidity}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}