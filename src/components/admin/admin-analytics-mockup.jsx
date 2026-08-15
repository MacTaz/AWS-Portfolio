import React, { useState, useRef, useCallback, useEffect } from "react";
import { Lock, ChevronDown, X } from "lucide-react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  Cell,
} from "recharts";

// ---- Design tokens ----
const ink = "#17151a";        // dark site background
const panelBg = "#ffffff";
const textPrimary = "#161217";
const textMuted = "#a68f8a";  // muted rose-taupe (tabs, secondary labels)
const barFill = "#e6e2df";
const accent = "#8c4f47";     // deep rust, used sparingly for anomaly/selected state
const displayFont = "'Space Grotesk', 'Segoe UI', sans-serif";
const bodyFont = "'Inter', 'Segoe UI', sans-serif";

const ADMIN_PASSWORD = "demo1234"; // mockup only — real auth uses the ANALYTICS_SECRET header

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= breakpoint : false
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return isMobile;
}

// ---- Mock data (mirrors the shape of your real GET /analytics response) ----
const summary = {
  totalVisits: 421,
  anomalyDetected: false,
  lastUpdated: "Aug 15, 2026",
  topReferrers: [
    { referrer: "cloudfront.net", count: 210 },
    { referrer: "micotazarte.dev", count: 134 },
    { referrer: "www.micotazarte.dev", count: 77 },
  ],
  visitsOverTime: [
    { date: "8/9", count: 52 },
    { date: "8/10", count: 33 },
    { date: "8/11", count: 71 },
    { date: "8/12", count: 44 },
    { date: "8/13", count: 68 },
    { date: "8/14", count: 39 },
  ],
  anomalyHistory: [false, false, true, false, false, false],
};

const CAROUSEL_ITEMS = [
  { key: "anomalies", label: "Anomalies" },
  { key: "visits", label: "Visits Over Time" },
  { key: "referrers", label: "Top Referrers" },
];

function normalizeAngle(deg) {
  let a = deg % 360;
  if (a > 180) a -= 360;
  if (a < -180) a += 360;
  return a;
}

// ---- Circular drag carousel ----
function CircularCarousel({ selectedIndex, onSelect }) {
  const isMobile = useIsMobile();
  const radius = isMobile ? 95 : 150;
  const [angle, setAngle] = useState(-selectedIndex * 120);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startAngle = useRef(0);

  const settle = useCallback((finalAngle) => {
    const nearestIndex = Math.round(-finalAngle / 120) % 3;
    const normalizedIndex = ((nearestIndex % 3) + 3) % 3;
    setAngle(-normalizedIndex * 120);
    onSelect(normalizedIndex);
  }, [onSelect]);

  const onPointerDown = (e) => {
    dragging.current = true;
    startX.current = e.clientX;
    startAngle.current = angle;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!dragging.current) return;
    const delta = (e.clientX - startX.current) * 0.22;
    setAngle(startAngle.current + delta);
  };

  const onPointerUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    settle(angle);
  };

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      style={{
        position: "relative",
        height: 64,
        width: "100%",
        touchAction: "pan-y",
        cursor: "grab",
        userSelect: "none",
      }}
    >
      {CAROUSEL_ITEMS.map((item, i) => {
        const raw = normalizeAngle(i * 120 + angle);
        const rad = (raw * Math.PI) / 180;
        const x = Math.sin(rad) * radius;
        const depth = (Math.cos(rad) + 1) / 2; // 0..1, 1 = front-center
        const scale = 0.62 + 0.5 * depth;
        const opacity = 0.28 + 0.72 * depth;
        const isFront = depth > 0.9;

        return (
          <button
            key={item.key}
            onClick={() => !dragging.current && settle(-i * 120)}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) translateX(${x}px) scale(${scale})`,
              transition: dragging.current ? "none" : "transform 0.6s cubic-bezier(.16,.84,.2,1), opacity 0.6s",
              opacity,
              zIndex: Math.round(depth * 100),
              fontFamily: bodyFont,
              fontWeight: isFront ? 700 : 500,
              fontSize: isFront ? (isMobile ? 14 : 17) : (isMobile ? 11 : 14),
              color: isFront ? textPrimary : textMuted,
              background: "none",
              border: "none",
              padding: "4px 8px",
              whiteSpace: "nowrap",
              cursor: "pointer",
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

function AnimatedNumber({ value, duration = 900 }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let raf;
    const start = performance.now();
    const from = 0;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(Math.round(from + (value - from) * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <>{display}</>;
}

function StatBlock({ label, value, valueColor, animate, suffix }) {
  return (
    <div>
      <div style={{ fontFamily: bodyFont, fontSize: 13, fontWeight: 600, color: textPrimary, marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontFamily: displayFont, fontSize: 30, fontWeight: 700, color: valueColor || textPrimary }}>
        {animate ? <AnimatedNumber value={value} /> : value}
        {suffix && <span style={{ fontSize: 15, fontWeight: 500, color: textMuted, fontFamily: bodyFont, marginLeft: 6 }}>{suffix}</span>}
      </div>
    </div>
  );
}

function StatisticsTab() {
  const isMobile = useIsMobile();
  return (
    <div style={{ padding: isMobile ? "20px 20px 8px" : "36px 40px 8px" }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "22px 16px" : "32px 24px" }}>
        <StatBlock
          label="Total Visits"
          value={summary.totalVisits}
          animate
          suffix="visits"
        />
        <div>
          <div style={{ fontFamily: bodyFont, fontSize: 13, fontWeight: 600, color: textPrimary, marginBottom: 6 }}>
            Top Referrers
          </div>
          <ol style={{ margin: 0, paddingLeft: 18, fontFamily: bodyFont, fontSize: 14, color: textPrimary, lineHeight: 1.7 }}>
            {summary.topReferrers.map((r) => (
              <li key={r.referrer}>{r.referrer}</li>
            ))}
          </ol>
        </div>
        <StatBlock label="All Visits" value={summary.totalVisits} animate />
        <StatBlock
          label="Anomaly Detected"
          value={summary.anomalyDetected ? "True" : "False"}
          valueColor={summary.anomalyDetected ? accent : textPrimary}
        />
      </div>
      <div style={{ marginTop: 28, fontFamily: bodyFont, fontSize: 12, color: textMuted, textAlign: "center" }}>
        last updated: {summary.lastUpdated}
      </div>
    </div>
  );
}

function GraphsTab() {
  const isMobile = useIsMobile();
  const [selected, setSelected] = useState(1); // default to "Visits Over Time"
  const active = CAROUSEL_ITEMS[selected].key;

  return (
    <div style={{ padding: isMobile ? "16px 20px 8px" : "28px 40px 8px", display: "flex", flexDirection: "column" }}>
      <div style={{ height: isMobile ? 170 : 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {active === "visits" && (
          <div style={{ width: "100%", height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.visitsOverTime} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                <XAxis
                  dataKey="date"
                  tick={{ fontFamily: bodyFont, fontSize: 12, fill: textMuted }}
                  axisLine={{ stroke: "#e5e2df" }}
                  tickLine={false}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {summary.visitsOverTime.map((_, i) => (
                    <Cell key={i} fill={barFill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {active === "referrers" && (
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
            {summary.topReferrers.map((r) => {
              const max = summary.topReferrers[0].count;
              return (
                <div key={r.referrer}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: bodyFont, fontSize: 12, color: textPrimary, marginBottom: 4 }}>
                    <span>{r.referrer}</span>
                    <span style={{ color: textMuted }}>{r.count}</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: "#f1efec" }}>
                    <div style={{ height: "100%", width: `${(r.count / max) * 100}%`, borderRadius: 4, background: barFill, border: "1px solid #d8d4d0" }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {active === "anomalies" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", gap: 10 }}>
              {summary.anomalyHistory.map((flag, i) => (
                <div
                  key={i}
                  title={summary.visitsOverTime[i]?.date}
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: flag ? accent : "#e6e2df",
                  }}
                />
              ))}
            </div>
            <div style={{ fontFamily: bodyFont, fontSize: 12, color: textMuted }}>
              {summary.anomalyHistory.filter(Boolean).length} anomaly day(s) in the last 6 days
            </div>
          </div>
        )}
      </div>

      <CircularCarousel selectedIndex={selected} onSelect={setSelected} />
    </div>
  );
}

function TabButton({ label, active, onClick }) {
  const [hover, setHover] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        fontFamily: bodyFont,
        fontWeight: active ? 700 : 500,
        color: active ? textPrimary : hover ? "#6b6469" : textMuted,
        transform: hover ? "scale(1.08)" : "scale(1)",
        transition: "transform 0.18s ease, color 0.18s ease",
      }}
    >
      {label}
    </button>
  );
}

function DragHandle({ onDismiss }) {
  const [dragY, setDragY] = useState(0);
  const dragging = useRef(false);
  const startY = useRef(0);

  const onPointerDown = (e) => {
    dragging.current = true;
    startY.current = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!dragging.current) return;
    const delta = e.clientY - startY.current; // negative when dragging up
    setDragY(Math.min(0, delta));
  };

  const onPointerUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    if (dragY < -70) {
      onDismiss();
    } else {
      setDragY(0);
    }
  };

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      style={{
        position: "absolute",
        bottom: 14,
        left: "50%",
        transform: `translate(-50%, ${dragY}px)`,
        transition: dragging.current ? "none" : "transform 0.35s cubic-bezier(.2,.8,.3,1)",
        color: textMuted,
        cursor: "grab",
        padding: "10px 24px",
        touchAction: "none",
      }}
    >
      <ChevronDown size={16} />
    </div>
  );
}

function AdminPanel({ onClose }) {
  const isMobile = useIsMobile();
  const [tab, setTab] = useState("statistics");
  const [closing, setClosing] = useState(false);

  const dismiss = () => {
    setClosing(true);
    setTimeout(onClose, 400);
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflowY: "auto",
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(28px) saturate(160%)",
        WebkitBackdropFilter: "blur(28px) saturate(160%)",
        transform: closing ? "translateY(-100%)" : "translateY(0)",
        transition: closing ? "transform 0.4s cubic-bezier(.4,0,.6,1)" : "none",
        animation: closing ? "none" : "slideDown 0.55s cubic-bezier(.2,.8,.3,1)",
      }}
    >
      <button
        onClick={dismiss}
        aria-label="Close analytics panel"
        style={{
          position: "absolute",
          top: 16,
          right: 18,
          background: "none",
          border: "none",
          cursor: "pointer",
          color: textMuted,
        }}
      >
        <X size={18} />
      </button>

      <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 640, margin: "0 auto", padding: isMobile ? "60px 12px 70px" : "80px 24px 90px" }}>
        {tab === "statistics" ? <StatisticsTab /> : <GraphsTab />}

        <div style={{ display: "flex", justifyContent: "center", gap: 20, padding: "12px 0 6px", fontFamily: bodyFont, fontSize: 14 }}>
          <TabButton label="Statistics" active={tab === "statistics"} onClick={() => setTab("statistics")} />
          <TabButton label="Graphs" active={tab === "graphs"} onClick={() => setTab("graphs")} />
        </div>
      </div>

      <DragHandle onDismiss={dismiss} />
    </div>
  );
}

function PasswordGate({ onSuccess, onCancel }) {
  const isMobile = useIsMobile();
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, []);

  const check = () => {
    if (value.trim() === ADMIN_PASSWORD) {
      onSuccess();
    } else {
      setError(true);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    check();
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 20,
      }}
    >
      <form
        onSubmit={submit}
        style={{
          background: panelBg,
          borderRadius: 16,
          padding: "28px 30px",
          width: isMobile ? "82vw" : 260,
          maxWidth: 300,
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: displayFont, fontWeight: 700, fontSize: 15, color: textPrimary }}>
          <Lock size={16} /> Admin access
        </div>
        <input
          ref={inputRef}
          type="password"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(false); }}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); check(); } }}
          placeholder="Password"
          style={{
            fontFamily: bodyFont,
            fontSize: 14,
            padding: "10px 12px",
            borderRadius: 8,
            border: `1px solid ${error ? accent : "#ddd8d4"}`,
            outline: "none",
            width: "100%",
            boxSizing: "border-box",
          }}
        />
        {error && (
          <div style={{ fontFamily: bodyFont, fontSize: 12, color: accent }}>
            Incorrect password
          </div>
        )}
        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1, padding: "9px 0", borderRadius: 8, border: "none",
              background: "#f1efec", color: textPrimary, fontFamily: bodyFont,
              fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={check}
            style={{
              flex: 1, padding: "9px 0", borderRadius: 8, border: "none",
              background: textPrimary, color: "#fff", fontFamily: bodyFont,
              fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}
          >
            Enter
          </button>
        </div>
        <div style={{ fontFamily: bodyFont, fontSize: 11, color: textMuted, textAlign: "center" }}>
          demo password: {ADMIN_PASSWORD}
        </div>
      </form>
    </div>
  );
}

export default function AdminAnalyticsMockup() {
  const isMobile = useIsMobile();
  const [showPassword, setShowPassword] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setShowPassword(false);
        setPanelOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: 600,
        overflow: "hidden",
        borderRadius: 18,
        background: ink,
        fontFamily: bodyFont,
      }}
    >
      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
      `}</style>

      {/* Mock site content, behind everything — visible through the panel's frosted glass */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: isMobile ? "40px 22px" : "60px 48px",
        }}
      >
        <div style={{ fontFamily: displayFont, fontSize: 13, letterSpacing: 2, color: "#6f6a6f", textTransform: "uppercase" }}>
          micotazarte.dev
        </div>
        <div style={{ marginTop: isMobile ? 50 : 90, fontFamily: displayFont, fontSize: isMobile ? 30 : 48, fontWeight: 700, color: "#f4f2f0", lineHeight: 1.1, maxWidth: 480 }}>
          Cloud engineer &amp; builder.
        </div>
        <div style={{ marginTop: 18, fontFamily: bodyFont, fontSize: isMobile ? 13 : 15, color: "#8a8489", maxWidth: 420 }}>
          Portfolio site running on a fully serverless AWS stack — this is a preview of the page underneath the admin panel.
        </div>
      </div>

      {/* Lock button */}
      {!panelOpen && (
        <button
          onClick={() => setShowPassword(true)}
          aria-label="Open admin analytics"
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            width: 38,
            height: 38,
            borderRadius: 10,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#efece9",
            zIndex: 15,
          }}
        >
          <Lock size={16} />
        </button>
      )}

      {showPassword && (
        <PasswordGate
          onCancel={() => setShowPassword(false)}
          onSuccess={() => { setShowPassword(false); setPanelOpen(true); }}
        />
      )}

      {panelOpen && (
        <div style={{ position: "absolute", inset: 0, zIndex: 12 }}>
          <AdminPanel onClose={() => setPanelOpen(false)} />
        </div>
      )}
    </div>
  );
}
