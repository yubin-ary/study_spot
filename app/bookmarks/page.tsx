"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import mockPlaces, { Place } from "../data/mockPlaces";

const STORAGE_KEY = "spotyu_saved_places";
function getSavedIds(): number[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"); } catch { return []; }
}

const imgStatusIcons = "/assets/b655a4944c744b18f533b9c4e87522b5f1e0f728.svg";
const imgChevronRight = "/assets/d87c43c80e992a0641ded1887d61e2df8dcd2d62.svg";
const imgNavBg = "/assets/4870fdf34b871dd7cc5520f60aad475b01c76985.svg";
const imgDivider = "/assets/a90fc2e1380e556a9f90746c725a57a7a370ee91.svg";

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
function IconBookmark({ color, filled }: { color: string; filled?: boolean }) {
  return (
    <svg width="14" height="17" viewBox="0 0 14 17" fill="none">
      <path d="M2 1.5h10v14L7 12 2 15.5V1.5Z" stroke={color} strokeWidth="1.4" strokeLinejoin="round" fill={filled ? color : "none"} />
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

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  카페: { bg: "#fff8e6", text: "#d29d00" },
  도서관: { bg: "#e8f0fe", text: "#3b5bdb" },
  스터디카페: { bg: "#e6e9ff", text: "#2474ed" },
};

function BookmarkCard({ place, onClick }: { place: Place; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: "100%", height: 158, flexShrink: 0, background: "#fff",
        border: "1px solid #ffe38e", borderRadius: 10,
        boxSizing: "border-box", cursor: "pointer", position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 더보기 */}
      <div style={{ position: "absolute", top: 16, right: 8, display: "flex", alignItems: "center", gap: 3 }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: "#525252", letterSpacing: "-0.3px" }}>더보기</span>
        <div style={{ transform: "rotate(180deg)", width: 5, height: 10 }}>
          <img src={imgChevronRight} alt="" style={{ width: "100%", height: "100%" }} />
        </div>
      </div>

      {/* Left image – narrow vertical */}
      <div style={{ position: "absolute", left: 16, top: 16, width: 58, height: 126, borderRadius: 5, overflow: "hidden", background: "#eee" }}>
        <img src={place.imageUrl} alt={place.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {/* Island type badge */}
      {place.treasureType && (
        <div style={{
          position: "absolute", left: 89, top: 16,
          background: "#ffc822", borderRadius: 23, padding: "3px 14px",
          display: "inline-flex", alignItems: "center",
        }}>
          <span style={{ fontSize: 10, fontWeight: 500, color: "#565656", letterSpacing: "-0.25px", whiteSpace: "nowrap" }}>
            {place.treasureType}
          </span>
        </div>
      )}

      {/* Place name */}
      <div style={{ position: "absolute", left: 89, top: 37, right: 16 }}>
        <p style={{ fontSize: 16, fontWeight: 600, color: "#111", letterSpacing: "-0.4px", lineHeight: 1.5, margin: 0 }}>
          {place.name}
        </p>
      </div>

      {/* Hours */}
      <div style={{ position: "absolute", left: 89, top: 63, right: 16, display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 12, color: "#767676" }}>🕐</span>
        <span style={{ fontSize: 12, color: "#767676", letterSpacing: "-0.3px", lineHeight: 1.3, whiteSpace: "nowrap" }}>
          평일 {place.weekdayHours} / 주말 {place.weekendHours}
        </span>
      </div>

      {/* Info box */}
      <div style={{
        position: "absolute", left: 89, right: 21, top: 103,
        background: "#fff8e6", borderRadius: 9, padding: "6px 0",
        display: "flex",
      }}>
        {[
          { label: "소음도", value: place.noiseLevel },
          { label: "규모",   value: place.size },
          { label: "집중도", value: place.cleanliness },
        ].map((m, i) => (
          <div key={m.label} style={{ flex: 1, textAlign: "center", borderLeft: i === 0 ? "none" : "1px solid #e8d9a0" }}>
            <div style={{ fontSize: 9, color: "#d29d00", letterSpacing: "-0.225px", fontWeight: 500 }}>{m.label}</div>
            <div style={{ fontSize: 12, fontWeight: 500, color: "#636363", marginTop: 2, letterSpacing: "-0.3px" }}>{m.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const NAV_ITEMS = [
  { label: "추천", Icon: IconCompass, href: "/status/purpose?from=nav" },
  { label: "지도", Icon: IconMap, href: "/map" },
  { label: "테마섬", Icon: IconIsland, href: "/theme" },
  { label: "보물함", Icon: IconBookmark, href: "/bookmarks" },
];

export default function BookmarksPage() {
  const router = useRouter();
  const [filter, setFilter] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedIds, setSavedIds] = useState<number[]>([]);

  useEffect(() => {
    setSavedIds(getSavedIds());
  }, []);

  const saved = mockPlaces.filter((p) => savedIds.includes(p.id));

  const islandTypes = Array.from(
    new Set(saved.map((p) => p.treasureType).filter(Boolean) as string[])
  );
  const filters = ["전체", ...islandTypes];
  const filtered = saved.filter((p) => {
    const matchesFilter = filter === "전체" ? true : p.treasureType === filter;
    const q = searchQuery.trim();
    const matchesSearch = q === "" ? true :
      p.name.includes(q) || p.category.includes(q) || p.address.includes(q) ||
      (p.treasureType ?? "").includes(q) || p.visitTags.some(t => t.includes(q));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div style={{ width: 390, height: 844, position: "relative" }}>
        <div
          className="border-2 border-[#111] border-solid overflow-clip relative rounded-[25px]"
          style={{ width: "100%", height: "100%", background: "#fff" }}
        >
          <div className="absolute overflow-clip" style={{ top: 0, left: "50%", transform: "translateX(-50%)", width: 388, height: 43 }}>
            <div className="absolute" style={{ right: 24, top: 16.33, width: 64.341, height: 11.337 }}>
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgStatusIcons} />
            </div>
            <p className="absolute text-center" style={{ left: "50%", transform: "translateX(-50%)", top: 12, fontSize: 15, fontWeight: 600, lineHeight: "20px", letterSpacing: "-0.5px", color: "#111" }}>
              9:41
            </p>
          </div>

          <div className="absolute" style={{ top: 43, left: 0, width: 390, height: 46, zIndex: 20, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", boxSizing: "border-box" }}>
            <p style={{ fontSize: 23, fontWeight: 900, color: "#ffbf00", letterSpacing: "-0.575px", lineHeight: 1.5, whiteSpace: "nowrap" }}>
              SPOTYU
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <IconPerson color="#000" />
              <IconBell color="#000" />
            </div>
          </div>

          <div className="absolute" style={{ top: 100, left: "50%", transform: "translateX(-50%)", width: 342 }}>
            <div style={{ background: "#fff", borderRadius: 100, boxShadow: "0px 2px 2px rgba(0,0,0,0.15)", display: "flex", alignItems: "center", padding: "11px 16px", gap: 8 }}>
              <span style={{ fontSize: 16, color: "#9a9a9a" }}>🔍</span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="찾고 싶은 장소를 입력해주세요"
                style={{
                  flex: 1, border: "none", outline: "none", background: "transparent",
                  fontSize: 14, color: "#111", letterSpacing: "-0.3px",
                }}
              />
              {searchQuery ? (
                <button onClick={() => setSearchQuery("")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#aaa", padding: 0 }}>✕</button>
              ) : (
                <span style={{ fontSize: 16, color: "#9a9a9a" }}>🎙️</span>
              )}
            </div>
          </div>

          <div className="absolute" style={{ top: 158, left: 24, right: 24, display: "flex", alignItems: "center", gap: 8 }}>
            {filters.map((f) => {
              const active = filter === f;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    background: active ? "#ffbf00" : "#f2f2f2",
                    color: active ? "#fff" : "#888",
                    border: "none", borderRadius: 20, padding: "6px 16px",
                    fontSize: 12, fontWeight: 600, cursor: "pointer", letterSpacing: "-0.3px",
                  }}
                >
                  {f}
                </button>
              );
            })}
            <button
              style={{ background: "#f2f2f2", color: "#888", border: "none", borderRadius: 20, width: 32, height: 30, fontSize: 16, cursor: "pointer" }}
            >
              ＋
            </button>
          </div>

          <div
            className="absolute"
            style={{
              top: 200, left: 0, right: 0, bottom: 80,
              overflowY: "auto", padding: "8px 24px 20px",
              display: "flex", flexDirection: "column", gap: 14,
            }}
          >
            {filtered.length === 0 ? (
              <p style={{ textAlign: "center", color: "#9a9a9a", fontSize: 14, marginTop: 40 }}>
                {saved.length === 0 ? "저장한 장소가 없어요." : "검색 결과가 없어요."}
              </p>
            ) : (
              filtered.map((place) =>
                <BookmarkCard key={place.id} place={place} onClick={() => router.push(`/place/${place.id}`)} />
              )
            )}
          </div>

          {/* Nav – 지도 페이지와 동일한 스타일 */}
          <div className="absolute" style={{ left: 0, right: 0, top: 745, height: 63 }}>
            <div style={{ position: "absolute", left: -2, right: -2, top: -7, height: 70 }}>
              <img src={imgNavBg} alt="" style={{ width: "100%", height: "100%", display: "block" }} />
            </div>
            <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", alignItems: "center", height: "100%", padding: "4px 0 0 0" }}>
              {NAV_ITEMS.map((item) => {
                const active = item.label === "보물함";
                const color = active ? "#525252" : "#aeaeae";
                return (
                  <button
                    key={item.label}
                    onClick={() => router.push(item.href)}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  >
                    {item.label === "보물함"
                      ? <IconBookmark color={color} filled={active} />
                      : <item.Icon color={color} />}
                    <span style={{ fontSize: 14, fontWeight: 500, color, letterSpacing: "-0.35px", lineHeight: 1.5, marginTop: 1 }}>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}