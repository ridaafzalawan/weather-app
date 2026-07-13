import { useEffect, useRef } from "react";

export default function WeatherCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const drops = Array.from({ length: 80 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      speed: 2 + Math.random() * 4,
      len: 10 + Math.random() * 20,
      opacity: 0.2 + Math.random() * 0.4,
    }));

    const clouds = Array.from({ length: 6 }, (_, i) => ({
      x: (i * window.innerWidth) / 5,
      y: 40 + Math.random() * 120,
      r: 60 + Math.random() * 60,
      speed: 0.2 + Math.random() * 0.3,
      opacity: 0.06 + Math.random() * 0.08,
    }));

    const stars = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * (window.innerHeight * 0.6),
      r: 0.5 + Math.random() * 1.5,
      twinkle: Math.random() * Math.PI * 2,
    }));

    const hour = new Date().getHours();
    let gradTop, gradBot;
    if (hour >= 5 && hour < 8)       { gradTop = "#f97316"; gradBot = "#fbbf24"; }
    else if (hour >= 8 && hour < 17) { gradTop = "#0ea5e9"; gradBot = "#38bdf8"; }
    else if (hour >= 17 && hour < 20){ gradTop = "#7c3aed"; gradBot = "#f97316"; }
    else                              { gradTop = "#0f172a"; gradBot = "#1e3a5f"; }

    const isNight = hour < 5 || hour >= 20;
    let frame = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, gradTop);
      grad.addColorStop(1, gradBot);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (isNight) {
        stars.forEach((s) => {
          s.twinkle += 0.02;
          const alpha = 0.4 + 0.6 * Math.abs(Math.sin(s.twinkle));
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${alpha})`;
          ctx.fill();
        });
      }

      const sunX = canvas.width * 0.82;
      const sunY = 90;
      if (!isNight) {
        const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 80);
        sunGlow.addColorStop(0, "rgba(255,236,100,0.35)");
        sunGlow.addColorStop(1, "rgba(255,200,0,0)");
        ctx.fillStyle = sunGlow;
        ctx.beginPath();
        ctx.arc(sunX, sunY, 80, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(sunX, sunY, 36, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,236,100,0.9)";
        ctx.fill();
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2 + frame * 0.005;
          ctx.beginPath();
          ctx.moveTo(sunX + Math.cos(angle) * 42, sunY + Math.sin(angle) * 42);
          ctx.lineTo(sunX + Math.cos(angle) * 60, sunY + Math.sin(angle) * 60);
          ctx.strokeStyle = "rgba(255,236,100,0.6)";
          ctx.lineWidth = 3;
          ctx.lineCap = "round";
          ctx.stroke();
        }
      } else {
        ctx.beginPath();
        ctx.arc(sunX, sunY, 30, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(226,232,240,0.9)";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(sunX + 12, sunY - 6, 22, 0, Math.PI * 2);
        ctx.fillStyle = gradTop;
        ctx.fill();
      }

      clouds.forEach((c) => {
        c.x += c.speed;
        if (c.x - c.r > canvas.width + 100) c.x = -c.r - 100;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.arc(c.x + c.r * 0.7, c.y - c.r * 0.3, c.r * 0.75, 0, Math.PI * 2);
        ctx.arc(c.x - c.r * 0.6, c.y - c.r * 0.2, c.r * 0.65, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${c.opacity})`;
        ctx.fill();
      });

      drops.forEach((d) => {
        d.y += d.speed;
        if (d.y > canvas.height) {
          d.y = -d.len;
          d.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 1, d.y + d.len);
        ctx.strokeStyle = `rgba(147,210,255,${d.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      frame++;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}