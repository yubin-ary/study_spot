"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const imgSprite = "/assets/6795fd2b94288a677dd9e2e36b2bd2a0039b05a9.png";

const OPTIONS = [
  {
    label: "시험 공부",
    value: "시험 공부",
    icon: { w: 93, h: 83, imgW: "324.03%", imgH: "361.38%", imgL: "-47.55%", imgT: "-53.31%" },
  },
  {
    label: "팀플",
    value: "팀플",
    icon: { w: 93, h: 83, imgW: "324.03%", imgH: "361.38%", imgL: "-174.49%", imgT: "-57.2%" },
  },
  {
    label: "독서",
    value: "독서",
    icon: { w: 93, h: 83, imgW: "324.03%", imgH: "361.38%", imgL: "-46.28%", imgT: "-196.26%" },
  },
  {
    label: "자격증 공부",
    value: "자격증 공부",
    icon: { w: 93, h: 83, imgW: "324.03%", imgH: "361.38%", imgL: "-174.49%", imgT: "-198.4%" },
  },
];

export default function ConditionPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const router = useRouter();

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#e5e5e5" }}>
      <div style={{ width: 390, height: 844, position: "relative" }}>
        <div style={{ width: "100%", height: "100%", background: "#f8f8f8", border: "2px solid #111", borderRadius: 25, overflow: "hidden", position: "relative" }}>

          {/* Header */}
          <div style={{ position: "absolute", top: 45, left: 0, right: 0, height: 56, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <button
              onClick={() => router.push("/map")}
              style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 8, display: "flex", alignItems: "center" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M1 1L15 15M15 1L1 15" stroke="#111" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
            <p style={{ fontSize: 22, fontWeight: 500, color: "#111", letterSpacing: 0, lineHeight: 1.5 }}>추천</p>
          </div>

          {/* Step label */}
          <p style={{ position: "absolute", left: 30, top: 129, fontSize: 14, fontWeight: 500, color: "#111", letterSpacing: "-0.35px", lineHeight: 1.5 }}>STEP 1</p>

          {/* Question */}
          <p style={{ position: "absolute", left: 28, top: 150, fontSize: 22, fontWeight: 600, color: "#111", letterSpacing: "-0.55px", lineHeight: 1.5 }}>
            오늘 무엇을 할 예정인가요?
          </p>

          {/* 2×2 grid */}
          <div style={{ position: "absolute", top: 222, left: 21, right: 21, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {OPTIONS.map((opt, i) => {
              const sel = selected === i;
              return (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  style={{
                    height: 160, borderRadius: 12, border: sel ? "2px solid #ffbf00" : "1px solid #f0f0f0",
                    background: sel ? "#fff8e2" : "#fff",
                    boxShadow: sel ? "0 0 12px rgba(255,191,0,0.24)" : "none",
                    cursor: "pointer", display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: 12,
                  }}
                >
                  <div style={{ width: opt.icon.w, height: opt.icon.h, position: "relative", overflow: "hidden", flexShrink: 0 }}>
                    <img
                      alt=""
                      src={imgSprite}
                      style={{ position: "absolute", width: opt.icon.imgW, height: opt.icon.imgH, left: opt.icon.imgL, top: opt.icon.imgT, maxWidth: "none" }}
                    />
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#111", letterSpacing: "-0.38px" }}>{opt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Next button */}
          <button
            onClick={() => {
              if (selected === null) return;
              sessionStorage.setItem("spotyu_condition", OPTIONS[selected].value);
              router.push("/status/purpose");
            }}
            style={{
              position: "absolute", left: "50%", transform: "translateX(-50%)", top: 732, width: 339, height: 60,
              background: selected !== null ? "#ffbf00" : "#e0e0e0",
              border: "none", borderRadius: 10, cursor: selected !== null ? "pointer" : "not-allowed",
              fontSize: 16, fontWeight: 600, color: "#111", letterSpacing: "-0.4px",
            }}
          >
            다음
          </button>

          {/* Home indicator spacing */}
          <div style={{ position: "absolute", bottom: -2, left: "50%", transform: "translateX(-50%)", width: 390, height: 34, overflow: "hidden" }} />
        </div>
      </div>
    </div>
  );
}
