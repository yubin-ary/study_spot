"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import mockPlaces from "../data/mockPlaces";

const imgStatusIcons = "/assets/b655a4944c744b18f533b9c4e87522b5f1e0f728.svg";

function IconCompass({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8.5" stroke={color} strokeWidth="1.4" />
      <path d="M10 3.5L7.5 10L12.5 10Z" fill={color} />
      <path d="M10 16.5L7.5 10L12.5 10Z" stroke={color} strokeWidth="1.2" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
function IconMap({ color }: { color: string }) {
  return (
    <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
      <path d="M6.5 1.5L1 3.5V14.5L6.5 12.5L11.5 14.5L17 12.5V1.5L11.5 3.5L6.5 1.5Z" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M6.5 1.5V12.5M11.5 3.5V14.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function IconIsland({ color }: { color: string }) {
  return (
    <svg width="24" height="21" viewBox="0 0 24 21" fill="none">
      <path d="M17.5 18.5Q17.5 19.5 16.5 19.5L2.5 19.5Q1.5 19.5 1.5 18.5L1.5 5.5Q1.5 4.5 2.5 4.5L6.5 4.5L8.5 8L16.5 8Q17.5 8 17.5 9Z" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="20" cy="5" r="3.5" fill={color} />
      <path d="M20 3.3v3.4M18.3 5h3.4" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
function IconBookmark({ color }: { color: string }) {
  return (
    <svg width="14" height="17" viewBox="0 0 14 17" fill="none">
      <path d="M2 1.5h10v14L7 12 2 15.5V1.5Z" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}
function IconBell({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2C7.239 2 5 4.239 5 7v5l-1.5 1.5V15h13v-1.5L15 12V7c0-2.761-2.239-5-5-5Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8.5 15a1.5 1.5 0 003 0" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}
function IconPerson({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="6.5" r="3.5" stroke={color} strokeWidth="1.5" />
      <path d="M2 18c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const ISLANDS = [
  { type: "현실도피섬", subtitle: "복잡하고 답답한 공간", secret: false },
  { type: "가성비섬", subtitle: "부담 없이 오래 머물 수 있는 공간", secret: false },
  { type: "밤샘섬", subtitle: "늦은 시간도 이용 가능한 공간", secret: false },
  { type: "비밀섬", subtitle: "아는 사람만 아는 공부명당", secret: true },
] as const;

function countByCategory(islandType: string) {
  const places = mockPlaces.filter((p) => p.treasureType === islandType);
  return {
    total: places.length,
    카페: places.filter((p) => p.category === "카페").length,
    도서관: places.filter((p) => p.category === "도서관").length,
    스카: places.filter((p) => p.category === "스터디카페").length,
  };
}

const NAV_ITEMS = [
  { label: "추천", Icon: IconCompass, href: "/status/purpose" },
  { label: "지도", Icon: IconMap, href: "/map" },
  { label: "테마섬", Icon: IconIsland, href: "/theme" },
  { label: "보물함", Icon: IconBookmark, href: "/map" },
];

export default function ThemePage() {
  const router = useRouter();
  const [index, setIndex] = useState(0);

  const island = ISLANDS[index];
  const counts = countByCategory(island.type);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div style={{ width: 390, height: 844, position: "relative" }}>
        <div
          className="border-2 border-[#111] border-solid overflow-clip relative rounded-[25px]"
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(180deg, #d6ecfb 0%, #eaf6fd 55%, #f5f1e3 100%)",
          }}
        >
          <div className="absolute overflow-clip" style={{ top: 0, left: "50%", transform: "translateX(-50%)", width: 388, height: 43 }}>
            <div className="absolute" style={{ right: 24, top: 16.33, width: 64.341, height: 11.337 }}>
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgStatusIcons} />
            </div>
            <p className="absolute text-center" style={{ left: "50%", transform: "translateX(-50%)", top: 12, fontSize: 15, fontWeight: 600, lineHeight: "20px", letterSpacing: "-0.5px", color: "#111" }}>
              9:41
            </p>
          </div>

         
          <div style={{ position: "absolute", top: 43, left: 0, width: 390, height: 46, zIndex: 20, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", boxSizing: "border-box" }}>
            <p style={{ fontSize: 23, fontWeight: 900, color: "#ffbf00", letterSpacing: "-0.575px", lineHeight: 1.5, whiteSpace: "nowrap" }}>
              SPOTYU
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <IconPerson color="#000" />
              <IconBell color="#000" />
            </div>
          </div>

          <p className="absolute" style={{ left: 24, top: 100, fontSize: 22, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.4, letterSpacing: "-0.5px" }}>
            오늘은 어떤 공간에서<br />공부하고 싶나요?
          </p>
          <p className="absolute" style={{ left: 24, top: 168, fontSize: 13, fontWeight: 400, color: "#7a7a7a", letterSpacing: "-0.3px" }}>
            원하는 분위기의 스팟을 탐험해보세요.
          </p>

          <div
            className="absolute"
            style={{
              left: 36, top: 198, width: 318, height: 420,
              backgroundColor: "#ffc933",
              borderRadius: 24,
              boxShadow: "0px 8px 24px rgba(245,166,35,0.25)",
              padding: "26px 20px 20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <p style={{ fontSize: 21, fontWeight: 800, color: "#3a2e10", letterSpacing: "-0.5px" }}>{island.type}</p>
            <p style={{ marginTop: 6, fontSize: 12, fontWeight: 500, color: "#6b5a28", letterSpacing: "-0.3px" }}>{island.subtitle}</p>

            <div
              style={{
                marginTop: 16, width: 200, height: 170,
                borderRadius: 16,
                background: "rgba(255,255,255,0.35)",
                border: "1px dashed rgba(58,46,16,0.35)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#6b5a28", fontSize: 12, textAlign: "center", lineHeight: 1.5,
              }}
            >
              {island.type}<br />일러스트 자리
            </div>

            <div style={{ marginTop: 18, width: "100%", maxWidth: 240 }}>
              {island.secret ? (
                <div style={{ background: "rgba(255,255,255,0.55)", borderRadius: 10, padding: "10px 0", textAlign: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#3a2e10" }}>숨겨진 공부명당 {counts.total}</span>
                </div>
              ) : (
                <div style={{ background: "rgba(255,255,255,0.55)", borderRadius: 10, padding: "10px 0", display: "flex" }}>
                  {[
                    { label: "카페", n: counts.카페 },
                    { label: "도서관", n: counts.도서관 },
                    { label: "스카", n: counts.스카 },
                  ].map((c, i) => (
                    <div key={c.label} style={{ flex: 1, textAlign: "center", borderLeft: i === 0 ? "none" : "1px solid rgba(58,46,16,0.15)" }}>
                      <div style={{ fontSize: 11, color: "#6b5a28" }}>{c.label}</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#3a2e10", marginTop: 2 }}>{c.n}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => router.push(`/theme/${encodeURIComponent(island.type)}`)}
              style={{
                marginTop: 14, width: "100%", maxWidth: 240, height: 44,
                background: "rgba(255,255,255,0.75)", border: "none", borderRadius: 10,
                fontSize: 14, fontWeight: 700, color: "#3a2e10", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}
            >
              탐험하기 <span style={{ fontSize: 16 }}>›</span>
            </button>
          </div>

          <div className="absolute" style={{ left: 0, right: 0, top: 636, display: "flex", justifyContent: "center", gap: 7 }}>
            {ISLANDS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                style={{
                  width: i === index ? 20 : 7, height: 7, borderRadius: 4,
                  background: i === index ? "#8a8a8a" : "#cfcfcf",
                  border: "none", cursor: "pointer", padding: 0, transition: "all .2s",
                }}
              />
            ))}
          </div>

          <div className="absolute" style={{ left: 0, right: 0, bottom: 0, height: 80, background: "#fff", borderTop: "1px solid #eee", display: "flex", paddingBottom: 18 }}>
            {NAV_ITEMS.map((item) => {
              const active = item.label === "테마섬";
              const color = active ? "#f5a623" : "#b0b0b0";
              return (
                <button
                  key={item.label}
                  onClick={() => router.push(item.href)}
                  style={{ flex: 1, border: "none", background: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, paddingTop: 10 }}
                >
                  <item.Icon color={color} />
                  <span style={{ fontSize: 11, color, fontWeight: active ? 700 : 500 }}>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="absolute" style={{ bottom: 8, left: "50%", transform: "translateX(-50%)", width: 134, height: 5, backgroundColor: "#111", borderRadius: 100 }} />
        </div>
      </div>
    </div>
  );
}