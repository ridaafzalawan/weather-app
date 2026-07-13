/* eslint-disable no-undef */
import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import WeatherCanvas from "./WeatherCanvas";

const API_KEY = import.meta.env.VITE_WEATHER_KEY;

const CITY_NAMES = [
  "London",
  "Tokyo",
  "New York",
  "Dubai",
  "Lahore",
  "Paris",
  "Sydney",
  "Toronto",
];

const CITY_EMOJIS = {
  London: "🇬🇧",
  Tokyo: "🇯🇵",
  "New York": "🇺🇸",
  Dubai: "🇦🇪",
  Lahore: "🇵🇰",
  Paris: "🇫🇷",
  Sydney: "🇦🇺",
  Toronto: "🇨🇦",
};

const FACTS = [
  "⚡ A lightning bolt is 5x hotter than the surface of the sun.",
  "🌪️ Tornadoes can spin at over 300 mph — faster than a race car.",
  "❄️ No two snowflakes are exactly alike in structure.",
  "🌧️ It rains diamonds on Neptune and Uranus.",
  "🌊 A tsunami can travel as fast as a jet plane across the ocean.",
  "☀️ The sun's energy takes 8 minutes to reach Earth.",
  "🌈 Rainbows are actually full circles — we just see half.",
  "🌬️ Wind has no smell — we smell the things it carries.",
  "🌡️ The hottest temperature ever recorded was 56.7°C in Death Valley.",
  "🌨️ Antarctica is the driest, windiest continent on Earth.",
];

const STATS = [
  {
    icon: "🌡️",
    label: "Hottest place",
    value: "Death Valley",
    sub: "56.7°C record",
  },
  {
    icon: "🥶",
    label: "Coldest place",
    value: "Antarctica",
    sub: "-89.2°C record",
  },
  {
    icon: "🌧️",
    label: "Wettest place",
    value: "Mawsynram",
    sub: "11,871mm/year",
  },
  {
    icon: "🏜️",
    label: "Driest place",
    value: "Atacama Desert",
    sub: "0.1mm/year",
  },
];

function getWeatherEmoji(main) {
  const map = {
    Clear: "☀️",
    Clouds: "☁️",
    Rain: "🌧️",
    Drizzle: "🌦️",
    Thunderstorm: "⛈️",
    Snow: "❄️",
    Mist: "🌫️",
    Fog: "🌫️",
    Haze: "🌫️",
  };
  return map[main] ?? "🌡️";
}

// ── Live clock ─────────────────────────────────────────────────
function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const hour = time.getHours();
  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 17
        ? "Good afternoon"
        : hour < 20
          ? "Good evening"
          : "Good night";

  return (
    <div className="text-center text-white mb-4">
      <div
        style={{
          fontSize: 56,
          fontWeight: 800,
          letterSpacing: 2,
          lineHeight: 1,
        }}
      >
        {time.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </div>
      <div style={{ fontSize: 16, opacity: 0.85, marginTop: 6 }}>
        {greeting} ·{" "}
        {time.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </div>
    </div>
  );
}

// ── Weather fact ticker ────────────────────────────────────────
function WeatherFact() {
  const [fact, setFact] = useState(FACTS[0]);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setFact(FACTS[Math.floor(Math.random() * FACTS.length)]);
        setFade(true);
      }, 400);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="text-center mx-auto mb-5 px-4 py-3 rounded-4"
      style={{
        background: "rgba(255,255,255,0.12)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.2)",
        maxWidth: 600,
        opacity: fade ? 1 : 0,
        transition: "opacity 0.4s ease",
      }}
    >
      <div
        style={{
          fontSize: 12,
          opacity: 0.7,
          marginBottom: 4,
          color: "#fff",
          letterSpacing: 1,
        }}
      >
        DID YOU KNOW
      </div>
      <div style={{ color: "#fff", fontSize: 15, fontWeight: 500 }}>{fact}</div>
    </div>
  );
}

// ── Popular cities with real weather ──────────────────────────
function PopularCities({ onSearch }) {
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoadingCities(true);
      try {
        const results = await Promise.all(
          CITY_NAMES.map((name) =>
            fetch(
              `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API_KEY}&units=metric`,
            ).then((r) => r.json()),
          ),
        );
        const parsed = results.map((data) => ({
          name: data.name,
          emoji: CITY_EMOJIS[data.name] ?? "🌍",
          temp: `${Math.round(data.main.temp)}°C`,
          desc: data.weather[0].main,
          weatherEmoji: getWeatherEmoji(data.weather[0].main),
          humidity: data.main.humidity,
          wind: data.wind.speed,
          feels: Math.round(data.main.feels_like),
        }));
        setCities(parsed);
      } catch {
        // fallback to static if API fails
        setCities(
          CITY_NAMES.map((name) => ({
            name,
            emoji: CITY_EMOJIS[name],
            temp: "--",
            desc: "Unavailable",
            weatherEmoji: "🌡️",
            humidity: "--",
            wind: "--",
            feels: "--",
          })),
        );
      } finally {
        setLoadingCities(false);
      }
    };

    fetchAll();
  }, []);

  if (loadingCities) {
    return (
      <div className="text-center py-4">
        <div
          style={{
            width: 36,
            height: 36,
            border: "3px solid rgba(255,255,255,0.3)",
            borderTop: "3px solid #fff",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 12px",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>
          Loading live weather...
        </p>
      </div>
    );
  }

  return (
    <div className="row row-cols-2 row-cols-md-4 g-3">
      {cities.map((c) => (
        <div className="col" key={c.name}>
          <div
            className="rounded-4 p-3"
            style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.25)",
              cursor: "pointer",
              transition: "transform 0.2s, background 0.2s",
            }}
            onClick={() => onSearch(c.name)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.background = "rgba(255,255,255,0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.background = "rgba(255,255,255,0.15)";
            }}
          >
            {/* Flag + weather emoji */}
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span style={{ fontSize: 24 }}>{c.emoji}</span>
              <span style={{ fontSize: 24 }}>{c.weatherEmoji}</span>
            </div>

            {/* City name */}
            <div
              style={{
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                marginBottom: 2,
              }}
            >
              {c.name}
            </div>

            {/* Description */}
            <div
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: 12,
                marginBottom: 8,
              }}
            >
              {c.desc}
            </div>

            {/* Big temperature */}
            <div
              style={{
                color: "#fff",
                fontWeight: 900,
                fontSize: 32,
                lineHeight: 1,
                marginBottom: 8,
              }}
            >
              {c.temp}
            </div>

            {/* Extra stats row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                background: "rgba(255,255,255,0.12)",
                borderRadius: 8,
                padding: "5px 8px",
              }}
            >
              <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 11 }}>
                💧 {c.humidity}%
              </span>
              <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 11 }}>
                💨 {c.wind}m/s
              </span>
              <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 11 }}>
                🌡 {c.feels}°
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main HomePage ──────────────────────────────────────────────
export default function HomePage({ onSearch, onSearchByCoords, loading }) {
  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <WeatherCanvas />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div className="container py-5" style={{ maxWidth: 760 }}>
          <LiveClock />

          <div className="text-center text-white mb-4">
            <h1
              style={{
                fontSize: 42,
                fontWeight: 800,
                textShadow: "0 2px 12px rgba(0,0,0,0.3)",
              }}
            >
              🌤 Weather App
            </h1>
            <p style={{ fontSize: 17, opacity: 0.85 }}>
              Real-time weather for any city in the world
            </p>
          </div>

          <div className="mb-5">
            <SearchBar
              onSearch={onSearch}
              onSearchByCoords={onSearchByCoords}
              loading={loading}
            />
          </div>

          <WeatherFact />

          {/* Popular cities — real data */}
          <div className="mb-5">
            <h5
              className="text-white fw-bold mb-3 text-center"
              style={{ textShadow: "0 1px 6px rgba(0,0,0,0.3)" }}
            >
              🌍 Popular Cities — Live Weather
            </h5>
            <PopularCities onSearch={onSearch} />
          </div>

          {/* World records */}
          <div className="mb-5">
            <h5
              className="text-white fw-bold mb-3 text-center"
              style={{ textShadow: "0 1px 6px rgba(0,0,0,0.3)" }}
            >
              🏆 World Weather Records
            </h5>
            <div className="row row-cols-2 row-cols-md-4 g-3">
              {STATS.map((s) => (
                <div className="col" key={s.label}>
                  <div
                    className="rounded-4 p-3 text-center"
                    style={{
                      background: "rgba(255,255,255,0.12)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    <div style={{ fontSize: 30 }}>{s.icon}</div>
                    <div
                      style={{
                        color: "rgba(255,255,255,0.65)",
                        fontSize: 12,
                        marginTop: 4,
                      }}
                    >
                      {s.label}
                    </div>
                    <div
                      style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}
                    >
                      {s.value}
                    </div>
                    <div
                      style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}
                    >
                      {s.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
