import { useState, useEffect } from "react";

const API_KEY = import.meta.env.VITE_WEATHER_KEY;

export function useAutocomplete(query) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Don't search if less than 2 characters
    if (query.trim().length < 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuggestions([]);
      return;
    }

    // Debounce — wait 400ms after user stops typing
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
        );
        const data = await res.json();
        setSuggestions(data);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    // Cleanup — cancel previous timer if user keeps typing
    return () => clearTimeout(timer);
  }, [query]);

  return { suggestions, loading };
}