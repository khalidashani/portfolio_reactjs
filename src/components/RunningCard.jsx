import { useEffect, useState } from "react";

// ── Encoded polyline decoder ──────────────────────────────────────────────────
function decodePolyline(encoded) {
  const points = [];
  let index = 0, lat = 0, lng = 0;
  while (index < encoded.length) {
    let shift = 0, result = 0, b;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lat += result & 1 ? ~(result >> 1) : result >> 1;
    shift = 0; result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lng += result & 1 ? ~(result >> 1) : result >> 1;
    points.push([lat / 1e5, lng / 1e5]);
  }
  return points;
}

// ── Normalize coords to SVG space ─────────────────────────────────────────────
function normalizePath(points, width, height, padding = 16) {
  const lats = points.map((p) => p[0]);
  const lngs = points.map((p) => p[1]);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  const scaleX = (width - padding * 2) / (maxLng - minLng || 1);
  const scaleY = (height - padding * 2) / (maxLat - minLat || 1);
  const scale = Math.min(scaleX, scaleY);
  const offsetX = (width - (maxLng - minLng) * scale) / 2;
  const offsetY = (height - (maxLat - minLat) * scale) / 2;
  return points.map(([lat, lng]) => [
    offsetX + (lng - minLng) * scale,
    offsetY + (maxLat - lat) * scale,
  ]);
}

// ── Strava Logo ───────────────────────────────────────────────────────────────
const StravaLogo = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066l-2.084 4.116z" fill="#FC4C02" />
    <path d="M11.094 13.828l2.151-4.248 2.15 4.248h3.066L13.245 3.672 8.028 13.828h3.066z" fill="#FC4C02" />
  </svg>
);

// ── Pace calculator ───────────────────────────────────────────────────────────
function calcPace(distanceKm, timeStr) {
  const parts = timeStr.split(":").map(Number);
  const totalMinutes = parts.length === 3
    ? parts[0] * 60 + parts[1] + parts[2] / 60
    : parts[0] + parts[1] / 60;
  const paceMin = totalMinutes / distanceKm;
  const min = Math.floor(paceMin);
  const sec = Math.round((paceMin - min) * 60);
  return `${min}'${String(sec).padStart(2, "0")}"`;
}

// ── Format date ───────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-MY", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function RunningCard({ data, cardId = "0" }) {
  const [svgPoints, setSvgPoints] = useState([]);
  const [animated, setAnimated]   = useState(false);

  const SVG_W = 300;
  const SVG_H = 200;
  const gradId = `routeGrad-${cardId}`;
  const glowId = `glow-${cardId}`;

  useEffect(() => {
    if (!data?.route) return;
    setAnimated(false);
    const decoded = decodePolyline(data.route);
    setSvgPoints(normalizePath(decoded, SVG_W, SVG_H, 16));
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, [data]);

  const pathD = svgPoints.length > 0
    ? "M " + svgPoints.map((p) => p.join(" ")).join(" L ")
    : "";

  const pace = data ? calcPace(parseFloat(data.distance), data.time) : "--";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;600&display=swap');

        .running-card {
          position: relative;
          display: flex;
          flex-direction: column;   /* ← stacked: route on top, stats below */
          width: 100%;
          border-radius: 20px;
          overflow: hidden;
          background: #0d0d0d;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.06),
            0 20px 60px rgba(0,0,0,0.5),
            0 0 80px rgba(252,76,2,0.04);
          font-family: 'Outfit', sans-serif;
        }

        /* grain overlay */
        .running-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.03;
          pointer-events: none;
          z-index: 10;
        }

        /* ── Route panel (top) ── */
        .rc-route-panel {
          position: relative;
          width: 100%;
          background: linear-gradient(160deg, #111 0%, #0a0a0a 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px 20px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        /* orange top accent line */
        .rc-route-panel::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #FC4C02 50%, transparent);
          opacity: 0.6;
        }

        .rc-route-svg {
          width: 100%;
          height: auto;
          filter: drop-shadow(0 0 8px rgba(252,76,2,0.2));
        }

        .rc-route-path {
          fill: none;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 3000;
          stroke-dashoffset: 3000;
          transition: stroke-dashoffset 2.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .rc-route-path.drawn { stroke-dashoffset: 0; }

        .rc-strava-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 10px;
          opacity: 0.7;
        }
        .rc-strava-text {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.14em;
          color: #FC4C02;
          text-transform: uppercase;
        }

        /* ── Stats panel (bottom) ── */
        .rc-stats-panel {
          width: 100%;
          padding: 16px 20px 20px;
          background: linear-gradient(160deg, #141414 0%, #0f0f0f 100%);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .rc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .rc-run-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.22em;
          color: rgba(255,255,255,0.28);
          text-transform: uppercase;
        }

        .rc-run-date {
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          font-weight: 300;
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.03em;
        }

        .rc-orange-dot {
          display: inline-block;
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #FC4C02;
          margin-right: 5px;
          box-shadow: 0 0 6px rgba(252,76,2,0.7);
          vertical-align: middle;
        }

        .rc-divider {
          width: 28px; height: 1px;
          background: rgba(252,76,2,0.45);
        }

        .rc-distance-block {
          display: flex;
          align-items: baseline;
          gap: 5px;
          line-height: 1;
        }

        .rc-distance-value {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 52px;
          line-height: 1;
          background: linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.65) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .rc-distance-unit {
          font-family: 'Outfit', sans-serif;
          font-size: 15px;
          font-weight: 300;
          color: rgba(255,255,255,0.35);
          padding-bottom: 6px;
        }

        .rc-stats-row {
          display: flex;
          gap: 20px;
        }

        .rc-stat-item {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .rc-stat-label {
          font-family: 'DM Mono', monospace;
          font-size: 8.5px;
          font-weight: 500;
          letter-spacing: 0.18em;
          color: rgba(255,255,255,0.22);
          text-transform: uppercase;
        }

        .rc-stat-value {
          font-family: 'DM Mono', monospace;
          font-size: 17px;
          font-weight: 500;
          color: rgba(255,255,255,0.88);
          white-space: nowrap;
        }

        .rc-stat-value.accent { color: #FC4C02; }
      `}</style>

      <div className="running-card">

        {/* ── Top: Route map ── */}
        <div className="rc-route-panel">
          <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="rc-route-svg">
            <defs>
              <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF6B35" />
                <stop offset="50%" stopColor="#FC4C02" />
                <stop offset="100%" stopColor="#E63900" />
              </linearGradient>
              <filter id={glowId}>
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* glow ghost */}
            {pathD && (
              <path d={pathD} fill="none" stroke="#FC4C02" strokeWidth="5"
                strokeLinecap="round" strokeLinejoin="round"
                opacity="0.1" filter={`url(#${glowId})`} />
            )}
            {/* animated route */}
            {pathD && (
              <path d={pathD}
                className={`rc-route-path ${animated ? "drawn" : ""}`}
                stroke={`url(#${gradId})`}
                filter={`url(#${glowId})`} />
            )}
            {/* start dot */}
            {svgPoints.length > 0 && (
              <circle cx={svgPoints[0][0]} cy={svgPoints[0][1]} r="4"
                fill="#FC4C02" opacity={animated ? 1 : 0}
                style={{ transition: "opacity 0.4s ease 2.2s" }} />
            )}
            {/* end dot */}
            {svgPoints.length > 1 && (
              <circle cx={svgPoints[svgPoints.length - 1][0]} cy={svgPoints[svgPoints.length - 1][1]} r="4"
                fill="#fff" opacity={animated ? 0.85 : 0}
                style={{ transition: "opacity 0.4s ease 2.4s" }} />
            )}
          </svg>

          <div className="rc-strava-row">
            <StravaLogo size={14} />
            <span className="rc-strava-text">via Strava</span>
          </div>
        </div>

        {/* ── Bottom: Stats ── */}
        <div className="rc-stats-panel">
          <div className="rc-header">
            <span className="rc-run-label">
              <span className="rc-orange-dot" /><span className="rc-run-date">{data ? formatDate(data.date) : "—"}</span>
            </span>
          </div>

          <div className="rc-divider" />

          <div className="rc-distance-block">
            <span className="rc-distance-value">{data ? data.distance : "—"}</span>
            <span className="rc-distance-unit">km</span>
          </div>

          <div className="rc-stats-row">
            <div className="rc-stat-item">
              <span className="rc-stat-label">Time</span>
              <span className="rc-stat-value">{data ? data.time : "—"}</span>
            </div>
            <div className="rc-stat-item">
              <span className="rc-stat-label">Avg Pace</span>
              <span className="rc-stat-value accent">{pace}</span>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}