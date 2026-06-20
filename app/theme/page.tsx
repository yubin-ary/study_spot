"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Place } from "../data/mockPlaces";
import { getPlaces } from "../services/placeService";

const imgStatusIcons = "/assets/b655a4944c744b18f533b9c4e87522b5f1e0f728.svg";
const imgNavBg = "/assets/4870fdf34b871dd7cc5520f60aad475b01c76985.svg";

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
  { type: "현실도피섬", subtitle: "복잡하고 답답한 공간", secret: false, image: "/assets/island-escape.png" },
  { type: "가성비섬", subtitle: "부담 없이 오래 머물 수 있는 공간", secret: false, image: "/assets/island-cheap.png" },
  { type: "밤샘섬", subtitle: "늦은 시간도 이용 가능한 공간", secret: false, image: "/assets/island-night.png" },
  { type: "비밀섬", subtitle: "아는 사람만 아는 공부명당", secret: true, image: "/assets/island-secret.png" },
] as const;

function countByCategory(places: Place[], islandType: string) {
  const filtered = places.filter((p) => p.treasureType === islandType);
  return {
    total: filtered.length,
    카페: filtered.filter((p) => p.category === "카페").length,
    도서관: filtered.filter((p) => p.category === "도서관").length,
    스카: filtered.filter((p) => p.category === "스터디카페").length,
  };
}

const NAV_ITEMS = [
  { label: "추천", Icon: IconCompass, href: "/status/purpose?from=nav" },
  { label: "지도", Icon: IconMap, href: "/map" },
  { label: "테마섬", Icon: IconIsland, href: "/theme" },
  { label: "보물함", Icon: IconBookmark, href: "/bookmarks" },
];

export default function ThemePage() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    getPlaces()
      .then((data) => setPlaces(data))
      .catch((err) => console.error("장소 목록 로딩 실패:", err));
  }, []);

  const island = ISLANDS[index];
  const counts = countByCategory(places, island.type);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx < -40 && index < ISLANDS.length - 1) setIndex(index + 1);
    else if (dx > 40 && index > 0) setIndex(index - 1);
    touchStartX.current = null;
  }

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

          {/* Card carousel – centre card + side peek cards */}
          <div
            className="absolute"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            style={{ left: 0, top: 198, width: 390, height: 430, overflow: "hidden" }}
          >
            {ISLANDS.map((isl, i) => {
              const offset = i - index;          // -1, 0, 1, 2 …
              const CARD_W = 318;
              const GAP = 334;                   // centre-to-centre distance
              const x = offset * GAP;
              const isActive = offset === 0;
              const c = countByCategory(places, isl.type);
              return (
                <div
                  key={isl.type}
                  onClick={() => { if (!isActive) setIndex(i); }}
                  style={{
                    position: "absolute",
                    top: isActive ? 0 : 16,
                    left: "50%",
                    width: CARD_W,
                    height: isActive ? 420 : 390,
                    transform: `translateX(calc(-50% + ${x}px))`,
                    transition: "transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94), top 0.35s, height 0.35s, opacity 0.35s",
                    backgroundColor: "#ffc933",
                    borderRadius: 24,
                    boxShadow: isActive
                      ? "0px 8px 24px rgba(245,166,35,0.35)"
                      : "0px 4px 12px rgba(245,166,35,0.18)",
                    opacity: Math.abs(offset) > 1 ? 0 : isActive ? 1 : 0.75,
                    padding: "26px 20px 20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: isActive ? "default" : "pointer",
                    pointerEvents: Math.abs(offset) > 1 ? "none" : "auto",
                    zIndex: isActive ? 2 : 1,
                  }}
                >
                  <p style={{ fontSize: 21, fontWeight: 800, color: "#3a2e10", letterSpacing: "-0.5px" }}>{isl.type}</p>
                  <p style={{ marginTop: 6, fontSize: 12, fontWeight: 500, color: "#6b5a28", letterSpacing: "-0.3px" }}>{isl.subtitle}</p>

                  <div style={{ marginTop: 16, width: 200, height: 170, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <img src={isl.image} alt={isl.type} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  </div>

                  <div style={{ marginTop: 18, width: "100%", maxWidth: 240 }}>
                    {isl.secret ? (
                      <div style={{ background: "rgba(255,255,255,0.55)", borderRadius: 10, padding: "10px 0", textAlign: "center" }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#3a2e10" }}>숨겨진 공부명당 {c.total}</span>
                      </div>
                    ) : (
                      <div style={{ background: "rgba(255,255,255,0.55)", borderRadius: 10, padding: "10px 0", display: "flex" }}>
                        {[{ label: "카페", n: c.카페 }, { label: "도서관", n: c.도서관 }, { label: "스카", n: c.스카 }].map((ct, ci) => (
                          <div key={ct.label} style={{ flex: 1, textAlign: "center", borderLeft: ci === 0 ? "none" : "1px solid rgba(58,46,16,0.15)" }}>
                            <div style={{ fontSize: 11, color: "#6b5a28" }}>{ct.label}</div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: "#3a2e10", marginTop: 2 }}>{ct.n}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {isActive && (
                    <button
                      onClick={(e) => { e.stopPropagation(); router.push(`/theme/${encodeURIComponent(isl.type)}`); }}
                      style={{
                        marginTop: 14, width: "100%", maxWidth: 240, height: 44,
                        background: "rgba(255,255,255,0.75)", border: "none", borderRadius: 10,
                        fontSize: 14, fontWeight: 700, color: "#3a2e10", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      }}
                    >
                      탐험하기 <span style={{ fontSize: 16 }}>›</span>
                    </button>
                  )}
                </div>
              );
            })}
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

          {/* Nav – 지도 페이지와 동일한 스타일 */}
          <div className="absolute" style={{ left: 0, right: 0, top: 745, height: 63 }}>
            <div style={{ position: "absolute", left: -2, right: -2, top: -7, height: 70 }}>
              <img src={imgNavBg} alt="" style={{ width: "100%", height: "100%", display: "block" }} />
            </div>
            <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", alignItems: "center", height: "100%", padding: "4px 0 0 0" }}>
              {NAV_ITEMS.map((item) => {
                const active = item.label === "테마섬";
                const color = active ? "#525252" : "#aeaeae";
                return (
                  <button
                    key={item.label}
                    onClick={() => router.push(item.href)}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  >
                    <item.Icon color={color} />
                    <span style={{ fontSize: 14, fontWeight: 500, color, letterSpacing: "-0.35px", lineHeight: 1.5, marginTop: 1 }}>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 네비바 아래 여백 */}
          <div className="absolute" style={{ left: 0, right: 0, top: 808, bottom: 0, background: "#fff", borderRadius: "0 0 25px 25px" }} />

        </div>
      </div>
    </div>
  );
}