import React, { useState, useRef, useCallback, useEffect } from "react";
import { ChevronDown, X, Loader2, RefreshCw } from "lucide-react";
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
const textPrimary = "#161217";
const textMuted = "#594c49";  // crisp high-contrast taupe gray
const barFill = "#e6e2df";
const accent = "#332f35";     // soft lighter black for anomaly state
const displayFont = "'Inter', sans-serif";
const bodyFont = "'Inter', sans-serif";

const glassCardStyle = {
  background: "rgba(255, 255, 255, 0.62)",
  backdropFilter: "blur(20px) saturate(160%)",
  WebkitBackdropFilter: "blur(20px) saturate(160%)",
  border: "1px solid rgba(255, 255, 255, 0.85)",
  borderRadius: 0, // sharp edges
  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.04)",
};

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

function StatCard({ label, value, valueSize = 44, valueColor, animate, subtitle, badge }) {
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
          borderRadius: 0,
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
            <span style={{ background: "rgba(0,0,0,0.08)", color: accent, fontSize: 12, fontWeight: 700, padding: "2px 8px", borderRadius: 0 }}>
              Anomaly Spike
            </span>
          )}
        </div>
      </div>
    );
  }
  return null;
}

// Approved referrers configuration
const APPROVED_REFERRERS = [
  { id: "www.micotazarte.dev", label: "www.micotazarte.dev" },
  { id: "micotazarte.dev", label: "micotazarte.dev" },
  { id: "cloudfront", label: "CloudFront Link" },
  { id: "localhost", label: "localhost" },
];

function getFilteredTopReferrers(rawReferrers = []) {
  const categoryCounts = {
    "www.micotazarte.dev": 0,
    "micotazarte.dev": 0,
    "cloudfront": 0,
    "localhost": 0,
  };

  let cfHostnameFound = null;

  rawReferrers.forEach((r) => {
    const ref = (r.referrer || "").toLowerCase();
    let hostname = ref;
    try {
      if (ref.startsWith("http://") || ref.startsWith("https://")) {
        hostname = new URL(ref).hostname;
      }
    } catch {
      hostname = ref.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    }

    if (hostname.includes("www.micotazarte.dev")) {
      categoryCounts["www.micotazarte.dev"] += r.count || 0;
    } else if (hostname.includes("micotazarte.dev")) {
      categoryCounts["micotazarte.dev"] += r.count || 0;
    } else if (hostname.includes("cloudfront")) {
      categoryCounts["cloudfront"] += r.count || 0;
      if (!cfHostnameFound && hostname) cfHostnameFound = hostname;
    } else if (hostname.includes("localhost") || hostname.includes("127.0.0.1") || ref === "direct" || !ref) {
      categoryCounts["localhost"] += r.count || 0;
    }
  });

  return APPROVED_REFERRERS.map((item) => {
    let displayLabel = item.label;
    if (item.id === "cloudfront" && cfHostnameFound) {
      displayLabel = cfHostnameFound;
    }
    return {
      referrer: item.id,
      label: displayLabel,
      count: categoryCounts[item.id],
    };
  });
}

function SinglePageDashboard({ data }) {
  const isMobile = useIsMobile();
  const rawVisits = data?.visitsOverTime || [];
  const visitsOverTime = getAnomalyAnalysis(rawVisits).map((d) => ({
    ...d,
    displayDate: formatChartDate(d.date),
  }));

  const latestDay = visitsOverTime.length > 0 ? visitsOverTime[visitsOverTime.length - 1] : null;
  const totalVisits = data?.totalVisits || 0;

  const topReferrers = getFilteredTopReferrers(data?.topReferrers || []);
  const maxReferrerCount = Math.max(...topReferrers.map((r) => r.count), 1);

  return (
    <div style={{ padding: isMobile ? "12px 4px" : "20px 8px", display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Metric Cards Row */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 16 : 24, alignItems: "start" }}>
        <div style={{ ...glassCardStyle, padding: isMobile ? "20px" : "24px 28px" }}>
          <StatCard
            label="Total Visits"
            value={totalVisits}
            animate
            subtitle="lifetime portfolio visits"
          />
        </div>

        <div style={{ ...glassCardStyle, padding: isMobile ? "20px" : "24px 28px" }}>
          <StatCard
            label="Latest Daily Visits"
            value={latestDay ? latestDay.count : 0}
            animate
            subtitle={latestDay ? `recorded on ${formatChartDate(latestDay.date)}` : "no daily records"}
          />
        </div>
      </div>

      {/* Main Graph: Visits Over Time in a glassy container card */}
      <div style={{ ...glassCardStyle, padding: isMobile ? "20px 18px" : "26px 28px", display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
          <div>
            <span style={{ fontFamily: displayFont, fontSize: 16, fontWeight: 700, color: textPrimary }}>
              Visits Over Time
            </span>
            <div style={{ fontFamily: bodyFont, fontSize: 13, fontWeight: 500, color: textMuted, marginTop: 2 }}>
              Daily traffic breakdown with anomaly spike detection
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 12, fontFamily: bodyFont, color: textMuted }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 0, background: barFill, display: "inline-block", border: "1px solid #d8d4d0" }} /> Normal
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 0, background: accent, display: "inline-block" }} /> Anomaly Spike
            </span>
          </div>
        </div>

        <div style={{ width: "100%", height: isMobile ? 220 : 310, marginTop: 6 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={visitsOverTime} margin={{ top: 12, right: 4, left: 4, bottom: 0 }}>
              <XAxis
                dataKey="displayDate"
                tick={{ fontFamily: bodyFont, fontSize: 13, fill: textMuted }}
                axisLine={{ stroke: "rgba(22, 18, 23, 0.12)" }}
                tickLine={false}
              />
              <Tooltip content={<CustomChartTooltip />} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
              <Bar dataKey="count" radius={[0, 0, 0, 0]}>
                {visitsOverTime.map((entry, i) => (
                  <Cell key={i} fill={entry.isAnomaly ? accent : barFill} style={{ cursor: "pointer" }} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Referrers Progress List in a glassy container card */}
      <div style={{ ...glassCardStyle, padding: isMobile ? "20px 18px" : "26px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <span style={{ fontFamily: displayFont, fontSize: 16, fontWeight: 700, color: textPrimary }}>
              Top Traffic Referrers
            </span>
            <div style={{ fontFamily: bodyFont, fontSize: 13, fontWeight: 500, color: textMuted, marginTop: 2 }}>
              Traffic breakdown across approved sources
            </div>
          </div>
          <span style={{ fontFamily: bodyFont, fontSize: 13, fontWeight: 600, color: textMuted, background: "rgba(22, 18, 23, 0.05)", padding: "4px 10px", borderRadius: 0 }}>
            {APPROVED_REFERRERS.length} sources
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "20px 40px" }}>
          {topReferrers.map((r) => {
            const pct = totalVisits > 0 ? Math.round((r.count / totalVisits) * 100) : 0;
            const barWidth = maxReferrerCount > 0 ? Math.round((r.count / maxReferrerCount) * 100) : 0;

            return (
              <div key={r.referrer} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: bodyFont, fontSize: 14, color: textPrimary }}>
                  <span style={{ fontWeight: 600 }}>{r.label}</span>
                  <span style={{ color: textMuted, fontWeight: 500 }}>
                    {r.count} visits <span style={{ fontSize: 12 }}>({pct}%)</span>
                  </span>
                </div>
                <div style={{ height: 8, borderRadius: 0, background: "rgba(22, 18, 23, 0.06)" }}>
                  <div style={{ height: "100%", width: `${barWidth}%`, borderRadius: 0, background: barFill, border: "1px solid #d8d4d0", transition: "width 0.4s ease" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: 4, fontFamily: bodyFont, fontSize: 13, color: textMuted, textAlign: "center" }}>
        last updated: {formatDate(data?.lastUpdated)}
      </div>
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        padding: "16px 0 8px",
        marginTop: 16,
        color: textMuted,
        cursor: "grab",
        touchAction: "none",
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <ChevronDown size={24} />
    </div>
  );
}

function AdminPanel({ onClose }) {
  const isMobile = useIsMobile();
  const { adminPassword, initialData } = useAdmin();
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
        background: "rgba(248, 246, 243, 0.65)",
        backdropFilter: "blur(18px) saturate(140%)",
        WebkitBackdropFilter: "blur(18px) saturate(140%)",
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
          background: "rgba(255, 255, 255, 0.60)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.8)",
          borderRadius: 0,
          width: 40,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: textMuted,
          zIndex: 10,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <X size={20} />
      </button>

      <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", maxWidth: 1200, margin: "0 auto", padding: isMobile ? "36px 16px 24px" : "60px 48px 36px" }}>
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
                  borderRadius: 0,
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
          ) : (
            <SinglePageDashboard data={data} />
          )}
        </div>

        <DragHandle
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        />
      </div>
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
          boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
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

        <div style={{ height: 1, background: "rgba(22,18,23,0.07)", margin: "0 -2px" }} />

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

        {errorMsg && (
          <div style={{ fontFamily: bodyFont, fontSize: 12, color: accent, fontWeight: 600, marginTop: -8 }}>
            {errorMsg}
          </div>
        )}

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
