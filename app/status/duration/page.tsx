"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const imgStatusIcons = "/assets/cf8adf0c371ee4bab6d9c27869714c5a52b939c5.svg";
const imgBackArrow = "/assets/45d8a0f6495680e676880af5da9c876d1c9d332b.svg";
const imgSprite = "/assets/93f4b4820b17fbe3452435cdd0421d04ab86dd50.png";

// Sprite 1448x1086px. Icon regions from canvas scan (non-white pixels, x=200-500 only).
// Row1 clock: x=[229,435] y=[141,308] 206×167. Row2 calendar: x=[235,407] y=[448,609] 172×161. Row3 hourglass: x=[247,404] y=[751,924] 157×173.
const options = [
  {
    label: "1시간 이하",
    icon: { w: 56, h: 53, bgSize: "394px", bgPos: "-62px -34px" },
  },
  {
    label: "1~3시간",
    icon: { w: 58, h: 52, bgSize: "467px", bgPos: "-75px -145px" },
  },
  {
    label: "3시간 이상",
    icon: { w: 58, h: 55, bgSize: "460px", bgPos: "-75px -239px" },
  },
];

export default function DurationPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const router = useRouter();

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
            <button onClick={() => router.back()} className="absolute" style={{ left: 32, top: 7, width: 28, height: 28, background: "none", border: "none", padding: 0, cursor: "pointer" }}>
              <img alt="back" className="block size-full" src={imgBackArrow} />
            </button>
            <p className="absolute text-center" style={{ left: "50%", transform: "translateX(-50%)", top: 14, fontSize: 22, fontWeight: 500, color: "#111", whiteSpace: "nowrap", lineHeight: 1.5 }}>
              추천
            </p>
          </div>

          {/* Step label */}
          <p className="absolute whitespace-nowrap" style={{ left: 23, top: 129, fontSize: 14, fontWeight: 500, color: "#111", letterSpacing: "-0.35px", lineHeight: 1.5 }}>
            STEP 2
          </p>

          {/* Question */}
          <p className="absolute whitespace-nowrap" style={{ left: 21, top: 150, fontSize: 22, fontWeight: 600, color: "#111", letterSpacing: "-0.55px", lineHeight: 1.5 }}>
            얼마나 공부할 계획인가요?
          </p>

          {/* Options */}
          <div className="absolute flex flex-col" style={{ left: 37, top: 225, width: 313, gap: 12 }}>
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
                  <div
                    style={{
                      flexShrink: 0,
                      width: opt.icon.w,
                      height: opt.icon.h,
                      backgroundImage: `url(${imgSprite})`,
                      backgroundSize: opt.icon.bgSize,
                      backgroundPosition: opt.icon.bgPos,
                      backgroundRepeat: "no-repeat",
                    }}
                  />
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
              sessionStorage.setItem("spotyu_duration", options[selected].label);
              router.push("/status/distance");
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
            <div className="absolute rounded-[100px]" style={{ bottom: 8, left: "50%", transform: "translateX(-50%)", width: 134, height: 5, backgroundColor: "#111" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
