"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

export default function ConditionPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div style={{ width: 390, height: 844, position: "relative" }}>
        <div
          className="bg-[#f8f8f8] border-2 border-[#111] border-solid overflow-clip relative rounded-[25px]"
          style={{ width: "100%", height: "100%" }}
        >
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
            STEP 4
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
                    height: 80, width: "100%",
                    paddingLeft: 27, paddingRight: 20, gap: 12,
                    border: isSelected ? "2px solid #ffbf00" : "1px solid #f0f0f0",
                    backgroundColor: isSelected ? "#fff8e2" : "#ffffff",
                    boxShadow: isSelected ? "0px 0px 6px rgba(255,191,0,0.24)" : "none",
                    cursor: "pointer", textAlign: "left",
                  }}
                >
                  <div style={{ width: opt.icon.w, height: opt.icon.h, position: "relative", flexShrink: 0, overflow: "hidden" }}>
                    <img
                      alt="" src={opt.icon.src}
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
            onClick={async () => {
              if (selected === null || submitting) return;
              setSubmitting(true);
              const conditionLabel = options[selected].label;
              sessionStorage.setItem("spotyu_condition", conditionLabel);
              const purpose = sessionStorage.getItem("spotyu_purpose") ?? "";
              const duration = sessionStorage.getItem("spotyu_duration") ?? "";
              const distance = sessionStorage.getItem("spotyu_distance") ?? "";
              try {
                const res = await fetch("/api/recommend", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ purpose, duration, distance, condition: conditionLabel }),
                });
                const data = await res.json();
                sessionStorage.setItem("spotyu_recommended_ids", JSON.stringify(data.ids ?? []));
              } catch {
                sessionStorage.setItem("spotyu_recommended_ids", JSON.stringify([]));
              }
              router.push("/status/loading");
            }}
            className="absolute flex items-center justify-center rounded-[10px]"
            style={{
              left: 24, top: 732, width: 339, height: 60,
              backgroundColor: selected !== null && !submitting ? "#ffbf00" : "#e0e0e0",
              border: "none", cursor: selected !== null && !submitting ? "pointer" : "not-allowed",
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 600, color: "#111", letterSpacing: "-0.4px", lineHeight: 1.5 }}>
              {submitting ? "추천 받는 중..." : "탐색하기"}
            </span>
          </button>

          {/* Home indicator */}
          <div className="absolute overflow-clip" style={{ bottom: -2, left: "50%", transform: "translateX(-50%)", width: 390, height: 34 }} />
        </div>
      </div>
    </div>
  );
}
