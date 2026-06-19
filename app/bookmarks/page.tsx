"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import mockPlaces, { Place } from "../data/mockPlaces";

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
        width: "100%", background: "#fffdf7", border: "1px solid #f2ead4",
        borderRadius: 14, padding: 14, boxSizing: "border-box", cursor: "pointer", position: "relative",
      }}
    >
      <div style={{ position: "absolute", top: 14, right: 14, display: "flex", alignItems: "center", gap: 3 }}>
        <span style={{ fontSize: 11, color: "#9a9a9a" }}>더보기</span>
        <span style={{ fontSize: 12, color: "#9a9a9a" }}>›</span>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ width: 64, height: 64, borderRadius: 10, overflow: "hidden", flexShrink: 0, background: "#eee" }}>
          <img src={place.imageUrl} alt={place.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", letterSpacing: "-0.3px" }}>{place.name}</span>
            {place.treasureType && (
              <span style={{ fontSize: 10, fontWeight: 600, color: "#d29d00", background: "#fff2cb", borderRadius: 5, padding: "1px 7px" }}>
                {place.treasureType}
              </span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
            <span style={{ fontSize: 11, color: "#8a8a8a" }}>🕐</span>
            <span style={{ fontSize: 11, color: "#8a8a8a", letterSpacing: "-0.3px" }}>
              평일 {place.weekdayHours} / 주말 {place.weekendHours}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", marginTop: 12, background: "#fbf6e8", borderRadius: 8, overflow: "hidden" }}>
        {[
          { icon: "🔈", label: "소음도", value: place.noiseLevel },
          { icon: "🏠", label: "규모", value: place.size },
          { icon: "✨", label: "집중도", value: place.cleanliness },
        ].map((m, i) => (
          <div key={m.label} style={{ flex: 1, textAlign: "center", padding: "6px 0", borderLeft: i === 0 ? "none" : "1px solid #eee2c4" }}>
            <div style={{ fontSize: 10, color: "#a08a4a" }}>{m.icon} {m.label}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#3a2e10", marginTop: 2 }}>{m.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const NAV_ITEMS = [
  { label: "추천", Icon: IconCompass, href: "/status/purpose" },
  { label: "지도", Icon: IconMap, href: "/map" },
  { label: "테마섬", Icon: IconIsland, href: "/theme" },
  { label: "보물함", Icon: IconBookmark, href: "/bookmarks" },
];

const FILTERS = ["전체", "가성비섬", "밤샘섬"];

export default function BookmarksPage() {
  const router = useRouter();
  const [filter, setFilter] = useState("전체");

  // TODO: 백엔드 연동 시 "사용자가 저장한 장소" API로 교체.
  const saved = mockPlaces;
  const filtered = filter === "전체" ? saved : saved.filter((p) => p.treasureType === filter);

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
              <span style={{ fontSize: 14, color: "#9a9a9a", flex: 1, letterSpacing: "-0.3px" }}>찾고 싶은 장소를 입력해주세요</span>
              <span style={{ fontSize: 16, color: "#9a9a9a" }}>🎙️</span>
            </div>
          </div>

          <div className="absolute" style={{ top: 158, left: 24, right: 24, display: "flex", alignItems: "center", gap: 8 }}>
            {FILTERS.map((f) => {
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
                저장한 장소가 없어요.
              </p>
            ) : (
              filtered.map((place) => (
                <BookmarkCard key={place.id} place={place} onClick={() => router.push(`/place/${place.id}`)} />
              ))
            )}
          </div>

          <div className="absolute" style={{ left: 0, right: 0, bottom: 0, height: 80, background: "#fff", borderTop: "1px solid #eee", display: "flex", paddingBottom: 18 }}>
            {NAV_ITEMS.map((item) => {
              const active = item.label === "보물함";
              const color = active ? "#f5a623" : "#b0b0b0";
              return (
                <button
                  key={item.label}
                  onClick={() => router.push(item.href)}
                  style={{ flex: 1, border: "none", background: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, paddingTop: 10 }}
                >
                  {item.label === "보물함"
                    ? <IconBookmark color={color} filled={active} />
                    : <item.Icon color={color} />}
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