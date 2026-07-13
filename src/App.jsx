import { useState } from "react";
import { useWeather } from "./hooks/useWeather";
import { ThemeProvider } from "./context/ThemeContext";
import WeatherCanvas from "./components/WeatherCanvas";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import ForecastCard from "./components/ForecastCard";
import HomePage from "./components/HomePage";

function WeatherApp() {
  const { weather, forecast, loading, error, fetchWeather, fetchWeatherByCoords } = useWeather();
  const [searched, setSearched] = useState(false);

  const handleSearch = (city) => {
    setSearched(true);
    fetchWeather(city);
  };

  const handleSearchByCoords = (lat, lon) => {
    setSearched(true);
    fetchWeatherByCoords(lat, lon);
  };

  if (!searched) {
    return (
      <HomePage
        onSearch={handleSearch}
        onSearchByCoords={handleSearchByCoords}
        loading={loading}
      />
    );
  }

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <WeatherCanvas />

      <div style={{ position: "relative", zIndex: 1 }}>
        <Navbar />

        <div className="container py-4 pb-5" style={{ maxWidth: 720 }}>

          {/* Search bar wrapper */}
          <div style={{
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: 16,
            padding: "16px",
            marginBottom: 24,
          }}>
            <SearchBar
              onSearch={handleSearch}
              onSearchByCoords={handleSearchByCoords}
              loading={loading}
            />
          </div>

          {/* Error */}
          {error && !loading && (
            <div style={{
              background: "rgba(239,68,68,0.25)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(239,68,68,0.4)",
              borderRadius: 14,
              padding: "14px 18px",
              color: "#fff",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}>
              <span style={{ fontSize: 20 }}>⚠️</span>
              <span>{error}</span>
              <button
                onClick={() => setSearched(false)}
                style={{
                  marginLeft: "auto",
                  background: "rgba(255,255,255,0.2)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: 10,
                  padding: "4px 12px",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                ← Home
              </button>
            </div>
          )}

          {/* Loading — full area spinner, hides old results */}
          {loading && (
            <div style={{
              minHeight: 340,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <div style={{
                width: 64, height: 64,
                border: "5px solid rgba(255,255,255,0.2)",
                borderTop: "5px solid #fff",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <p style={{ color: "#fff", marginTop: 20, fontSize: 17, opacity: 0.85 }}>
                Fetching weather data...
              </p>
            </div>
          )}

          {/* Results — only show when NOT loading */}
          {!loading && weather && (
            <>
              <WeatherCard data={weather} />
              {forecast.length > 0 && <ForecastCard data={forecast} />}
              <div className="text-center mt-3">
                <button
                  onClick={() => setSearched(false)}
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: 20,
                    padding: "8px 24px",
                    color: "#fff",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                >
                  ← Back to home
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <WeatherApp />
    </ThemeProvider>
  );
}