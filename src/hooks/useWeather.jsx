import { useState, useCallback } from "react";
import axios from "axios";

const API_KEY = import.meta.env.VITE_WEATHER_KEY;
const BASE = "https://api.openweathermap.org/data/2.5";

export function useWeather() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = useCallback(async (city) => {
    if (!city?.trim()) return;
    setLoading(true);
    setError("");
    setWeather(null);
    setForecast([]);

    try {
      const [w, f] = await Promise.all([
        axios.get(`${BASE}/weather?q=${city}&appid=${API_KEY}&units=metric`),
        axios.get(`${BASE}/forecast?q=${city}&appid=${API_KEY}&units=metric`),
      ]);
      setWeather(w.data);
      const daily = f.data.list.filter((i) => i.dt_txt.includes("12:00:00"));
      setForecast(daily.slice(0, 5));
    } catch (err) {
      if (err.response?.status === 404) {
        setError("City not found. Please check the spelling and try again.");
      } else if (err.response?.status === 401) {
        setError("Invalid API key. Check your .env file.");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // NEW — fetch by lat/lon for precise results from autocomplete
  const fetchWeatherByCoords = useCallback(async (lat, lon) => {
    setLoading(true);
    setError("");
    setWeather(null);
    setForecast([]);

    try {
      const [w, f] = await Promise.all([
        axios.get(`${BASE}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`),
        axios.get(`${BASE}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`),
      ]);
      setWeather(w.data);
      const daily = f.data.list.filter((i) => i.dt_txt.includes("12:00:00"));
      setForecast(daily.slice(0, 5));
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid API key. Check your .env file.");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { weather, forecast, loading, error, fetchWeather, fetchWeatherByCoords };
}