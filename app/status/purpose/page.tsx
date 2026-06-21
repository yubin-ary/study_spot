"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const SPRITE = "/assets/6795fd2b94288a677dd9e2e36b2bd2a0039b05a9.png";
const imgBackArrow = "/assets/45d8a0f6495680e676880af5da9c876d1c9d332b.svg";

const OPTIONS = [
  { label: "시험 공부", icon: { w: 52, h: 52, imgW: "324.03%", imgH: "361.38%", imgL: "-47.55%", imgT: "-53.31%" } },
  { label: "팀플",     icon: { w: 52, h: 52, imgW: "324.03%", imgH: "361.38%", imgL: "-174.49%", imgT: "-57.2%" } },
  { label: "독서",     icon: { w: 52, h: 52, imgW: "324.03%", imgH: "361.38%", imgL: "-46.28%", imgT: "-196.26%" } },
  { label: "자격증 공부", icon: { w: 52, h: 52, imgW: "324.03%", imgH: "361.38%", imgL: "-174.49%", imgT: "-198.4%" } },
];

export default function PurposePage() {
  const [selected, setSelected] = useState<number | null>(null);
  const [showBack, setShowBack] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setShowBack(new URLSearchParams(window.location.search).get("from") === "nav");
  }, []);

  return (
    <div className="pf-outer">
      <div className="pf-sizing">
        <div className="pf-frame bg-[#f8f8f8] border-2 border-[#111] border-solid overflow-clip rounded-[25px]"
          style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>

          <div style={{ flexShrink: 0, position: "relative", height: 121, paddingTop: 13 }}>
            {showBack && (
              <button onClick={() => router.back()} style={{ position: "absolute", left: 20, top: 20, width: 28, height: 28, background: "none", border: "none", padding: 0, cursor: "pointer" }}>
                <img alt="back" style={{ width: "100%", height: "100%", display: "block" }} src={imgBackArrow} />
              </button>
            )}
            <p style={{ position: "absolute", top: 20, left: 0, right: 0, textAlign: "center", fontSize: 22, fontWeight: 500, color: "#111", lineHeight: 1.3 }}>추천</p>
          </div>

          <div style={{ flexShrink: 0, padding: "0 21px 20px" }}>
            <p style={{ fontSize: 14, fontWeight: 500, color: "#111", letterSpacing: "-0.35px", lineHeight: 1.5, marginBottom: 4 }}>STEP 1</p>
            <p style={{ fontSize: 22, fontWeight: 600, color: "#111", letterSpacing: "-0.55px", lineHeight: 1.5 }}>오늘 무엇을 할 예정인가요?</p>
          </div>

          <div style={{ flex: 1, overflowY: "auto", minHeight: 0, padding: "0 34px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingBottom: 16 }}>
              {OPTIONS.map((opt, i) => {
                const isSelected = selected === i;
                return (
                  <button key={i} onClick={() => setSelected(i)}
                    style={{
                      height: 80, width: "100%", display: "flex", alignItems: "center",
                      paddingLeft: 27, paddingRight: 20, gap: 12, borderRadius: 10,
                      border: isSelected ? "2px solid #ffbf00" : "1px solid #f0f0f0",
                      backgroundColor: isSelected ? "#fff8e2" : "#ffffff",
                      boxShadow: isSelected ? "0px 0px 6px rgba(255,191,0,0.24)" : "none",
                      cursor: "pointer", textAlign: "left", flexShrink: 0,
                    }}>
                    <div style={{ width: opt.icon.w, height: opt.icon.h, position: "relative", flexShrink: 0, overflow: "hidden" }}>
                      <img alt="" src={SPRITE} style={{ position: "absolute", width: opt.icon.imgW, height: opt.icon.imgH, left: opt.icon.imgL, top: opt.icon.imgT, maxWidth: "none", pointerEvents: "none" }} />
                    </div>
                    <span style={{ fontSize: 16, fontWeight: 500, color: "#111", letterSpacing: "-0.4px", lineHeight: 1.5, whiteSpace: "nowrap" }}>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ flexShrink: 0, padding: "12px 24px", paddingBottom: "calc(24px + env(safe-area-inset-bottom, 0px))" }}>
            <button
              onClick={() => { if (selected === null) return; sessionStorage.setItem("spotyu_purpose", OPTIONS[selected].label); router.push("/status/duration"); }}
              style={{ width: "100%", height: 60, borderRadius: 10, border: "none", backgroundColor: selected !== null ? "#ffbf00" : "#e0e0e0", fontSize: 16, fontWeight: 600, color: "#111", letterSpacing: "-0.4px", cursor: selected !== null ? "pointer" : "not-allowed" }}>
              다음
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
