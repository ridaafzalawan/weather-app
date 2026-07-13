# 🌤 Weather App

A modern React weather app with live city search, animated backgrounds, a 5-day forecast, and dark mode — built with React + Vite, hooks, Context API, and the OpenWeatherMap API.

## Features

- 🔍 **Live city search**  with autocomplete and country flags
- 📍 Accurate lookups using city coordinates
- 🌦 **Animated canvas background** — rain, clouds, sun/moon that change with time of day
- 🧊 Glassmorphism UI across cards, navbar, and search bar
- 🏙 Real-time weather snapshot for popular cities on the homepage
- 🕐 Live clock with time-based greeting
- 💡 Rotating weather facts + world weather records
- 📅 5-day forecast
- 🌙 Dark mode toggle (via Context API)
- ⚠️ Clean loading states and error handling

## Tech Stack

| Layer | Tech |
|---|---|
| Build tool | Vite |
| Framework | React (hooks, custom hooks, Context API) |
| HTTP | Axios |
| Weather Data | [OpenWeatherMap API](https://openweathermap.org/) |

## Prerequisites

- Node.js 18+
- A free OpenWeatherMap API key ([sign up here](https://openweathermap.org/) → API keys)

## Setup

1. **Install dependencies**
   ```bash
   npm install
   npm install axios
   ```

2. **Add your API key**

   Create a `.env` file in the project root:
   ```
   VITE_WEATHER_KEY=your_api_key_here
   ```
   > Restart the dev server any time you add or change `.env`.

3. **Run the dev server**
   ```bash
   npm run dev
   ```
   Open the URL Vite prints (usually `http://localhost:5173`).

## Project Structure

```
src/
├── components/
│   ├── SearchBar.jsx        # City search + autocomplete
│   ├── WeatherCard.jsx      # Current weather display
│   └── ForecastCard.jsx     # 5-day forecast grid
├── context/
│   └── ThemeContext.jsx     # Dark mode state, shared app-wide
├── hooks/
│   └── useWeather.js        # Fetch logic for current weather + forecast
├── utils/
│   └── helpers.js           # Emoji mapping, date formatting
├── App.jsx
└── index.css
```

## How It Works

1. `useWeather` (custom hook) calls the OpenWeatherMap `/weather` and `/forecast` endpoints in parallel with Axios.
2. The forecast response is filtered down to one reading per day (the `12:00:00` entry) to build a clean 5-day view.
3. `ThemeContext` exposes `dark` and `toggle()` so any component can read/flip dark mode without prop drilling.
4. `App.jsx` composes `SearchBar`, `WeatherCard`, and `ForecastCard`, handling loading and error states from the hook.

## Key React Concepts Used

- **useState** — city input, weather data, loading, error states
- **useCallback** — stable fetch function reference, avoids unnecessary re-renders
- **Custom hook (`useWeather`)** — keeps data-fetching logic out of the UI layer
- **Context API (`ThemeContext`)** — app-wide dark mode without prop drilling
- **Component composition** — small, focused, reusable components

## Notes

- If a city search returns "not found," double-check the spelling.
- New OpenWeatherMap API keys can take a little while to activate after signup — if requests fail right after creating a key, wait a bit and retry.

## Ideas for What's Next

- 📍 "Use my location" button via the browser Geolocation API
- 🌡️ Celsius / Fahrenheit toggle
- 📊 Hourly temperature chart (e.g. with Recharts)
- 🕐 Recent searches saved to `localStorage`

## License

Personal / learning project — add a license here if you plan to distribute it.
