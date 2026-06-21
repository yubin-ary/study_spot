"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GeoPoint, Place } from "../data/mockPlaces";
import { getPlaces, searchPlaces } from "../services/placeService";
import { getBookmarks, addBookmark, removeBookmark, type BookmarkEntry } from "../services/bookmarkService";
import KakaoMapView from "./KakaoMapView";

// Assets
const imgMap         = "/assets/b8dafec21f636b051f4261f80b461f8e271eb5ab.png";
const imgNavBg       = "/assets/4870fdf34b871dd7cc5520f60aad475b01c76985.svg";
const imgChevron     = "/assets/76f833f8b3cd3892dfd461fc036e1f9c44342db7.svg";
const imgMoreChevron = "/assets/a134d3c5a24645f38aaba0f39e0d113d5cd6a3b3.svg";
const imgEllipse55   = "/assets/4fa12631f27ca7d087de38c1353cb4f45f04be7d.svg";
const imgEllipse54   = "/assets/843fddce33436a5e7f0e81dd97a38b99e6cbe657.svg";

const PIN_ASSETS: Record<string, [string, string]> = {
  yellow:    ["/assets/eed65a445c9579713b6e937826b3acb414ee182e.svg", "/assets/1a913dfb1b2099f0b0ebfac754affbeca8db2b15.svg"],
  yellowSel: ["/assets/e86d36bc6d6642a132af6aaca2e79d7c495a1c1f.svg", "/assets/1a913dfb1b2099f0b0ebfac754affbeca8db2b15.svg"],
  purple:    ["/assets/f5262e986488b32bcfb0a29247a935ec430e4810.svg", "/assets/117ea0a25b7a3b7892a5ef5f3e4bd64deb33ce81.svg"],
  cyan:      ["/assets/c3af32240219a77df411bc3a80160532ee541bd2.svg", "/assets/1a913dfb1b2099f0b0ebfac754affbeca8db2b15.svg"],
  lavender:  ["/assets/cc1e772dd2e34ccfd2336b8bb203c5caa70ce082.svg", "/assets/117ea0a25b7a3b7892a5ef5f3e4bd64deb33ce81.svg"],
  blue:      ["/assets/78e7d437cbb64061fa6ee1485039af96f1780961.svg", "/assets/1a913dfb1b2099f0b0ebfac754affbeca8db2b15.svg"],
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  카페:       { bg: "#fff8e6", text: "#d29d00" },
  도서관:     { bg: "#e8f0fe", text: "#3b5bdb" },
  스터디카페: { bg: "#e6e9ff", text: "#2474ed" },
};

const FILTER_OPTIONS = ["전체 보물함", "밤샘섬", "가성비섬"];

const SHEET_EXPANDED  = 43;
const SHEET_DEFAULT   = 405;
// Collapsed: handle always peeking above nav (nav starts at 745, handle = 20px)
const SHEET_COLLAPSED = 720;

const STATIC_MAP_BOUNDS = {
  north: 37.6085,
  south: 37.6000,
  west: 127.0415,
  east: 127.0510,
};

const FALLBACK_LOCATION: GeoPoint = { lat: 37.6043, lng: 127.0440 };

function projectGeoPointToStaticMap(point: GeoPoint) {
  const x = ((point.lng - STATIC_MAP_BOUNDS.west) / (STATIC_MAP_BOUNDS.east - STATIC_MAP_BOUNDS.west)) * 100;
  const y = ((STATIC_MAP_BOUNDS.north - point.lat) / (STATIC_MAP_BOUNDS.north - STATIC_MAP_BOUNDS.south)) * 100;

  return {
    x: Math.max(0, Math.min(100, x)),
    y: Math.max(0, Math.min(100, y)),
  };
}

// Compact nav icons – 18×18 box, strokeWidth 1.4
function IconCompass({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      {/* Outer circle */}
      <circle cx="10" cy="10" r="8.5" stroke={color} strokeWidth="1.4"/>
      {/* North needle (filled) — tip up, wings at center */}
      <path d="M10 3.5L7.5 10L12.5 10Z" fill={color}/>
      {/* South needle (outline) — tip down, wings at center */}
      <path d="M10 16.5L7.5 10L12.5 10Z" stroke={color} strokeWidth="1.2" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

function IconMap({ color }: { color: string }) {
  return (
    <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
      <path d="M6.5 1.5L1 3.5V14.5L6.5 12.5L11.5 14.5L17 12.5V1.5L11.5 3.5L6.5 1.5Z" stroke={color} strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M6.5 1.5V12.5M11.5 3.5V14.5" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function IconIsland({ color }: { color: string }) {
  return (
    <svg width="24" height="21" viewBox="0 0 24 21" fill="none">
      {/* Folder with tab at top-left */}
      <path
        d="M17.5 18.5Q17.5 19.5 16.5 19.5L2.5 19.5Q1.5 19.5 1.5 18.5L1.5 5.5Q1.5 4.5 2.5 4.5L6.5 4.5L8.5 8L16.5 8Q17.5 8 17.5 9Z"
        stroke={color} strokeWidth="1.4" strokeLinejoin="round"
      />
      {/* Plus badge – filled circle */}
      <circle cx="20" cy="5" r="3.5" fill={color}/>
      {/* Plus sign inside badge */}
      <path d="M20 3.3v3.4M18.3 5h3.4" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}

function IconBookmark({ color }: { color: string }) {
  return (
    <svg width="14" height="17" viewBox="0 0 14 17" fill="none">
      <path d="M2 1.5h10v14L7 12 2 15.5V1.5Z" stroke={color} strokeWidth="1.4" strokeLinejoin="round"/>
    </svg>
  );
}

// Header icons – same 20×20 box for consistent sizing
function IconBell({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2C7.239 2 5 4.239 5 7v5l-1.5 1.5V15h13v-1.5L15 12V7c0-2.761-2.239-5-5-5Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M8.5 15a1.5 1.5 0 003 0" stroke={color} strokeWidth="1.5"/>
    </svg>
  );
}

function IconPerson({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="6.5" r="3.5" stroke={color} strokeWidth="1.5"/>
      <path d="M2 18c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

const NAV_ITEMS = [
  { label: "추천",  Icon: IconCompass,   active: false, href: "/status/purpose?from=nav" },
  { label: "지도",  Icon: IconMap,       active: true,  href: "/map" },
  { label: "테마섬", Icon: IconIsland,   active: false, href: "/theme" },
  { label: "보물함", Icon: IconBookmark, active: false, href: "/bookmarks" },
];

function PlacePin({ place, selected, onClick }: { place: Place; selected: boolean; onClick: () => void }) {
  const key = selected && place.pinType === "yellow" ? "yellowSel" : place.pinType;
  const [body, star] = PIN_ASSETS[key] ?? PIN_ASSETS.yellow;
  const size = selected ? { w: 60, h: 91 } : { w: 35, h: 53 };
  const position = projectGeoPointToStaticMap(place.coordinates);

  return (
    <button
      onClick={onClick}
      style={{
        position: "absolute",
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: "translate(-50%, -100%)",
        width: size.w,
        height: size.h,
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        zIndex: selected ? 10 : 5,
        transition: "all 0.2s",
      }}
    >
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <img src={body} alt="" style={{ position: "absolute", inset: "0 0 2% 0", width: "100%", height: "98%" }} />
        <div style={{ position: "absolute", top: "10.89%", left: "21.18%", right: "20.78%", bottom: "56.86%" }}>
          <div style={{ position: "absolute", top: "23.24%", left: "25.62%", right: "25.62%", bottom: "26.02%" }}>
            <img src={star} alt="" style={{ width: "100%", height: "100%" }} />
          </div>
        </div>
      </div>
    </button>
  );
}

function PlaceCard({ place, onClick, onDetailClick }: { place: Place; onClick: () => void; onDetailClick: () => void }) {
  const cat = CATEGORY_COLORS[place.category] ?? { bg: "#f0f0f0", text: "#666" };
  return (
    <div
      onClick={onClick}
      style={{
        width: 354,
        minHeight: 83,
        background: "#fafafa",
        borderRadius: 10,
        flexShrink: 0,
        cursor: "pointer",
        padding: "12px 17px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        minWidth: 0,
      }}
    >
      {/* Left: name+badge, hours */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, minWidth: 0, overflow: "hidden" }}>
          <span style={{ fontSize: 20, fontWeight: 600, color: "#111", letterSpacing: "-0.5px", lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>
            {place.name}
          </span>
          <span style={{
            fontSize: 12, fontWeight: 500, color: cat.text, background: cat.bg,
            borderRadius: 6, padding: "2px 12px", letterSpacing: "-0.3px", lineHeight: 1.3,
            marginBottom: 3, whiteSpace: "nowrap", flexShrink: 0,
          }}>
            {place.category}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 6, minWidth: 0 }}>
          <span style={{ fontSize: 12, color: "#767676", letterSpacing: "-0.3px", flexShrink: 0, lineHeight: 1.3 }}>🕐</span>
          <span style={{ fontSize: 12, color: "#767676", letterSpacing: "-0.3px", lineHeight: 1.3, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
            평일 {place.weekdayHours} / 주말 {place.weekendHours}
          </span>
        </div>
      </div>
      {/* Right: 더보기 vertically centered */}
      <div
        onClick={(e) => { e.stopPropagation(); onDetailClick(); }}
        style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", flexShrink: 0 }}
      >
        <span style={{ fontSize: 12, color: "#767676", fontWeight: 500, whiteSpace: "nowrap" }}>더보기</span>
        <div style={{ transform: "rotate(180deg)", width: 5, height: 10 }}>
          <img src={imgMoreChevron} alt="" style={{ width: "100%", height: "100%" }} />
        </div>
      </div>
    </div>
  );
}

function PlaceDetailCard({ place, onClose, onDetailClick, saved, onToggleSave }: { place: Place; onClose: () => void; onDetailClick: () => void; saved: boolean; onToggleSave: () => void }) {
  const cat = CATEGORY_COLORS[place.category] ?? { bg: "#f0f0f0", text: "#666" };
  return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 8px 4px 0", display: "flex", alignItems: "center" }}>
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M7 1L1 7L7 13" stroke="#767676" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button onClick={onDetailClick} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: 12, color: "#ffbf00", fontWeight: 600, letterSpacing: "-0.3px" }}>
          상세보기
        </button>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ width: 88, borderRadius: 10, overflow: "hidden", flexShrink: 0, alignSelf: "stretch" }}>
          <img src={place.imageUrl} alt={place.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
        <div style={{ flex: 1, minWidth: 0, overflow: "hidden", display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0, overflow: "hidden" }}>
            <span style={{ fontSize: 20, fontWeight: 600, color: "#111", letterSpacing: "-0.5px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>{place.name}</span>
            <span style={{ fontSize: 12, fontWeight: 500, color: cat.text, background: cat.bg, borderRadius: 6, padding: "2px 10px", marginBottom: 2, whiteSpace: "nowrap", flexShrink: 0 }}>
              {place.category}
            </span>
            <button onClick={onToggleSave} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", marginLeft: "auto", flexShrink: 0 }}>
              <svg width="13" height="16" viewBox="0 0 14 17" fill={saved ? "#ffbf00" : "none"}>
                <path d="M2 1.5h10v14L7 12 2 15.5V1.5Z" stroke={saved ? "#ffbf00" : "#ccc"} strokeWidth="1.4" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 6, minWidth: 0 }}>
            <span style={{ fontSize: 12, color: "#767676", flexShrink: 0, lineHeight: 1.4 }}>🕐</span>
            <span style={{ fontSize: 12, color: "#767676", letterSpacing: "-0.3px", lineHeight: 1.4, wordBreak: "keep-all" }}>
              평일 {place.weekdayHours} / 주말 {place.weekendHours}
            </span>
          </div>
          <div style={{ background: "#fff8e6", borderRadius: 9, padding: "8px 0", display: "flex", alignItems: "center", marginTop: "auto" }}>
            {[
              { icon: "🔈", label: "소음도", value: place.noiseLevel },
              { icon: "🏠", label: "규모", value: place.size },
              { icon: "✨", label: "집중도", value: place.cleanliness },
            ].map((item, i, arr) => (
              <div key={i} style={{ display: "flex", flex: 1, alignItems: "center" }}>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: "#bd9f47", display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
                    <span>{item.icon}</span><span style={{ fontWeight: 500 }}>{item.label}</span>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "#636363", marginTop: 2 }}>{item.value}</div>
                </div>
                {i < arr.length - 1 && <div style={{ width: 1, height: 28, background: "#e8d9a0" }} />}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ background: "#f8f8f8", borderRadius: 9, padding: "10px 12px", marginTop: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: "#111", letterSpacing: "-0.3px" }}>최근 방문자 기록</span>
          <span style={{ fontSize: 12, color: "#767676", letterSpacing: "-0.3px" }}>2시간 전</span>
        </div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {place.visitTags.map((tag, i) => (
            <span key={i} style={{ background: "#ffe38e", borderRadius: 20, padding: "6px 20px", fontSize: 13, fontWeight: 500, color: "#525252", letterSpacing: "-0.26px" }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MapPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [allPlaces, setAllPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [bookmarkEntries, setBookmarkEntries] = useState<BookmarkEntry[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("전체 보물함");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Place[] | null>(null);
  const [sheetTop, setSheetTop] = useState(() =>
    searchParams.get("selected") ? SHEET_DEFAULT : SHEET_DEFAULT
  );
  const [isSnapping, setIsSnapping] = useState(false);
  const [recommendedIds, setRecommendedIds] = useState<number[] | null>(null);
  const [savedRecommendedIds, setSavedRecommendedIds] = useState<number[] | null>(null);
  const [userLocation, setUserLocation] = useState<GeoPoint | undefined>(undefined);
  const [centerTrigger, setCenterTrigger] = useState(0);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("spotyu_recommended_ids");
      if (raw) {
        const ids = JSON.parse(raw);
        setRecommendedIds(ids);
        setSavedRecommendedIds(ids);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setUserLocation(FALLBACK_LOCATION);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setUserLocation(FALLBACK_LOCATION),
      { timeout: 5000 }
    );
  }, []);

  const dragRef = useRef({ active: false, startY: 0, startTop: SHEET_DEFAULT, lastTop: SHEET_DEFAULT });

  // 백엔드에서 전체 장소 목록을 받아온다
  useEffect(() => {
    getPlaces()
      .then((data) => {
        setAllPlaces(data);
        const id = searchParams.get("selected");
        if (id) {
          const found = data.find((p) => String(p.id) === id);
          if (found) setSelectedPlace(found);
        }
      })
      .catch((err) => console.error("장소 목록 로딩 실패:", err));
    getBookmarks().then(({ entries }) => setBookmarkEntries(entries)).catch(() => {});
  }, [searchParams]);

  useEffect(() => {
    function onMove(e: MouseEvent | TouchEvent) {
      if (!dragRef.current.active) return;
      const y = "touches" in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
      const newTop = Math.max(SHEET_EXPANDED, Math.min(SHEET_COLLAPSED, dragRef.current.startTop + (y - dragRef.current.startY)));
      dragRef.current.lastTop = newTop;
      setSheetTop(newTop);
    }
    function onEnd() {
      if (!dragRef.current.active) return;
      dragRef.current.active = false;
      setIsSnapping(true);
      const cur = dragRef.current.lastTop;
      const snapped = [SHEET_EXPANDED, SHEET_DEFAULT, SHEET_COLLAPSED].reduce((a, b) =>
        Math.abs(b - cur) < Math.abs(a - cur) ? b : a
      );
      setSheetTop(snapped);
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchend", onEnd);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchend", onEnd);
    };
  }, []);

  function onHandleDragStart(e: React.MouseEvent | React.TouchEvent) {
    const y = "touches" in e ? e.touches[0].clientY : e.clientY;
    dragRef.current = { active: true, startY: y, startTop: sheetTop, lastTop: sheetTop };
    setIsSnapping(false);
    e.preventDefault();
  }

  // 검색어 디바운스 → 백엔드 검색 API
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) { setSearchResults(null); return; }
    const timer = setTimeout(() => {
      searchPlaces(q).then(setSearchResults).catch(() => setSearchResults(null));
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredPlaces = (() => {
    if (searchResults !== null) return searchResults;
    let base = allPlaces;
    if (recommendedIds !== null && recommendedIds.length > 0)
      base = base.filter((p) => recommendedIds.includes(p.id));
    if (selectedFilter !== "전체 보물함")
      base = base.filter((p) => p.treasureType === selectedFilter);
    return base;
  })();

  function dismissRecommendation() {
    setRecommendedIds(null);
  }

  function restoreRecommendation() {
    if (savedRecommendedIds) setRecommendedIds(savedRecommendedIds);
  }

  const sheetZIndex = sheetTop < 200 ? 22 : 15;


  return (
    <div className="pf-outer">
      <div className="pf-sizing">
        <div className="pf-frame" style={{ width: "100%", height: "100%", border: "2px solid #111", borderRadius: 25, overflow: "hidden", position: "relative", background: "#fff" }}>

          {/* Map background — 카카오 지도로 교체 */}
          <div
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          >
            <KakaoMapView
              places={filteredPlaces}
              selectedPlace={selectedPlace}
              onSelectPlace={(place) => {
                setSelectedPlace(place);
                setIsFilterOpen(false);
                setIsSnapping(true);
                setSheetTop(SHEET_DEFAULT);
              }}
              userLocation={userLocation}
              sheetTop={sheetTop}
              centerTrigger={centerTrigger}
            />
          </div>

          {/* 현재위치 버튼 */}
          <button
            onClick={() => {
              if (!navigator.geolocation) return;
              navigator.geolocation.getCurrentPosition(
                (pos) => {
                  setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                  setCenterTrigger((t) => t + 1);
                },
                () => setCenterTrigger((t) => t + 1),
                { timeout: 5000 },
              );
            }}
            style={{
              position: "absolute", right: 16, top: Math.max(SHEET_DEFAULT - 60, sheetTop - 60), zIndex: sheetZIndex - 1,
              width: 44, height: 44, borderRadius: "50%",
              background: "#fff", border: "none", cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="4" fill="#ffbf00" />
              <circle cx="12" cy="12" r="8" stroke="#ffbf00" strokeWidth="1.5" fill="none" />
              <line x1="12" y1="2" x2="12" y2="5" stroke="#ffbf00" strokeWidth="2" strokeLinecap="round" />
              <line x1="12" y1="19" x2="12" y2="22" stroke="#ffbf00" strokeWidth="2" strokeLinecap="round" />
              <line x1="2" y1="12" x2="5" y2="12" stroke="#ffbf00" strokeWidth="2" strokeLinecap="round" />
              <line x1="19" y1="12" x2="22" y2="12" stroke="#ffbf00" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>


          {/* Header – SPOTYU + bell + person SVG icons */}
          <div style={{ position: "absolute", top: 20, left: 0, right: 0, height: 46, zIndex: 20, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", boxSizing: "border-box" }}>
            <p style={{ fontSize: 23, fontWeight: 900, color: "#ffbf00", letterSpacing: "-0.575px", lineHeight: 1.5, whiteSpace: "nowrap" }}>
              SPOTYU
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <IconPerson color="#000" />
              <IconBell color="#000" />
            </div>
          </div>

          {/* Search bar */}
          <div style={{ position: "absolute", top: 76, left: "50%", transform: "translateX(-50%)", width: 342, zIndex: 20 }}>
            <div style={{ background: "#fff", borderRadius: 100, boxShadow: "0px 2px 2px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", padding: "11px 16px", gap: 8 }}>
              <span style={{ fontSize: 17, color: "#767676" }}>🔍</span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="장소를 검색해보세요"
                style={{
                  flex: 1, border: "none", outline: "none", background: "transparent",
                  fontSize: 14, color: "#111", letterSpacing: "-0.08px",
                }}
              />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(""); setSearchResults(null); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#aaa", padding: 0 }}>✕</button>
              )}
            </div>
          </div>

          {/* Filter bar – 추천 (left=21) + 보물함 (left=calc(50%+75px)=270px) */}
          <div style={{ position: "absolute", top: 126, left: 0, right: 0, zIndex: 20 }}>
            <button
              onClick={() => recommendedIds !== null ? dismissRecommendation() : restoreRecommendation()}
              style={{
                position: "absolute", left: 21,
                background: recommendedIds !== null ? "#fff2cb" : "#fff",
                border: recommendedIds !== null ? "1px solid #ffbf00" : "none", borderRadius: 20,
                padding: "6px 20px", fontSize: 12, fontWeight: 500, color: "#525252",
                letterSpacing: "-0.3px", cursor: "pointer",
                boxShadow: "0px 2px 2px rgba(0,0,0,0.2)",
              }}
            >
              추천
            </button>

            <div style={{ position: "absolute", right: 24 }}>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                style={{
                  background: selectedFilter !== "전체 보물함" ? "#fff2cb" : "#fff",
                  border: selectedFilter !== "전체 보물함" ? "1px solid #ffbf00" : "none",
                  borderRadius: 20,
                  padding: "6px 20px", fontSize: 12, fontWeight: 500, color: "#767676",
                  letterSpacing: "-0.3px", cursor: "pointer",
                  boxShadow: "0px 2px 2px rgba(0,0,0,0.2)",
                  display: "flex", alignItems: "center", gap: 10,
                }}
              >
                <span>{selectedFilter}</span>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 10, height: 5 }}>
                  <div style={{ transform: "rotate(-90deg)", width: 5, height: 10 }}>
                    <img src={imgChevron} alt="" style={{ width: "100%", height: "100%" }} />
                  </div>
                </div>
              </button>

              {isFilterOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 4px)", right: 0, background: "#fff",
                  borderRadius: 12, boxShadow: "0px 4px 12px rgba(0,0,0,0.12)", overflow: "hidden",
                  minWidth: 120, zIndex: 30,
                }}>
                  {FILTER_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setSelectedFilter(opt); setIsFilterOpen(false); }}
                      style={{
                        display: "block", width: "100%", padding: "12px 20px", textAlign: "left",
                        background: opt === selectedFilter ? "#fff2cb" : "#fff",
                        border: "none", borderBottom: "1px solid #f0f0f0",
                        fontSize: 13, fontWeight: opt === selectedFilter ? 600 : 400,
                        color: "#111", cursor: "pointer", letterSpacing: "-0.3px",
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* AI 추천 배너 */}
          {recommendedIds !== null && (
            <div style={{
              position: "absolute", left: 16, right: 16,
              top: sheetTop - 48, zIndex: sheetZIndex + 1,
              background: "#ffbf00", borderRadius: 12,
              padding: "10px 16px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              boxShadow: "0px 2px 8px rgba(0,0,0,0.15)",
              transition: isSnapping ? "top 0.3s cubic-bezier(0.25,0.46,0.45,0.94)" : "none",
            }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>
                ✨ AI 추천 장소 {recommendedIds.length}곳
              </span>
              <button
                onClick={dismissRecommendation}
                style={{ background: "none", border: "none", fontSize: 12, color: "#555", cursor: "pointer", fontWeight: 500 }}
              >
                전체보기
              </button>
            </div>
          )}

          {/* Bottom sheet */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: sheetTop,
              bottom: 0,
              background: "#fff",
              borderRadius: "35px 35px 0 0",
              boxShadow: "0px -1px 6px rgba(0,0,0,0.06)",
              zIndex: sheetZIndex,
              transition: isSnapping ? "top 0.3s cubic-bezier(0.25,0.46,0.45,0.94)" : "none",
              display: "flex",
              flexDirection: "column",
            }}
            onTransitionEnd={() => setIsSnapping(false)}
          >
            {/* Drag handle */}
            <div
              onMouseDown={onHandleDragStart}
              onTouchStart={onHandleDragStart}
              style={{
                display: "flex",
                justifyContent: "center",
                paddingTop: 10,
                paddingBottom: 6,
                flexShrink: 0,
                cursor: "grab",
                userSelect: "none",
              }}
            >
              <div style={{ width: 40, height: 4, background: "#dbdbdb", borderRadius: 2 }} />
            </div>

            {/* Scrollable content */}
            <div style={{
              flex: 1,
              overflowY: "auto",
              padding: "0 16px",
              paddingBottom: 100,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}>
              {selectedPlace ? (
                <PlaceDetailCard
                  place={selectedPlace}
                  onClose={() => setSelectedPlace(null)}
                  onDetailClick={() => router.push(`/place/${selectedPlace.id}`)}
                  saved={bookmarkEntries.some(e => e.placeId === selectedPlace.id)}
                  onToggleSave={async () => {
                    const entry = bookmarkEntries.find(e => e.placeId === selectedPlace.id);
                    if (entry) {
                      await removeBookmark(entry.bookmarkId);
                      setBookmarkEntries(prev => prev.filter(e => e.bookmarkId !== entry.bookmarkId));
                    } else {
                      const newId = await addBookmark(selectedPlace.id);
                      if (newId !== null) setBookmarkEntries(prev => [...prev, { bookmarkId: newId, placeId: selectedPlace.id }]);
                    }
                  }}
                />
              ) : (
                filteredPlaces.map((place) => (
                  <PlaceCard key={place.id} place={place} onClick={() => setSelectedPlace(place)} onDetailClick={() => setSelectedPlace(place)} />
                ))
              )}
            </div>
          </div>

          {/* Solid white base behind nav – covers sheet content bleeding through */}
          <div style={{ position: "absolute", left: 0, bottom: -2, right: 0, height: 72, background: "#fff", zIndex: 24 }} />

          {/* Bottom navigation – top=745, height=63 */}
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 63, zIndex: 25 }}>
            {/* Wave background */}
            <div style={{ position: "absolute", left: -10, right: -10, top: -7, height: 70 }}>
              <img src={imgNavBg} alt="" style={{ width: "100%", height: "100%", display: "block" }} />
            </div>
            {/* Nav items – 4 equally spaced columns */}
            <div style={{
              position: "relative",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr",
              alignItems: "center",
              height: "100%",
              padding: "20px 0 0 0",
            }}>
              {NAV_ITEMS.map(({ label, Icon, active, href }) => (
                <button
                  key={label}
                  onClick={() => router.push(href)}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  <Icon color={active ? "#525252" : "#aeaeae"} />
                  <span style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: active ? "#525252" : "#aeaeae",
                    letterSpacing: "-0.35px",
                    lineHeight: 1.5,
                    marginTop: 1,
                  }}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
