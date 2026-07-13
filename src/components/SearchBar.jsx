/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAutocomplete } from "../hooks/useAutocomplete";

export default function SearchBar({ onSearch, onSearchByCoords, loading }) {
  const [city, setCity] = useState("");
  const [open, setOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const { suggestions, loading: suggestLoading } = useAutocomplete(city);

  // Calculate dropdown position based on input position
  const updateDropdownPosition = () => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    setDropdownStyle({
      position: "fixed",
      top: rect.bottom + 8,
      left: rect.left,
      width: rect.width,
      zIndex: 99999,
    });
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", updateDropdownPosition, true);
    window.addEventListener("resize", updateDropdownPosition);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", updateDropdownPosition, true);
      window.removeEventListener("resize", updateDropdownPosition);
    };
  }, []);

  useEffect(() => {
    if (suggestions.length > 0) {
      updateDropdownPosition();
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [suggestions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!city.trim()) return;
    setOpen(false);
    onSearch(city);
    setTimeout(() => setCity(""), 800);
  };

  const handleSelect = (s) => {
    const label = s.state
      ? `${s.name}, ${s.state}, ${s.country}`
      : `${s.name}, ${s.country}`;
    setCity(label);
    setOpen(false);
    if (onSearchByCoords && s.lat && s.lon) {
      onSearchByCoords(s.lat, s.lon);
    } else {
      onSearch(s.name);
    }
    setTimeout(() => setCity(""), 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") setOpen(false);
  };

  const dropdown = open && suggestions.length > 0 && (
    <ul
      style={{
        ...dropdownStyle,
        listStyle: "none",
        margin: 0,
        padding: 0,
        background: "rgba(10,15,30,0.92)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.18)",
        borderRadius: 14,
        overflow: "hidden",
        boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
      }}
    >
      {suggestions.map((s, i) => (
        <li
          key={i}
          onMouseDown={() => handleSelect(s)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "13px 16px",
            cursor: "pointer",
            borderBottom:
              i < suggestions.length - 1
                ? "1px solid rgba(255,255,255,0.07)"
                : "none",
            transition: "background 0.15s",
            color: "#fff",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <span style={{ fontSize: 26 }}>{countryToFlag(s.country)}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{s.name}</div>
            <div style={{ fontSize: 12, opacity: 0.55 }}>
              {[s.state, s.country].filter(Boolean).join(", ")}
            </div>
          </div>
          <span
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 20,
              padding: "2px 10px",
              fontSize: 12,
              fontWeight: 600,
              color: "#fff",
            }}
          >
            {s.country}
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <div className="position-relative" ref={wrapperRef}>
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.35)",
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            }}
          >
            {/* Search icon */}
            <span
              style={{
                padding: "0 14px 0 18px",
                fontSize: 20,
                display: "flex",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              {suggestLoading ? (
                <span
                  style={{
                    width: 18,
                    height: 18,
                    border: "2px solid rgba(255,255,255,0.4)",
                    borderTop: "2px solid #fff",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin 0.7s linear infinite",
                  }}
                />
              ) : (
                "🔍"
              )}
            </span>

            {/* Input */}
            <input
              ref={inputRef}
              type="text"
              placeholder="Search any city... e.g. London, Tokyo, Lahore"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (suggestions.length > 0) {
                  updateDropdownPosition();
                  setOpen(true);
                }
              }}
              autoComplete="off"
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#fff",
                fontSize: 16,
                padding: "16px 8px",
                fontWeight: 500,
                minWidth: 0,
              }}
            />

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                margin: 6,
                padding: "10px 22px",
                background: "rgba(255,255,255,0.25)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.45)",
                borderRadius: 12,
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                transition: "background 0.2s, transform 0.15s",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.38)";
                  e.currentTarget.style.transform = "scale(1.03)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.25)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      width: 15,
                      height: 15,
                      border: "2px solid rgba(255,255,255,0.4)",
                      borderTop: "2px solid #fff",
                      borderRadius: "50%",
                      display: "inline-block",
                      animation: "spin 0.7s linear infinite",
                    }}
                  />
                  Searching...
                </>
              ) : (
                "Search 🔍"
              )}
            </button>
          </div>
        </form>

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          ::placeholder { color: rgba(255,255,255,0.55) !important; }
        `}</style>
      </div>

      {/* Portal — renders dropdown at document.body level, above everything */}
      {typeof document !== "undefined" &&
        createPortal(dropdown, document.body)}
    </>
  );
}

function countryToFlag(code) {
  if (!code) return "🌍";
  return code
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
}