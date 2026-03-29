import { useEffect, useState, useRef } from "react";

// ── Encoded polyline decoder ──────────────────────────────────────────────────
function decodePolyline(encoded) {
  const points = [];
  let index = 0,
    lat = 0,
    lng = 0;
  while (index < encoded.length) {
    let shift = 0,
      result = 0,
      b;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lat += result & 1 ? ~(result >> 1) : result >> 1;

    shift = 0;
    result = 0;
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

// ── Normalize lat/lng coords to SVG space ─────────────────────────────────────
function normalizePath(points, width, height, padding = 20) {
  const lats = points.map((p) => p[0]);
  const lngs = points.map((p) => p[1]);
  const minLat = Math.min(...lats),
    maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs),
    maxLng = Math.max(...lngs);

  const scaleX = (width - padding * 2) / (maxLng - minLng || 1);
  const scaleY = (height - padding * 2) / (maxLat - minLat || 1);
  const scale = Math.min(scaleX, scaleY);

  const offsetX = (width - (maxLng - minLng) * scale) / 2;
  const offsetY = (height - (maxLat - minLat) * scale) / 2;

  return points.map(([lat, lng]) => [
    offsetX + (lng - minLng) * scale,
    offsetY + (maxLat - lat) * scale, // flip Y axis
  ]);
}

// ── Data ──────────────────────────────────────────────────────────────────────
const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRuaWoLMneZNi1hf87p-kdps5LfG2UpnR0H9P39n36CAak5uBy3PXsc-vu7eJRWquCLhoaWegOZMI5L/pub?output=csv";

// Fallback static data (used when CSV fetch fails)
const STATIC_DATA = {
  date: "2026-03-29",
  distance: "14.04",
  time: "1:28:54",
  route:
    "ssfRg|skRMJQBmGoAUOi@u@o@qAg@c@g@MgCCk@s@@a@RYlB}@`Am@|AoApA{AlAiAHQKUgBiAiA}@}A_AOGs@Em@Us@A}B`@aCLmA@aBa@g@DSJORG\\@Xj@`BHN^PD\\d@`Ab@|ADtANt@hApABJGNa@@uAWu@Eg@BaA\\w@r@oBvA}A|AI`@Lz@?p@Ot@WNoADg@g@e@I[F_@P}DpA_@DgB]mAG[Dk@Xa@@o@QaAi@SC_@HIH@TR|A\\|AdA|C~@lDe@Pe@rAeAlA_@T{@Zq@RyATmBx@e@JU?qAS_CPaB]i@E}F@]DmBt@y@RiAJcACaAVkAj@eAZs@l@Sx@SToAt@aD~ADCMNQl@SdB]hAa@jBLPl@JxBLlAEl@JVP^z@XJrC?jJBdGn@b@AXb@vAlANFVAf@UFItAuFv@uA`@YtBCZGRSD]QgCLyAn@{@fAaAXc@Xw@Ai@BGPIT?rBHl@Hp@PxAP\\@PET[FcAOyB@a@P[XMP@NH`AdAr@tABxALh@b@t@h@Z|BRxAv@^JvEOt@L|Cz@tFd@hCFl@J~CbAr@D{@cDmA_AmAKcH[kBm@}ASwAa@eAi@m@u@_@aB]uDDs@Ny@`@k@v@c@fAUtC_@LDHLJv@P`@|@J\\XRj@VnBN^PJZBXCZWj@{@JEZ@\\Jf@h@ZP|@PxC~@rCjA`@B`@MdB}@PQh@aAXSZKv@Aj@Fv@\\dAnBPPb@?TMRe@@wAU]u@Ua@YQa@Ec@r@eAtAqAvBiAd@o@F[Sm@k@{@q@sAo@mBmB}JSgBOcDHaC?aAO}DI[QIm@?w@d@sAn@{@P_Az@{@X[Py@v@o@dAgAn@cBpBeCdA[RJYc@TKRI`@D`BNrAIhEOfC[nA]x@uA~Au@h@_A`@g@P}@PKTLv@HPLFp@Fb@`@N^JbANl@Vd@TJZ?XIVU`@o@`@G^Ln@p@^RnARz@ZdATdCbAj@HdA]dAm@TW`@y@LK`@OhAEd@Dt@\\t@zA\\d@XDVETSJW?sACOUYu@Se@]Q]Cg@b@k@fBcB\\W|@]RQl@s@J]IScA{Ae@eAk@eBQu@OaACq@[_B",
};

// ── Strava Logo SVG ───────────────────────────────────────────────────────────
const StravaLogo = ({ size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066l-2.084 4.116z" fill="#FC4C02" />
    <path d="M11.094 13.828l2.151-4.248 2.15 4.248h3.066L13.245 3.672 8.028 13.828h3.066z" fill="#FC4C02" />
  </svg>
);

// ── Pace calculator ───────────────────────────────────────────────────────────
function calcPace(distanceKm, timeStr) {
  const parts = timeStr.split(":").map(Number);
  const totalMinutes =
    parts.length === 3
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
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function RunningCard() {
  const [data, setData] = useState(null);
  const [svgPoints, setSvgPoints] = useState([]);
  const [animated, setAnimated] = useState(false);
  const pathRef = useRef(null);

  const SVG_W = 320;
  const SVG_H = 260;

  useEffect(() => {
    // Try to fetch live CSV; fall back to static on error
    fetch(CSV_URL)
      .then((r) => r.text())
      .then((text) => {
        const rows = text.trim().split("\n");
        if (rows.length < 2) throw new Error("no data");
        const last = rows[rows.length - 1].split(",");
        setData({
          date: last[0],
          distance: last[1],
          time: last[2],
          route: last[3],
        });
      })
      .catch(() => setData(STATIC_DATA));
  }, []);

  useEffect(() => {
    if (!data?.route) return;
    const decoded = decodePolyline(data.route);
    setSvgPoints(normalizePath(decoded, SVG_W, SVG_H, 18));
    setTimeout(() => setAnimated(true), 100);
  }, [data]);

  const polylineStr = svgPoints.map((p) => p.join(",")).join(" ");
  const pathD =
    svgPoints.length > 0
      ? "M " + svgPoints.map((p) => p.join(" ")).join(" L ")
      : "";

  const pace = data ? calcPace(parseFloat(data.distance), data.time) : "--";

  const styles = {
    "@import":
      "url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;600&display=swap')",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:ital,wght@0,400;0,500;1,400&family=Outfit:wght@300;400;600;700&display=swap');

        .running-card {
          position: relative;
          display: flex;
          width: 680px;
          min-height: 300px;
          border-radius: 20px;
          overflow: hidden;
          background: #0d0d0d;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.06),
            0 40px 80px rgba(0,0,0,0.6),
            0 0 120px rgba(252,76,2,0.05);
          font-family: 'Outfit', sans-serif;
        }

        /* subtle grain overlay */
        .running-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.03;
          pointer-events: none;
          z-index: 10;
          border-radius: 20px;
        }

        /* ── Left: Route panel ── */
        .route-panel {
          position: relative;
          flex: 0 0 340px;
          background: linear-gradient(135deg, #111111 0%, #0a0a0a 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px 20px 20px;
          border-right: 1px solid rgba(255,255,255,0.05);
        }

        .route-panel::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #FC4C02 50%, transparent);
          opacity: 0.6;
        }

        .route-svg {
          width: 100%;
          height: auto;
          filter: drop-shadow(0 0 10px rgba(252,76,2,0.25));
        }

        .route-path {
          fill: none;
          stroke: url(#routeGrad);
          stroke-width: 2.2;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 3000;
          stroke-dashoffset: 3000;
          transition: stroke-dashoffset 2.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .route-path.drawn {
          stroke-dashoffset: 0;
        }

        .strava-row {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-top: 14px;
          opacity: 0.75;
        }

        .strava-text {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          color: #FC4C02;
          text-transform: uppercase;
        }

        /* ── Right: Stats panel ── */
        .stats-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 28px 30px 24px;
          background: linear-gradient(160deg, #141414 0%, #0f0f0f 100%);
          position: relative;
        }

        .run-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.22em;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase;
        }

        .run-date {
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          font-weight: 300;
          color: rgba(255,255,255,0.45);
          margin-top: 5px;
          letter-spacing: 0.04em;
        }

        .divider {
          width: 32px;
          height: 1px;
          background: rgba(252,76,2,0.5);
          margin: 18px 0;
        }

        .distance-block {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }

        .distance-value {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 72px;
          line-height: 0.9;
          letter-spacing: 0.01em;
          color: #ffffff;
          background: linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.7) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .distance-unit {
          font-family: 'Outfit', sans-serif;
          font-size: 18px;
          font-weight: 300;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.06em;
          align-self: flex-end;
          padding-bottom: 8px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px 12px;
          margin-top: 22px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .stat-label {
          font-family: 'DM Mono', monospace;
          font-size: 9.5px;
          font-weight: 500;
          letter-spacing: 0.2em;
          color: rgba(255,255,255,0.25);
          text-transform: uppercase;
        }

        .stat-value {
          font-family: 'DM Mono', monospace;
          font-size: 22px;
          font-weight: 500;
          color: rgba(255,255,255,0.9);
          letter-spacing: 0.01em;
        }

        .stat-value.accent {
          color: #FC4C02;
        }

        .orange-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #FC4C02;
          margin-bottom: 1px;
          margin-right: 2px;
          box-shadow: 0 0 8px rgba(252,76,2,0.6);
        }

        @media (max-width: 680px) {
          .running-card {
            flex-direction: column;
            width: 100%;
          }
          .route-panel {
            flex: unset;
            border-right: none;
            border-bottom: 1px solid rgba(255,255,255,0.05);
          }
        }
      `}</style>

      <div className="running-card">
        {/* ── Left: Route ── */}
        <div className="route-panel">
          <svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            className="route-svg"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF6B35" />
                <stop offset="50%" stopColor="#FC4C02" />
                <stop offset="100%" stopColor="#E63900" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Glow ghost path */}
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke="#FC4C02"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.12"
                filter="url(#glow)"
              />
            )}

            {/* Main animated route path */}
            {pathD && (
              <path
                ref={pathRef}
                d={pathD}
                className={`route-path ${animated ? "drawn" : ""}`}
                filter="url(#glow)"
              />
            )}

            {/* Start dot */}
            {svgPoints.length > 0 && (
              <circle
                cx={svgPoints[0][0]}
                cy={svgPoints[0][1]}
                r="5"
                fill="#FC4C02"
                opacity={animated ? 1 : 0}
                style={{ transition: "opacity 0.4s ease 2.2s" }}
              />
            )}

            {/* End dot */}
            {svgPoints.length > 1 && (
              <circle
                cx={svgPoints[svgPoints.length - 1][0]}
                cy={svgPoints[svgPoints.length - 1][1]}
                r="5"
                fill="#ffffff"
                opacity={animated ? 0.9 : 0}
                style={{ transition: "opacity 0.4s ease 2.4s" }}
              />
            )}
          </svg>

          <div className="strava-row">
            <StravaLogo size={20} />
            <span className="strava-text">via Strava</span>
          </div>
        </div>

        {/* ── Right: Stats ── */}
        <div className="stats-panel">
          <div>
            <div className="run-label">
              <span className="orange-dot" /> Morning Run
            </div>
            <div className="run-date">
              {data ? formatDate(data.date) : "—"}
            </div>
          </div>

          <div>
            <div className="divider" />
            <div className="distance-block">
              <span className="distance-value">
                {data ? data.distance : "—"}
              </span>
              <span className="distance-unit">km</span>
            </div>

            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Time</span>
                <span className="stat-value">{data ? data.time : "—"}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Avg Pace</span>
                <span className="stat-value accent">{pace}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
