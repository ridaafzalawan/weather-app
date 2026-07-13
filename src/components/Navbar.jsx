export default function Navbar() {
  return (
    <nav style={{
      background: "rgba(255,255,255,0.12)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderBottom: "1px solid rgba(255,255,255,0.2)",
      padding: "12px 0",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <div className="container d-flex justify-content-between align-items-center">
        <span style={{ color: "#fff", fontWeight: 800, fontSize: 22, textShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
          🌤 Weather App
        </span>
      </div>
    </nav>
  );
}