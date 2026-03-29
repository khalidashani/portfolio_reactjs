import { useEffect, useState } from "react";
import RunningCard from "../components/RunningCard";

const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRuaWoLMneZNi1hf87p-kdps5LfG2UpnR0H9P39n36CAak5uBy3PXsc-vu7eJRWquCLhoaWegOZMI5L/pub?output=csv";

const STATIC_SESSIONS = [
  {
    date: "2026-03-29",
    distance: "14.04",
    time: "1:28:54",
    route: "ssfRg|skRMJQBmGoAUOi@u@o@qAg@c@g@MgCCk@s@@a@RYlB}@`Am@|AoApA{AlAiAHQKUgBiAiA}@}A_AOGs@Em@Us@A}B`@aCLmA@aBa@g@DSJORG\\@Xj@`BHN^PD\\d@`Ab@|ADtANt@hApABJGNa@@uAWu@Eg@BaA\\w@r@oBvA}A|AI`@Lz@?p@Ot@WNoADg@g@e@I[F_@P}DpA_@DgB]mAG[Dk@Xa@@o@QaAi@SC_@HIH@TR|A\\|AdA|C~@lDe@Pe@rAeAlA_@T{@Zq@RyATmBx@e@JU?qAS_CPaB]i@E}F@]DmBt@y@RiAJcACaAVkAj@eAZs@l@Sx@SToAt@aD~ADCMNQl@SdB]hAa@jBLPl@JxBLlAEl@JVP^z@XJrC?jJBdGn@b@AXb@vAlANFVAf@UFItAuFv@uA`@YtBCZGRSD]QgCLyAn@{@fAaAXc@Xw@Ai@BGPIT?rBHl@Hp@PxAP\\@PET[FcAOyB@a@P[XMP@NH`AdAr@tABxALh@b@t@h@Z|BRxAv@^JvEOt@L|Cz@tFd@hCFl@J~CbAr@D{@cDmA_AmAKcH[kBm@}ASwAa@eAi@m@u@_@aB]uDDs@Ny@`@k@v@c@fAUtC_@LDHLJv@P`@|@J\\XRj@VnBN^PJZBXCZWj@{@JEZ@\\Jf@h@ZP|@PxC~@rCjA`@B`@MdB}@PQh@aAXSZKv@Aj@Fv@\\dAnBPPb@?TMRe@@wAU]u@Ua@YQa@Ec@r@eAtAqAvBiAd@o@F[Sm@k@{@q@sAo@mBmB}JSgBOcDHaC?aAO}DI[QIm@?w@d@sAn@{@P_Az@{@X[Py@v@o@dAgAn@cBpBeCdA[RJYc@TKRI`@D`BNrAIhEOfC[nA]x@uA~Au@h@_A`@g@P}@PKTLv@HPLFp@Fb@`@N^JbANl@Vd@TJZ?XIVU`@o@`@G^Ln@p@^RnARz@ZdATdCbAj@HdA]dAm@TW`@y@LK`@OhAEd@Dt@\\t@zA\\d@XDVETSJW?sACOUYu@Se@]Q]Cg@b@k@fBcB\\W|@]RQl@s@J]IScA{Ae@eAk@eBQu@OaACq@[_B",
  },
];

function parseCSV(text) {
  const rows = text.trim().split("\n");
  return rows.slice(1).map((row) => {
    const firstComma  = row.indexOf(",");
    const secondComma = row.indexOf(",", firstComma + 1);
    const thirdComma  = row.indexOf(",", secondComma + 1);
    return {
      date:     row.slice(0, firstComma).trim(),
      distance: row.slice(firstComma + 1, secondComma).trim(),
      time:     row.slice(secondComma + 1, thirdComma).trim(),
      route:    row.slice(thirdComma + 1).trim(),
    };
  }).filter((s) => s.date && s.distance && s.route);
}

export default function Running() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetch(CSV_URL)
      .then((r) => r.text())
      .then((text) => {
        const parsed = parseCSV(text);
        setSessions(parsed.reverse());
      })
      .catch(() => setSessions(STATIC_SESSIONS))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: "40px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "32px" }}>
      <style>{`
        .runs-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          width: 100%;
        }
        .runs-grid .running-card {
          width: 100% !important;
        }
      `}</style>

      <h1 style={{ textAlign: "center", margin: 0 }}>Running Progress</h1>
      <p style={{ color: "rgba(255,255,255,0.4)", margin: 0, fontSize: "14px", fontFamily: "monospace" }}>
        {loading ? "Loading sessions..." : `${sessions.length} run${sessions.length !== 1 ? "s" : ""} logged`}
      </p>

      <div className="runs-grid">
        {sessions.map((session, index) => (
          <RunningCard key={index} data={session} cardId={String(index)} />
        ))}
      </div>
    </div>
  );
}