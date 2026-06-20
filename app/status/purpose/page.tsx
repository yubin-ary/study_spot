"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const imgStatusIcons = "/assets/cf8adf0c371ee4bab6d9c27869714c5a52b939c5.svg";
const imgBackArrow = "/assets/45d8a0f6495680e676880af5da9c876d1c9d332b.svg";
const imgSprite1 = "/assets/961a558920ba0acf64a3d2aba33cbac089b89d37.png";
const imgSprite2 = "/assets/6ea63b239ccefda56a4c02ab1d0fd3f6454b2ff4.png";

const options = [
  {
    label: "학교를 벗어나고 싶어요",
    icon: { src: imgSprite1, w: 53, h: 50, imgW: "283.41%", imgH: "200.98%", imgL: "-146.69%", imgT: "-37.07%" },
  },
  {
    label: "기분전환이 필요해요",
    icon: { src: imgSprite2, w: 56, h: 52, imgW: "528.52%", imgH: "482.16%", imgL: "-423.96%", imgT: "-112.81%" },
  },
  {
    label: "집중해서 공부하고 싶어요",
    icon: { src: imgSprite2, w: 50, h: 52, imgW: "528.52%", imgH: "436.84%", imgL: "-334.58%", imgT: "-98.14%" },
  },
  {
    label: "친구와 함께 공부하고 싶어요",
    icon: { src: imgSprite2, w: 47, h: 44, imgW: "528.52%", imgH: "482.16%", imgL: "-164.07%", imgT: "-283.19%" },
  },
];

export default function PurposePage() {
  const [selected, setSelected] = useState<number | null>(null);
  const [showBack, setShowBack] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setShowBack(new URLSearchParams(window.location.search).get("from") === "nav");
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div style={{ width: 390, height: 844, position: "relative" }}>
        <div
          className="bg-[#f8f8f8] border-2 border-[#111] border-solid overflow-clip relative rounded-[25px]"
          style={{ width: "100%", height: "100%" }}
        >
          {/* Status bar */}
          <div className="absolute overflow-clip" style={{ top: 0, left: "50%", transform: "translateX(-50%)", width: 388, height: 43 }}>
            <div className="absolute" style={{ right: 24, top: 16.33, width: 64.341, height: 11.337 }}>
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgStatusIcons} />
            </div>
            <p className="absolute text-center" style={{ left: "50%", transform: "translateX(-50%)", top: 12, fontSize: 15, fontWeight: 600, lineHeight: "20px", letterSpacing: "-0.5px", color: "#111" }}>
              9:41
            </p>
          </div>

          {/* Header */}
          <div className="absolute" style={{ top: 45, left: 0, right: 0, height: 56 }}>
            {showBack && (
              <button
                onClick={() => router.push("/map")}
                style={{
                  position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", padding: "8px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
                  <path d="M9 1L1 9L9 17" stroke="#111" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
            <p className="absolute text-center" style={{ left: "50%", transform: "translateX(-50%)", top: 14, fontSize: 22, fontWeight: 500, letterSpacing: 0, color: "#111", whiteSpace: "nowrap", lineHeight: 1.5 }}>
              추천
            </p>
          </div>

          {/* Step label */}
          <p className="absolute whitespace-nowrap" style={{ left: 23, top: 129, fontSize: 14, fontWeight: 500, color: "#111", letterSpacing: "-0.35px", lineHeight: 1.5 }}>
            STEP 1
          </p>

          {/* Question */}
          <p className="absolute whitespace-nowrap" style={{ left: 21, top: 150, fontSize: 22, fontWeight: 600, color: "#111", letterSpacing: "-0.55px", lineHeight: 1.5 }}>
            지금 어떤 상태인가요?
          </p>

          {/* Options */}
          <div className="absolute flex flex-col" style={{ left: 34, top: 225, width: 313, gap: 12 }}>
            {options.map((opt, i) => {
              const isSelected = selected === i;
              return (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className="flex items-center rounded-[10px]"
                  style={{
                    height: 80,
                    width: "100%",
                    paddingLeft: 27,
                    paddingRight: 20,
                    gap: 12,
                    border: isSelected ? "2px solid #ffbf00" : "1px solid #f0f0f0",
                    backgroundColor: isSelected ? "#fff8e2" : "#ffffff",
                    boxShadow: isSelected ? "0px 0px 6px rgba(255,191,0,0.24)" : "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div style={{ width: opt.icon.w, height: opt.icon.h, position: "relative", flexShrink: 0, overflow: "hidden" }}>
                    <img
                      alt=""
                      src={opt.icon.src}
                      style={{ position: "absolute", width: opt.icon.imgW, height: opt.icon.imgH, left: opt.icon.imgL, top: opt.icon.imgT, maxWidth: "none", pointerEvents: "none" }}
                    />
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 500, color: "#111", letterSpacing: "-0.4px", lineHeight: 1.5, whiteSpace: "nowrap" }}>
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Next button */}
          <button
            onClick={() => {
              if (selected === null) return;
              sessionStorage.setItem("spotyu_purpose", options[selected].label);
              router.push("/status/duration");
            }}
            className="absolute flex items-center justify-center rounded-[10px]"
            style={{
              left: 24, top: 732, width: 339, height: 60,
              backgroundColor: selected !== null ? "#ffbf00" : "#e0e0e0",
              border: "none", cursor: selected !== null ? "pointer" : "not-allowed",
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 600, color: "#111", letterSpacing: "-0.4px", lineHeight: 1.5 }}>다음</span>
          </button>

          {/* Home indicator */}
          <div className="absolute overflow-clip" style={{ bottom: -2, left: "50%", transform: "translateX(-50%)", width: 390, height: 34 }}>
          </div>
        </div>
      </div>
    </div>
  );
}
