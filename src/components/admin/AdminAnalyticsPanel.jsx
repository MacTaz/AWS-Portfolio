import React, { useState, useRef, useCallback, useEffect } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, X, Loader2, RefreshCw } from "lucide-react";
import { FaLock } from "react-icons/fa6";
import { useAdmin } from "@/context/AdminContext.jsx";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  Tooltip,
  Cell,
} from "recharts";

// ---- Design tokens ----
const panelBg = "#ffffff";
const textPrimary = "#161217";
const textMuted = "#594c49";  // crisp high-contrast taupe gray (tabs, secondary labels)
const barFill = "#e6e2df";
const accent = "#8c4f47";     // deep rust, used for anomaly/selected state
const displayFont = "'Inter', sans-serif";
const bodyFont = "'Inter', sans-serif";

const ANALYTICS_API_URL = "https://ioaty9p2d5.execute-api.us-east-1.amazonaws.com/analytics";

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

// Helpers for data formatting
function formatReferrer(ref) {
  if (!ref || ref === "direct") return "Direct / None";
  try {
    const url = new URL(ref);
    return url.hostname + (url.port ? `:${url.port}` : "");
  } catch {
    return ref.replace(/^https?:\/\//, "").replace(/\/$/, "");
  }
}

function formatDate(isoStr) {
  if (!isoStr) return "N/A";
  const date = new Date(isoStr);
  if (isNaN(date.getTime())) return isoStr;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatChartDate(dateStr) {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    return `${month}/${day}`;
  }
  return dateStr;
}

function SlidingCapsuleTabs({ options, activeKey, onSelect, size = "normal" }) {
  const activeIndex = options.findIndex((opt) => opt.key === activeKey);
  const safeIndex = activeIndex >= 0 ? activeIndex : 0;
  const isSmall = size === "small";

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <div
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          background: "rgba(22, 18, 23, 0.08)",
          borderRadius: 9999,
          padding: 4,
          border: "1px solid rgba(22, 18, 23, 0.14)",
          boxShadow: "0 4px 14px rgba(0, 0, 0, 0.06)",
        }}
      >
        {/* Animated sliding capsule indicator */}
        <div
          style={{
            position: "absolute",
            top: 4,
            bottom: 4,
            left: 4,
            width: `calc((100% - 8px) / ${options.length})`,
            transform: `translateX(${safeIndex * 100}%)`,
            borderRadius: 9999,
            background: "#ffffff",
            boxShadow: "0 3px 10px rgba(0,0,0,0.14)",
            transition: "transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)",
            pointerEvents: "none",
          }}
        />

        {options.map((opt) => {
          const isActive = opt.key === activeKey;
          return (
            <button
              key={opt.key}
              onClick={() => onSelect(opt.key)}
              style={{
                position: "relative",
                zIndex: 1,
                padding: isSmall ? "8px 20px" : "10px 28px",
                borderRadius: 9999,
                border: "none",
                background: "transparent",
                color: isActive ? textPrimary : textMuted,
                fontFamily: bodyFont,
                fontSize: isSmall ? 14 : 15,
                fontWeight: isActive ? 700 : 500,
                cursor: "pointer",
                transition: "color 0.25s ease",
                whiteSpace: "nowrap",
                userSelect: "none",
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
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

function StatCard({ label, value, valueSize = 48, valueColor, animate, subtitle, badge }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <span style={{ fontFamily: bodyFont, fontSize: 14, fontWeight: 600, color: textMuted }}>
          {label}
        </span>
        {badge}
      </div>

      <div style={{ fontFamily: displayFont, fontSize: valueSize, fontWeight: 600, letterSpacing: "-0.03em", color: valueColor || textPrimary, lineHeight: 1.1 }}>
        {animate && typeof value === "number" ? <AnimatedNumber value={value} /> : value}
      </div>

      {subtitle && (
        <div style={{ fontFamily: bodyFont, fontSize: 13, fontWeight: 500, color: textMuted, marginTop: 6 }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

function AnomalyStatCard({ anomalyDetected, latestAnomalyDate, lastUpdated }) {
  const [hover, setHover] = useState(false);

  const displayDate = latestAnomalyDate
    ? formatDate(latestAnomalyDate).split(",")[0]
    : formatDate(lastUpdated).split(",")[0];

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        justify: "flex-start",
        cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <span style={{ fontFamily: bodyFont, fontSize: 14, fontWeight: 600, color: textMuted }}>
          Anomaly Status
        </span>
        {anomalyDetected && (
          <span style={{ background: "rgba(140,79,71,0.12)", color: accent, fontSize: 12, fontWeight: 700, padding: "2px 8px", borderRadius: 4 }}>
            Flagged
          </span>
        )}
      </div>

      <div style={{ fontFamily: displayFont, fontSize: hover ? 24 : 28, fontWeight: 600, letterSpacing: "-0.03em", color: anomalyDetected ? accent : textPrimary, lineHeight: 1.1, transition: "all 0.2s ease" }}>
        {hover ? displayDate : (anomalyDetected ? "Anomaly Flagged" : "None Detected")}
      </div>

      <div style={{ fontFamily: bodyFont, fontSize: 13, fontWeight: 500, color: textMuted, marginTop: 6, transition: "all 0.2s ease" }}>
        {hover ? (anomalyDetected ? "date of flagged traffic anomaly" : "date of last baseline evaluation") : (anomalyDetected ? "Traffic exceeds expected baseline" : "Traffic within normal baseline range")}
      </div>
    </div>
  );
}

function StatisticsTab({ data }) {
  const isMobile = useIsMobile();
  const visitsOverTime = data?.visitsOverTime || [];
  const latestDay = visitsOverTime.length > 0 ? visitsOverTime[visitsOverTime.length - 1] : null;
  const totalVisits = data?.totalVisits ?? 1;

  const topReferrers = (data?.topReferrers || []).slice(0, 5);
  const anomalyDays = getAnomalyAnalysis(visitsOverTime).filter(d => d.isAnomaly);
  const latestAnomalyDate = anomalyDays.length > 0 ? anomalyDays[anomalyDays.length - 1].date : null;

  return (
    <div style={{ padding: isMobile ? "20px 12px 12px" : "28px 16px 12px", display: "flex", flexDirection: "column", gap: 36 }}>
      {/* Top 3 Metric Cards */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: isMobile ? 24 : 32, alignItems: "start" }}>
        <StatCard
          label="Total Visits"
          value={data?.totalVisits ?? 0}
          animate
          subtitle="lifetime portfolio visits"
        />

        <StatCard
          label="Latest Daily Visits"
          value={latestDay ? latestDay.count : 0}
          animate
          subtitle={latestDay ? `recorded on ${formatChartDate(latestDay.date)}` : "no daily records"}
        />

        <AnomalyStatCard
          anomalyDetected={data?.anomalyDetected}
          latestAnomalyDate={latestAnomalyDate}
          lastUpdated={data?.lastUpdated}
        />
      </div>

      {/* Bottom Section: Top Referrers Progress List */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <span style={{ fontFamily: bodyFont, fontSize: 15, fontWeight: 600, color: textMuted }}>
            Top Traffic Referrers
          </span>
          <span style={{ fontFamily: bodyFont, fontSize: 13, fontWeight: 500, color: textMuted }}>
            {topReferrers.length} active sources
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px 40px" }}>
          {topReferrers.map((r) => {
            const formattedName = formatReferrer(r.referrer);
            const pct = Math.round((r.count / totalVisits) * 100);
            return (
              <div key={r.referrer} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: bodyFont, fontSize: 14, color: textPrimary }}>
                  <span style={{ fontWeight: 600 }}>{formattedName}</span>
                  <span style={{ color: textMuted, fontWeight: 500 }}>
                    {r.count} visits <span style={{ fontSize: 12 }}>({pct}%)</span>
                  </span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: "#f1efec" }}>
                  <div style={{ height: "100%", width: `${pct}%`, borderRadius: 4, background: barFill, border: "1px solid #d8d4d0" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: 16, fontFamily: bodyFont, fontSize: 13, color: textMuted, textAlign: "center" }}>
        last updated: {formatDate(data?.lastUpdated)}
      </div>
    </div>
  );
}

function getAnomalyAnalysis(visitsOverTime) {
  return visitsOverTime.map((item, idx, arr) => {
    const prevSlice = arr.slice(0, idx).map((d) => d.count);
    const avg = prevSlice.length > 0
      ? prevSlice.reduce((a, b) => a + b, 0) / prevSlice.length
      : item.count;
    const variance = prevSlice.length > 0
      ? prevSlice.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / prevSlice.length
      : 0;
    const stdDev = Math.sqrt(variance);
    const zScore = stdDev > 0 ? (item.count - avg) / stdDev : 0;
    const isAnomaly = idx >= 2 && stdDev > 0 && zScore > 2;

    return {
      ...item,
      avg: Math.round(avg * 10) / 10,
      isAnomaly,
    };
  });
}

function CustomChartTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: 6,
          border: `1px solid ${d.isAnomaly ? accent : "#e6e2df"}`,
          fontFamily: bodyFont,
          fontSize: "14px",
          padding: "10px 14px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ fontWeight: 600, fontSize: 14, color: textPrimary }}>
          {formatDate(d.date).split(",")[0]} ({d.displayDate})
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: d.isAnomaly ? accent : textPrimary }}>
            {d.count} visits
          </span>
          {d.isAnomaly && (
            <span style={{ background: "rgba(140,79,71,0.12)", color: accent, fontSize: 12, fontWeight: 700, padding: "2px 8px", borderRadius: 4 }}>
              Anomaly
            </span>
          )}
        </div>
      </div>
    );
  }
  return null;
}

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

function IntuitiveCircularCarousel({ selectedIndex, onSelect }) {
  const isMobile = useIsMobile();
  const radius = isMobile ? 110 : 230;
  const [angle, setAngle] = useState(-selectedIndex * 120);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startAngle = useRef(0);

  useEffect(() => {
    setAngle(-selectedIndex * 120);
  }, [selectedIndex]);

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

  const rotateLeft = () => {
    settle(angle + 120);
  };

  const rotateRight = () => {
    settle(angle - 120);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          maxWidth: isMobile ? "100%" : 620,
          height: 80,
          margin: "0 auto",
        }}
      >
        <button
          onClick={rotateLeft}
          aria-label="Previous graph option"
          style={{
            position: "absolute",
            left: isMobile ? 4 : 20,
            zIndex: 110,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(22, 18, 23, 0.08)",
            border: "1px solid rgba(22, 18, 23, 0.12)",
            color: textPrimary,
            cursor: "pointer",
            transition: "all 0.2s ease",
            backdropFilter: "blur(4px)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = textPrimary; e.currentTarget.style.color = "#ffffff"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(22, 18, 23, 0.08)"; e.currentTarget.style.color = textPrimary; }}
        >
          <ChevronLeft size={20} />
        </button>

        <div
          onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); onPointerDown(e); }}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{
            position: "relative",
            height: 76,
            width: "100%",
            touchAction: "none",
            cursor: "grab",
            userSelect: "none",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          {CAROUSEL_ITEMS.map((item, i) => {
            const raw = normalizeAngle(i * 120 + angle);
            const rad = (raw * Math.PI) / 180;
            const x = Math.sin(rad) * radius;
            const depth = (Math.cos(rad) + 1) / 2; // 0..1, 1 = front-center
            const scale = 0.7 + 0.43 * depth;
            const opacity = 0.45 + 0.55 * depth;
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
                  transition: dragging.current ? "none" : "transform 0.55s cubic-bezier(.16,.84,.2,1), opacity 0.55s",
                  opacity,
                  zIndex: Math.round(depth * 100),
                  fontFamily: bodyFont,
                  fontWeight: isFront ? 600 : 500,
                  fontSize: isFront ? (isMobile ? 16 : 19) : (isMobile ? 13 : 15),
                  color: isFront ? textPrimary : textMuted,
                  background: isFront ? "rgba(255, 255, 255, 0.75)" : "transparent",
                  border: isFront ? "1px solid rgba(22, 18, 23, 0.14)" : "none",
                  borderRadius: 9999,
                  padding: isFront ? "6px 18px" : "4px 12px",
                  boxShadow: isFront ? "0 4px 12px rgba(0,0,0,0.08)" : "none",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  touchAction: "none",
                  pointerEvents: "none",
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <button
          onClick={rotateRight}
          aria-label="Next graph option"
          style={{
            position: "absolute",
            right: isMobile ? 4 : 20,
            zIndex: 110,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(22, 18, 23, 0.08)",
            border: "1px solid rgba(22, 18, 23, 0.12)",
            color: textPrimary,
            cursor: "pointer",
            transition: "all 0.2s ease",
            backdropFilter: "blur(4px)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = textPrimary; e.currentTarget.style.color = "#ffffff"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(22, 18, 23, 0.08)"; e.currentTarget.style.color = textPrimary; }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div style={{ fontFamily: bodyFont, fontSize: 12, fontWeight: 500, color: textMuted, marginTop: 4, letterSpacing: "0.02em" }}>
        click arrows or drag to rotate graphs
      </div>
    </div>
  );
}

function GraphsTab({ data }) {
  const isMobile = useIsMobile();
  const [selected, setSelected] = useState(1); // default to 1: "Visits Over Time"
  const activeKey = CAROUSEL_ITEMS[selected].key;

  const rawVisits = data?.visitsOverTime || [];
  const visitsOverTime = getAnomalyAnalysis(rawVisits).map((d) => ({
    ...d,
    displayDate: formatChartDate(d.date),
  }));

  const topReferrers = data?.topReferrers || [];
  const maxReferrerCount = topReferrers[0]?.count || 1;
  const anomalyCount = visitsOverTime.filter((d) => d.isAnomaly).length;

  return (
    <div style={{ padding: isMobile ? "16px 8px 8px" : "28px 16px 12px", display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          height: isMobile ? "auto" : 340,
          minHeight: isMobile ? 160 : undefined,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {activeKey === "visits" && (
          <div style={{ width: "100%", height: isMobile ? 170 : 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={visitsOverTime} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
                <XAxis
                  dataKey="displayDate"
                  tick={{ fontFamily: bodyFont, fontSize: 13, fill: textMuted }}
                  axisLine={{ stroke: "#e5e2df" }}
                  tickLine={false}
                />
                <Tooltip content={<CustomChartTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {visitsOverTime.map((entry, i) => (
                    <Cell key={i} fill={entry.isAnomaly ? accent : barFill} style={{ cursor: "pointer" }} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeKey === "referrers" && (
          <div style={{ width: "100%", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20 }}>
            {topReferrers.slice(0, 6).map((r) => {
              const formattedName = formatReferrer(r.referrer);
              return (
                <div key={r.referrer}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: bodyFont, fontSize: 15, fontWeight: 600, color: textPrimary, marginBottom: 6 }}>
                    <span>{formattedName}</span>
                    <span style={{ color: textMuted, fontWeight: 500 }}>{r.count} visits</span>
                  </div>
                  <div style={{ height: 12, borderRadius: 4, background: "#f1efec" }}>
                    <div style={{ height: "100%", width: `${(r.count / maxReferrerCount) * 100}%`, borderRadius: 4, background: barFill, border: "1px solid #d8d4d0" }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeKey === "anomalies" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: isMobile ? 12 : 20, width: "100%", padding: isMobile ? "8px 0" : 0 }}>
            <div style={{ display: "flex", gap: isMobile ? 8 : 14, flexWrap: "wrap", justifyContent: "center" }}>
              {visitsOverTime.map((item, i) => (
                <div
                  key={i}
                  title={`${formatDate(item.date).split(",")[0]}: ${item.count} visits ${item.isAnomaly ? "(Anomaly Spike)" : ""}`}
                  style={{
                    width: item.isAnomaly ? (isMobile ? 18 : 24) : (isMobile ? 14 : 18),
                    height: item.isAnomaly ? (isMobile ? 18 : 24) : (isMobile ? 14 : 18),
                    borderRadius: "50%",
                    background: item.isAnomaly ? accent : "#e6e2df",
                    cursor: "pointer",
                    transition: "transform 0.2s ease, background-color 0.2s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.35)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                />
              ))}
            </div>

            <div style={{ fontFamily: bodyFont, fontSize: isMobile ? 13 : 15, color: textMuted, textAlign: "center" }}>
              {anomalyCount} anomaly day(s) detected across {visitsOverTime.length} days tracked
            </div>
          </div>
        )}
      </div>

      <IntuitiveCircularCarousel selectedIndex={selected} onSelect={setSelected} />
    </div>
  );
}

function DragHandle({ onPointerDown, onPointerMove, onPointerUp }) {
  return (
    <div
      onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); onPointerDown(e); }}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{
        position: "absolute",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        color: textMuted,
        cursor: "grab",
        padding: "14px 44px",
        touchAction: "none",
        userSelect: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <ChevronDown size={24} />
    </div>
  );
}

const MAIN_TAB_OPTIONS = [
  { key: "statistics", label: "Statistics" },
  { key: "graphs", label: "Graphs" },
];

function AdminPanel({ onClose }) {
  const isMobile = useIsMobile();
  const { adminPassword, initialData } = useAdmin();
  const [tab, setTab] = useState("statistics");
  const [closing, setClosing] = useState(false);

  // Analytics API state
  const [data, setData] = useState(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(null);

  // High-performance DOM ref & drag physics
  const panelRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const currentDragYRef = useRef(0);
  const rafIdRef = useRef(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(ANALYTICS_API_URL, {
        headers: {
          "x-admin-password": adminPassword,
        },
      });
      if (res.status === 401) {
        throw new Error("Unauthorized: Incorrect admin password.");
      }
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
      setError(err.message || "Unable to load live AWS analytics data.");
    } finally {
      setLoading(false);
    }
  }, [adminPassword]);

  useEffect(() => {
    if (!initialData) {
      fetchAnalytics();
    }
  }, [fetchAnalytics, initialData]);

  const dismiss = useCallback(() => {
    setClosing(true);
    if (panelRef.current) {
      panelRef.current.style.transition = "transform 0.4s cubic-bezier(.4,0,.6,1)";
      panelRef.current.style.transform = "translate3d(0, -100%, 0)";
    }
    setTimeout(onClose, 400);
  }, [onClose]);

  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    startYRef.current = e.clientY;
    currentDragYRef.current = 0;
    if (panelRef.current) {
      panelRef.current.style.transition = "none";
      panelRef.current.style.willChange = "transform";
    }
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const delta = e.clientY - startYRef.current;
    // Only allow pulling UP (negative delta)
    const dragY = Math.min(0, delta);
    currentDragYRef.current = dragY;

    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = requestAnimationFrame(() => {
      if (panelRef.current) {
        panelRef.current.style.transform = `translate3d(0, ${dragY}px, 0)`;
      }
    });
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

    if (currentDragYRef.current < -90) {
      dismiss();
    } else {
      if (panelRef.current) {
        panelRef.current.style.transition = "transform 0.35s cubic-bezier(.2,.8,.3,1)";
        panelRef.current.style.transform = "translate3d(0, 0px, 0)";
        setTimeout(() => {
          if (panelRef.current && !isDraggingRef.current) {
            panelRef.current.style.willChange = "auto";
          }
        }, 350);
      }
    }
  };

  return (
    <div
      ref={panelRef}
      style={{
        position: "absolute",
        inset: 0,
        overflowY: "auto",
        overflowX: "hidden",
        background: "rgba(255,255,255,0.55)",
        backdropFilter: "blur(10px) saturate(140%)",
        WebkitBackdropFilter: "blur(8px) saturate(140%)",
        transform: closing ? "translate3d(0, -100%, 0)" : "translate3d(0, 0px, 0)",
        transition: closing ? "transform 0.4s cubic-bezier(.4,0,.6,1)" : "none",
        animation: closing ? "none" : "slideDown 0.55s cubic-bezier(.2,.8,.3,1)",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <button
        onClick={dismiss}
        aria-label="Close analytics panel"
        style={{
          position: "absolute",
          top: 24,
          right: 28,
          background: "none",
          border: "none",
          cursor: "pointer",
          color: textMuted,
          padding: 8,
          zIndex: 10,
        }}
      >
        <X size={24} />
      </button>

      <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", maxWidth: 1200, margin: "0 auto", padding: isMobile ? "48px 16px 72px" : "80px 48px 90px" }}>
        <div style={{ flex: 1 }}>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "60px 0" }}>
              <Loader2 className="animate-spin" size={36} style={{ color: textMuted }} />
              <div style={{ fontFamily: bodyFont, fontSize: 18, color: textMuted, fontWeight: 500 }}>
                Fetching AWS Analytics...
              </div>
            </div>
          ) : error ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "60px 0" }}>
              <div style={{ fontFamily: bodyFont, fontSize: 18, color: accent, fontWeight: 600 }}>
                {error}
              </div>
              <button
                onClick={fetchAnalytics}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 20px",
                  borderRadius: 8,
                  border: "none",
                  background: textPrimary,
                  color: "#fff",
                  fontFamily: bodyFont,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <RefreshCw size={16} /> Retry
              </button>
            </div>
          ) : tab === "statistics" ? (
            <StatisticsTab data={data} />
          ) : (
            <GraphsTab data={data} />
          )}
        </div>

        {!loading && !error && (
          <div style={{ padding: "28px 0 6px", flexShrink: 0 }}>
            <SlidingCapsuleTabs
              options={MAIN_TAB_OPTIONS}
              activeKey={tab}
              onSelect={setTab}
            />
          </div>
        )}
      </div>

      <DragHandle
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />
    </div>
  );
}

function PasswordGate({ onSuccess, onCancel }) {
  const isMobile = useIsMobile();
  const [value, setValue] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [verifying, setVerifying] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, []);

  const check = async () => {
    const password = value.trim();
    if (!password) {
      setErrorMsg("Please enter a password");
      return;
    }
    setVerifying(true);
    setErrorMsg("");

    try {
      const res = await fetch(ANALYTICS_API_URL, {
        headers: {
          "x-admin-password": password,
        },
      });

      if (res.status === 401) {
        setErrorMsg("Incorrect password");
        setVerifying(false);
        return;
      }

      if (!res.ok) {
        throw new Error(`AWS status ${res.status}`);
      }

      const json = await res.json();
      onSuccess(json, password);
    } catch (err) {
      console.error("Password verification error:", err);
      setErrorMsg("Unable to verify password with AWS");
      setVerifying(false);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (!verifying) check();
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
          background: "rgba(255,255,255,0.72)",
          backdropFilter: "blur(20px) saturate(160%)",
          WebkitBackdropFilter: "blur(20px) saturate(160%)",
          borderRadius: 0,
          border: "1px solid rgba(255,255,255,0.85)",
          padding: isMobile ? "28px 24px" : "32px 34px",
          width: isMobile ? "85vw" : 300,
          maxWidth: 340,
          boxShadow: "0 8px 40px rgba(0,0,0,0.10), 0 1px 0 rgba(255,255,255,0.8) inset",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* Header: lock icon + title */}
        {/* Header: lock icon + title */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <FaLock style={{ width: 14, height: 14, color: textPrimary }} />
          </div>
          <div>
            <div style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 15, color: textPrimary, lineHeight: 1.2 }}>Admin Access</div>
            <div style={{ fontFamily: bodyFont, fontWeight: 500, fontSize: 12, color: textMuted, marginTop: 2 }}>Verify to continue</div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(22,18,23,0.07)", margin: "0 -2px" }} />

        {/* Password input */}
        <input
          ref={inputRef}
          type="password"
          value={value}
          disabled={verifying}
          onChange={(e) => { setValue(e.target.value); setErrorMsg(""); }}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (!verifying) check(); } }}
          placeholder="Enter password"
          style={{
            fontFamily: bodyFont,
            fontSize: 14,
            padding: "11px 14px",
            borderRadius: 0,
            border: `1px solid ${errorMsg ? accent : "rgba(22,18,23,0.15)"}`,
            outline: "none",
            width: "100%",
            boxSizing: "border-box",
            background: "rgba(255,255,255,0.55)",
            color: textPrimary,
            letterSpacing: errorMsg ? 0 : "0.02em",
            transition: "border-color 0.2s ease",
          }}
        />

        {/* Error message */}
        {errorMsg && (
          <div style={{ fontFamily: bodyFont, fontSize: 12, color: accent, fontWeight: 600, marginTop: -8 }}>
            {errorMsg}
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={verifying}
            style={{
              flex: 1, padding: "10px 0", borderRadius: 0,
              border: "1px solid rgba(22,18,23,0.15)",
              background: "rgba(255,255,255,0.55)",
              color: textMuted, fontFamily: bodyFont,
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              opacity: verifying ? 0.5 : 1,
              transition: "opacity 0.2s ease",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={check}
            disabled={verifying}
            style={{
              flex: 1, padding: "10px 0", borderRadius: 0,
              border: "none",
              background: textPrimary, color: "#fff", fontFamily: bodyFont,
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              opacity: verifying ? 0.8 : 1,
              transition: "opacity 0.2s ease",
            }}
          >
            {verifying ? <Loader2 className="animate-spin" size={14} /> : "Enter"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AdminAnalyticsPanel() {
  const { showPassword, panelOpen, cancelPassword, onAuthSuccess, closePanel } = useAdmin();

  if (!showPassword && !panelOpen) return null;

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
      `}</style>

      {showPassword && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(255,255,255,0.55)",
            backdropFilter: "blur(10px) saturate(140%)",
            WebkitBackdropFilter: "blur(8px) saturate(140%)",
            fontFamily: bodyFont,
          }}
        >
          <PasswordGate onCancel={cancelPassword} onSuccess={onAuthSuccess} />
        </div>
      )}

      {panelOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 40, fontFamily: bodyFont }}>
          <AdminPanel onClose={closePanel} />
        </div>
      )}
    </>
  );
}

