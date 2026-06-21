"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const imgBackArrow = "/assets/45d8a0f6495680e676880af5da9c876d1c9d332b.svg";
const imgSprite = "/assets/34778ad51d321a322aaa60ad49e33b380b3626a4.png";

const options = [
  { label: "10분 이내",  icon: { w: 51, h: 52, imgW: "339.95%", imgH: "495.48%", imgL: "-13.73%", imgT: "-191.29%" } },
  { label: "30분 이내",  icon: { w: 48, h: 52, imgW: "361.2%",  imgH: "495.48%", imgL: "-128.39%", imgT: "-190.59%" } },
  { label: "1시간 이내", icon: { w: 48, h: 52, imgW: "361.2%",  imgH: "495.48%", imgL: "-239.35%", imgT: "-190.59%" } },
];

export default function DistancePageClient() {
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
            <p style={{ position: "absolute", top: 20, left: 0, right: 0, textAlign: "center", fontSize: 22, fontWeight: 500, color: "#111", lineHeight: 1.3 }}>추천</p>
          </div>

          <div style={{ flexShrink: 0, padding: "0 21px 20px" }}>
            <p style={{ fontSize: 14, fontWeight: 500, color: "#111", letterSpacing: "-0.35px", lineHeight: 1.5, marginBottom: 4 }}>STEP 3</p>
            <p style={{ fontSize: 22, fontWeight: 600, color: "#111", letterSpacing: "-0.55px", lineHeight: 1.5 }}>얼마나 이동할 수 있나요?</p>
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
                    <div style={{ width: opt.icon.w, height: opt.icon.h, position: "relative", flexShrink: 0, overflow: "hidden" }}>
                      <img alt="" src={imgSprite} style={{ position: "absolute", width: opt.icon.imgW, height: opt.icon.imgH, left: opt.icon.imgL, top: opt.icon.imgT, maxWidth: "none", pointerEvents: "none" }} />
                    </div>
                    <span style={{ fontSize: 16, fontWeight: 500, color: "#111", lineHeight: 1.5, whiteSpace: "nowrap" }}>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ flexShrink: 0, padding: "12px 24px", paddingBottom: "calc(24px + env(safe-area-inset-bottom, 0px))" }}>
            <button
              onClick={() => { if (selected === null) return; sessionStorage.setItem("spotyu_distance", options[selected].label); router.push("/status/condition"); }}
              style={{ width: "100%", height: 60, borderRadius: 10, border: "none", backgroundColor: selected !== null ? "#ffbf00" : "#e0e0e0", fontSize: 16, fontWeight: 600, color: "#111", letterSpacing: "-0.4px", cursor: selected !== null ? "pointer" : "not-allowed" }}>
              다음
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
