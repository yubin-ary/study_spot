"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const imgBackArrow = "/assets/45d8a0f6495680e676880af5da9c876d1c9d332b.svg";
const imgSprite = "/assets/34778ad51d321a322aaa60ad49e33b380b3626a4.png";

const options = [
  {
    label: "10분 이내",
    icon: { w: 51, h: 52, imgW: "339.95%", imgH: "495.48%", imgL: "-13.73%", imgT: "-191.29%" },
  },
  {
    label: "30분 이내",
    icon: { w: 48, h: 52, imgW: "361.2%", imgH: "495.48%", imgL: "-128.39%", imgT: "-190.59%" },
  },
  {
    label: "1시간 이내",
    icon: { w: 48, h: 52, imgW: "361.2%", imgH: "495.48%", imgL: "-239.35%", imgT: "-190.59%" },
  },
];

export default function DistancePageClient() {
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
          {/* Status bar */}
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
            STEP 3
          </p>

          {/* Question */}
          <p className="absolute whitespace-nowrap" style={{ left: 21, top: 150, fontSize: 22, fontWeight: 600, color: "#111", lineHeight: 1.5 }}>
            얼마나 이동할 수 있나요?
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
                  <div style={{ width: opt.icon.w, height: opt.icon.h, position: "relative", flexShrink: 0, overflow: "hidden" }}>
                    <img
                      alt=""
                      src={imgSprite}
                      style={{ position: "absolute", width: opt.icon.imgW, height: opt.icon.imgH, left: opt.icon.imgL, top: opt.icon.imgT, maxWidth: "none", pointerEvents: "none" }}
                    />
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 500, color: "#111", lineHeight: 1.5, whiteSpace: "nowrap" }}>
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search button */}
          <button
            onClick={async () => {
              if (selected === null || submitting) return;
              setSubmitting(true);
              const distanceLabel = options[selected].label;
              sessionStorage.setItem("spotyu_distance", distanceLabel);
              const purpose = sessionStorage.getItem("spotyu_purpose") ?? "";
              const duration = sessionStorage.getItem("spotyu_duration") ?? "";
              try {
                const res = await fetch("/api/recommend", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ purpose, duration, distance: distanceLabel }),
                });
                const data = await res.json();
                sessionStorage.setItem("spotyu_recommended_ids", JSON.stringify(data.ids ?? []));
              } catch {
                // API 실패 시 빈 배열 저장 → 지도에서 전체 장소 표시하되 배너는 유지
                sessionStorage.setItem("spotyu_recommended_ids", JSON.stringify([]));
              }
              router.push("/status/loading");
            }}
            className="absolute flex items-center justify-center rounded-[10px]"
            style={{
              left: "50%", transform: "translateX(-50%)", top: 732, width: 339, height: 60,
              backgroundColor: selected !== null && !submitting ? "#ffbf00" : "#e0e0e0",
              border: "none", cursor: selected !== null && !submitting ? "pointer" : "not-allowed",
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 600, color: "#111", letterSpacing: "-0.4px", lineHeight: 1.5 }}>
              {submitting ? "추천 받는 중..." : "탐색하기"}
            </span>
          </button>

          {/* Home indicator */}
          <div className="absolute overflow-clip" style={{ bottom: -2, left: "50%", transform: "translateX(-50%)", width: 390, height: 34 }}>
          </div>
        </div>
      </div>
    </div>
  );
}
