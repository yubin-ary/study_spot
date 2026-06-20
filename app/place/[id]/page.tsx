"use client";

import { useRouter } from "next/navigation";
import { use, useState, useEffect } from "react";
import mockPlaces, { Place } from "../../data/mockPlaces";
import { getReviews, type Review } from "../../services/reviewService";

// Assets
const imgStatusIcons = "/assets/b655a4944c744b18f533b9c4e87522b5f1e0f728.svg";
const imgNavBg       = "/assets/4870fdf34b871dd7cc5520f60aad475b01c76985.svg";
const imgChevronLeft = "/assets/c308fc232ec5e74ad2b99de339b0301252bc8d90.svg";
const imgMoreChevron = "/assets/a134d3c5a24645f38aaba0f39e0d113d5cd6a3b3.svg";
const imgEllipse55   = "/assets/4fa12631f27ca7d087de38c1353cb4f45f04be7d.svg";
const imgEllipse54   = "/assets/843fddce33436a5e7f0e81dd97a38b99e6cbe657.svg";
const imgStar        = "/assets/6b002d681a43effd22b7ceaee8f26d184116a58a.svg";
const imgLocationPin = "/assets/04925e2b9cabd995b868c2be638e78d83cedff47.svg";
const imgAvatar      = "/assets/a742214e3165460da177420dc16dcc4f6a8e8ed8.svg";

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  카페:       { bg: "#fff8e6", text: "#d29d00" },
  도서관:     { bg: "#e8f0fe", text: "#3b5bdb" },
  스터디카페: { bg: "#e6e9ff", text: "#2474ed" },
};

function IconBookmarkOutline({ color }: { color: string }) {
  return (
    <svg width="14" height="17" viewBox="0 0 14 17" fill="none">
      <path d="M2 1.5h10v14L7 12 2 15.5V1.5Z" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
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

function IconCompass({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8.5" stroke={color} strokeWidth="1.4" />
      <path d="M10 3.5L7.5 10L12.5 10Z" fill={color} />
      <path d="M10 16.5L7.5 10L12.5 10Z" stroke={color} strokeWidth="1.2" strokeLinejoin="round" fill="none" />
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

const NAV_ITEMS = [
  { label: "추천",  Icon: IconCompass,  href: "/status/purpose?from=nav" },
  { label: "지도",  Icon: IconMap,      href: "/map" },
  { label: "테마섬", Icon: IconIsland,  href: "/theme" },
  { label: "보물함", Icon: IconBookmarkOutline, href: "/bookmarks" },
];

const MOCK_REVIEWS = [
  { name: "솜사탕", date: "2026.04.28", tags: ["분위기 좋음", "여유좌석 적당", "소음 보통"] },
  { name: "솜사탕", date: "2026.04.28", tags: ["분위기 좋음", "여유좌석 적당", "소음 보통"] },
  { name: "솜사탕", date: "2026.04.28", tags: ["분위기 좋음", "여유좌석 적당", "소음 보통"] },
];

const SPOT_INFO = [
  { label: "콘센트", value: "있음", icon: "⚡" },
  { label: "가격대", value: "4,500~6,000", icon: "💰" },
  { label: "와이파이", value: "있음", icon: "📶" },
];

const TOP_TAGS = [["분위기 좋음", "화장실 깨끗함", "소음 보통"], ["가성비", "여유좌석 보통"]];

const STORAGE_KEY = "spotyu_saved_places";

function getSaved(): number[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"); } catch { return []; }
}

export default function PlaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const place: Place = mockPlaces.find((p) => String(p.id) === id) ?? mockPlaces[0];
  const cat = CATEGORY_COLORS[place.category] ?? { bg: "#f0f0f0", text: "#666" };
  const [saved, setSaved] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    setSaved(getSaved().includes(place.id));
    getReviews(String(place.id)).then(setReviews);
  }, [place.id]);

  function toggleSave() {
    const list = getSaved();
    const next = list.includes(place.id) ? list.filter((x) => x !== place.id) : [...list, place.id];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSaved(next.includes(place.id));
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#e5e5e5" }}>
      <div style={{ width: 390, height: 844, position: "relative" }}>
        <div style={{ width: "100%", height: "100%", border: "2px solid #111", borderRadius: 25, overflow: "hidden", position: "relative", background: "#fff" }}>

          {/* Scrollable content */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, overflowY: "auto", overflowX: "hidden" }}>
            <div style={{ paddingBottom: 200 }}>

              {/* Photo */}
              <div style={{ margin: "114px 24px 0", borderRadius: 10, overflow: "hidden", height: 221, position: "relative" }}>
                <img src={place.imageUrl} alt={place.name} style={{ width: "100%", height: "130%", objectFit: "cover", position: "absolute", top: "-30%" }} />
              </div>

              {/* Name + category */}
              <div style={{ margin: "16px 35px 0", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 24, fontWeight: 600, color: "#111", letterSpacing: "-0.6px", lineHeight: 1.5 }}>{place.name}</span>
                <span style={{ fontSize: 10, fontWeight: 500, color: cat.text, background: cat.bg, borderRadius: 6, padding: "2px 12px", letterSpacing: "-0.25px", lineHeight: 1.3, whiteSpace: "nowrap", flexShrink: 0 }}>
                  {place.category}
                </span>
              </div>

              {/* Address */}
              <div style={{ margin: "8px 35px 0", display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 10, height: 13, flexShrink: 0 }}>
                  <img src={imgLocationPin} alt="" style={{ width: "100%", height: "100%" }} />
                </div>
                <span style={{ fontSize: 10, color: "#767676", letterSpacing: "-0.25px", lineHeight: 1.3 }}>
                  {place.address}
                </span>
              </div>

              {/* Hours */}
              <div style={{ margin: "6px 35px 0", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 12, color: "#767676" }}>🕐</span>
                <span style={{ fontSize: 10, color: "#767676", letterSpacing: "-0.25px", lineHeight: 1.3 }}>
                  평일 {place.weekdayHours} / 주말 {place.weekendHours}
                </span>
              </div>

              {/* Info box */}
              <div style={{ margin: "16px 35px 0", background: "#fff8e6", borderRadius: 12, padding: "12px 0" }}>
                <div style={{ display: "flex", alignItems: "stretch" }}>
                  {[
                    { icon: "🔈", label: "소음도", value: place.noiseLevel },
                    { icon: "🏠", label: "규모",   value: place.size },
                    { icon: "✨", label: "집중도",  value: place.cleanliness },
                  ].map((item, i, arr) => (
                    <div key={i} style={{ flex: 1, display: "flex", alignItems: "center" }}>
                      <div style={{ flex: 1, textAlign: "center" }}>
                        <div style={{ fontSize: 9, color: "#bd9f47", display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
                          <span>{item.icon}</span>
                          <span style={{ fontWeight: 500, letterSpacing: "-0.3px" }}>{item.label}</span>
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 600, color: "#525252", marginTop: 4, letterSpacing: "-0.4px" }}>{item.value}</div>
                      </div>
                      {i < arr.length - 1 && (
                        <div style={{ width: 1, height: 54, background: "#e8d9a0" }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 스팟정보 section */}
              <div style={{ margin: "24px 28px 0" }}>
                <p style={{ fontSize: 16, fontWeight: 500, color: "#111", letterSpacing: "-0.4px", lineHeight: 1.5 }}>스팟정보</p>
                <div style={{ height: 1, background: "#e8e8e8", margin: "8px 0" }} />
                {SPOT_INFO.map((row, i) => (
                  <div key={i}>
                    <div style={{ display: "flex", alignItems: "center", padding: "10px 0", gap: 16 }}>
                      <div style={{ width: 60, display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                        <span style={{ fontSize: 12 }}>{row.icon}</span>
                        <span style={{ fontSize: 12, color: "#767676", letterSpacing: "-0.3px", whiteSpace: "nowrap" }}>{row.label}</span>
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 500, color: "#111", letterSpacing: "-0.35px" }}>{row.value}</span>
                    </div>
                    {i < SPOT_INFO.length - 1 && <div style={{ height: 1, background: "#e8e8e8" }} />}
                  </div>
                ))}
              </div>

              {/* 방문자태그 TOP5 */}
              <div style={{ margin: "24px 35px 0" }}>
                <p style={{ fontSize: 16, fontWeight: 500, color: "#111", letterSpacing: "-0.4px", lineHeight: 1.5, marginBottom: 12 }}>
                  👑 방문자태그 TOP5
                </p>
                {TOP_TAGS.map((row, ri) => (
                  <div key={ri} style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 4 }}>
                    {row.map((tag) => (
                      <span key={tag} style={{ background: "#ffe38e", borderRadius: 20, padding: "6px 20px", fontSize: 13, fontWeight: 500, color: "#525252", letterSpacing: "-0.26px", whiteSpace: "nowrap" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                ))}
              </div>

              {/* 최근 방문 후기 */}
              <div style={{ margin: "28px 0 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 35px", marginBottom: 12 }}>
                  <p style={{ fontSize: 14, fontWeight: 500, color: "#111", letterSpacing: "-0.35px", lineHeight: 1.5 }}>최근 방문 후기</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "#767676", letterSpacing: "-0.3px" }}>전체보기</span>
                    <div style={{ transform: "rotate(180deg)", width: 5, height: 10 }}>
                      <img src={imgMoreChevron} alt="" style={{ width: "100%", height: "100%" }} />
                    </div>
                  </div>
                </div>

                <div style={{ margin: "0 35px", background: "#f8f8f8", borderRadius: 10, padding: "16px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {reviews.length === 0 ? (
                      <p style={{ fontSize: 13, color: "#aeaeae", textAlign: "center", padding: "12px 0" }}>아직 후기가 없어요.</p>
                    ) : reviews.map((review, i) => {
                      const tags = [
                        ...(review.seats ? [`여유좌석 ${review.seats}`] : []),
                        ...(review.noise ? [`소음 ${review.noise}`] : []),
                        ...review.keywords,
                      ];
                      return (
                        <div key={i}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                            <div style={{ width: 32, height: 32, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
                              <img src={imgAvatar} alt="" style={{ width: "100%", height: "100%" }} />
                            </div>
                            <div>
                              <p style={{ fontSize: 12, color: "#767676", letterSpacing: "-0.3px", lineHeight: 1.5 }}>방문자</p>
                              <p style={{ fontSize: 12, color: "#aeaeae", letterSpacing: "-0.3px", lineHeight: 1.5 }}>{review.visitDate}</p>
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                            {tags.map((tag) => (
                              <span key={tag} style={{
                                background: "#fff2cb", border: "1px solid #ffbf00",
                                borderRadius: 20, padding: "6px 20px",
                                fontSize: 13, fontWeight: 500, color: "#525252", letterSpacing: "-0.26px", whiteSpace: "nowrap",
                              }}>
                                {tag}
                              </span>
                            ))}
                          </div>
                          {i < reviews.length - 1 && <div style={{ height: 1, background: "#e8e8e8", margin: "12px 0 0" }} />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Fixed: Status bar */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 43, zIndex: 30, background: "#fff", borderRadius: "25px 25px 0 0" }}>
            <div style={{ position: "absolute", right: 24, top: 16, width: 64, height: 11 }}>
              <img src={imgStatusIcons} alt="" style={{ width: "100%", height: "100%" }} />
            </div>
            <p style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", top: 12, fontSize: 15, fontWeight: 600, color: "#111", letterSpacing: "-0.5px" }}>9:41</p>
          </div>

          {/* Fixed: Header */}
          <div style={{ position: "absolute", top: 43, left: 0, right: 0, height: 56, zIndex: 30, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <button
              onClick={() => window.history.length > 1 ? router.back() : router.push('/map')}
              style={{ position: "absolute", left: 20, background: "none", border: "none", padding: 0, cursor: "pointer", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <img src={imgChevronLeft} alt="back" style={{ width: "100%", height: "100%" }} />
            </button>
            <span style={{ fontSize: 20, fontWeight: 600, color: "#111", letterSpacing: "-0.5px" }}>장소상세</span>
            <button
              onClick={toggleSave}
              style={{
                position: "absolute", right: 24, width: 24, height: 24,
                background: saved ? "#ffbf00" : "#aeaeae",
                borderRadius: "50%", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.2s",
              }}
            >
              <svg width="14" height="17" viewBox="0 0 14 17" fill="none">
                <path
                  d="M2 1.5h10v14L7 12 2 15.5V1.5Z"
                  stroke="#fff" strokeWidth="1.4" strokeLinejoin="round"
                  fill={saved ? "#fff" : "none"}
                />
              </svg>
            </button>
          </div>

          {/* Fixed: Bottom CTA + Nav */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 30 }}>
            {/* CTA button */}
            <div style={{ padding: "12px 24px 0" }}>
              <button
                onClick={() => router.push(`/place/${place.id}/review`)}
                style={{
                  width: "100%", height: 60, background: "#ffbf00", borderRadius: 10,
                  border: "none", fontSize: 16, fontWeight: 600, color: "#111",
                  letterSpacing: "-0.4px", cursor: "pointer",
                }}
              >
                방문기록 작성하기
              </button>
            </div>

            {/* Nav bar – 지도 페이지와 동일한 스타일 */}
            <div style={{ position: "relative", height: 63 }}>
              <div style={{ position: "absolute", left: -2, right: -2, top: -7, height: 70 }}>
                <img src={imgNavBg} alt="" style={{ width: "100%", height: "100%", display: "block" }} />
              </div>
              <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", alignItems: "center", height: "100%", padding: "4px 0 0 0" }}>
                {NAV_ITEMS.map(({ label, Icon, href }) => (
                  <button key={label} onClick={() => router.push(href)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    <Icon color="#aeaeae" />
                    <span style={{ fontSize: 14, fontWeight: 500, color: "#aeaeae", letterSpacing: "-0.35px", lineHeight: 1.5, marginTop: 1 }}>{label}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          <div style={{ height: 34, borderRadius: "0 0 25px 25px" }} />
        </div>
      </div>
    </div>
  );
}
