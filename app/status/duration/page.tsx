"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const imgBackArrow = "/assets/45d8a0f6495680e676880af5da9c876d1c9d332b.svg";
const imgSprite = "/assets/93f4b4820b17fbe3452435cdd0421d04ab86dd50.png";

const options = [
  { label: "1시간 이하",  icon: { w: 56, h: 53, bgSize: "394px", bgPos: "-62px -34px" } },
  { label: "1~3시간",    icon: { w: 58, h: 52, bgSize: "467px", bgPos: "-75px -145px" } },
  { label: "3시간 이상", icon: { w: 58, h: 55, bgSize: "460px", bgPos: "-75px -239px" } },
];

export default function DurationPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const router = useRouter();

  return (
    <div className="pf-outer">
      <div className="pf-sizing">
        <div className="pf-frame bg-[#f8f8f8] border-2 border-[#111] border-solid overflow-clip rounded-[25px]"
          style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>

          <div style={{ flexShrink: 0, position: "relative", height: 101, paddingTop: 13 }}>
            <button onClick={() => router.back()} style={{ position: "absolute", left: 20, top: 20, width: 28, height: 28, background: "none", border: "none", padding: 0, cursor: "pointer" }}>
              <img alt="back" style={{ width: "100%", height: "100%", display: "block" }} src={imgBackArrow} />
            </button>
            <p style={{ position: "absolute", top: 20, left: 0, right: 0, textAlign: "center", fontSize: 22, fontWeight: 500, color: "#111", lineHeight: 1.3, pointerEvents: "none" }}>추천</p>
          </div>

          <div style={{ flexShrink: 0, padding: "0 21px 20px" }}>
            <p style={{ fontSize: 14, fontWeight: 500, color: "#111", letterSpacing: "-0.35px", lineHeight: 1.5, marginBottom: 4 }}>STEP 2</p>
            <p style={{ fontSize: 22, fontWeight: 600, color: "#111", letterSpacing: "-0.55px", lineHeight: 1.5 }}>얼마나 공부할 계획인가요?</p>
          </div>

          <div style={{ flex: 1, overflowY: "auto", minHeight: 0, padding: "0 37px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingBottom: 16 }}>
              {options.map((opt, i) => {
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
                    <div style={{ flexShrink: 0, width: opt.icon.w, height: opt.icon.h,
                      backgroundImage: `url(${imgSprite})`, backgroundSize: opt.icon.bgSize,
                      backgroundPosition: opt.icon.bgPos, backgroundRepeat: "no-repeat" }} />
                    <span style={{ fontSize: 16, fontWeight: 500, color: "#111", letterSpacing: "-0.4px", lineHeight: 1.5, whiteSpace: "nowrap" }}>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ flexShrink: 0, padding: "12px 24px", paddingBottom: "calc(24px + env(safe-area-inset-bottom, 0px))" }}>
            <button
              onClick={() => { if (selected === null) return; sessionStorage.setItem("spotyu_duration", options[selected].label); router.push("/status/distance"); }}
              style={{ width: "100%", height: 60, borderRadius: 10, border: "none", backgroundColor: selected !== null ? "#ffbf00" : "#e0e0e0", fontSize: 16, fontWeight: 600, color: "#111", letterSpacing: "-0.4px", cursor: selected !== null ? "pointer" : "not-allowed" }}>
              다음
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
