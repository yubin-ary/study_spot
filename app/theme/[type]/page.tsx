"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Place } from "../../data/mockPlaces";
import { getPlaces } from "../../services/placeService";
import { getBookmarks, addBookmark, removeBookmark, BookmarkEntry } from "../../services/bookmarkService";

const imgBackArrow   = "/assets/45d8a0f6495680e676880af5da9c876d1c9d332b.svg";
const imgChevronRight = "/assets/d87c43c80e992a0641ded1887d61e2df8dcd2d62.svg";

function SaveButton({ placeId, entries, onToggle }: {
  placeId: number;
  entries: BookmarkEntry[];
  onToggle: (entries: BookmarkEntry[]) => void;
}) {
  const entry = entries.find((e) => e.placeId === placeId);
  const isSaved = !!entry;
  const handleClick = async (ev: React.MouseEvent) => {
    ev.stopPropagation();
    if (isSaved && entry) {
      await removeBookmark(entry.bookmarkId);
      onToggle(entries.filter((e) => e.placeId !== placeId));
    } else {
      const newId = await addBookmark(placeId);
      if (newId !== null) onToggle([...entries, { bookmarkId: newId, placeId }]);
    }
  };
  return (
    <button
      onClick={handleClick}
      style={{
        position: "absolute", top: -12, right: -12, width: 24, height: 24,
        background: isSaved ? "#ffbf00" : "#aeaeae",
        borderRadius: "50%", border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0px 0px 2px rgba(0,0,0,0.12)",
        transition: "background 0.2s",
        zIndex: 2,
      }}
    >
      <svg width="10" height="13" viewBox="0 0 14 17" fill="none">
        <path
          d="M2 1.5h10v14L7 12 2 15.5V1.5Z"
          stroke="#fff" strokeWidth="1.6" strokeLinejoin="round"
          fill={isSaved ? "#fff" : "none"}
        />
      </svg>
    </button>
  );
}

function PlaceCard({ place, entries, onToggleSave, onClick }: {
  place: Place;
  entries: BookmarkEntry[];
  onToggleSave: (next: BookmarkEntry[]) => void;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        position: "relative", width: "100%", height: 158, flexShrink: 0,
        background: "#fff", border: "1px solid #ffe38e", borderRadius: 10,
        boxSizing: "border-box", cursor: "pointer", overflow: "visible",
      }}
    >
      {/* Save button */}
      <SaveButton placeId={place.id} entries={entries} onToggle={onToggleSave} />

      {/* 더보기 */}
      <div style={{ position: "absolute", top: 16, right: 8, display: "flex", alignItems: "center", gap: 3 }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: "#525252", letterSpacing: "-0.3px" }}>더보기</span>
        <div style={{ transform: "rotate(180deg)", width: 5, height: 10 }}>
          <img src={imgChevronRight} alt="" style={{ width: "100%", height: "100%" }} />
        </div>
      </div>

      {/* Left image */}
      <div style={{ position: "absolute", left: 16, top: 16, width: 58, height: 126, borderRadius: 5, overflow: "hidden", background: "#eee" }}>
        <img src={place.imageUrl} alt={place.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {/* Place name */}
      <div style={{ position: "absolute", left: 89, top: 26, right: 40 }}>
        <p style={{ fontSize: 16, fontWeight: 600, color: "#111", letterSpacing: "-0.4px", lineHeight: 1.5, margin: 0 }}>
          {place.name}
        </p>
      </div>

      {/* Hours */}
      <div style={{ position: "absolute", left: 89, top: 50, right: 16, display: "flex", alignItems: "flex-start", gap: 6 }}>
        <span style={{ fontSize: 12, color: "#767676", flexShrink: 0 }}>🕐</span>
        <span style={{ fontSize: 12, color: "#767676", letterSpacing: "-0.3px", lineHeight: 1.3, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          평일 {place.weekdayHours} / 주말 {place.weekendHours}
        </span>
      </div>

      {/* Info box */}
      <div style={{
        position: "absolute", left: 89, right: 21, top: 86,
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

export default function IslandPage({ params }: { params: Promise<{ type: string }> }) {
  const router = useRouter();
  const { type } = use(params);
  const islandName = decodeURIComponent(type);
  const [places, setPlaces] = useState<Place[]>([]);
  const [bookmarkEntries, setBookmarkEntries] = useState<BookmarkEntry[]>([]);

  useEffect(() => {
    getPlaces()
      .then((all) => all.filter((p) =>
        islandName === "비밀섬" ? p.treasureType === "비밀섬" : p.islandTheme === islandName
      ))
      .then(setPlaces)
      .catch((err) => console.error("테마 장소 로딩 실패:", err));
  }, [islandName]);

  useEffect(() => {
    getBookmarks().then(({ entries }) => setBookmarkEntries(entries));
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f3f4f6" }}>
      <div style={{ width: 390, height: 844, position: "relative" }}>
        <div style={{
          width: "100%", height: "100%",
          border: "2px solid #111", borderRadius: 25, overflow: "hidden",
          position: "relative", background: "#f8f8f8",
        }}>


          {/* Header */}
          <div style={{ position: "absolute", top: 43, left: 0, right: 0, height: 56, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <button
              onClick={() => router.back()}
              style={{ position: "absolute", left: 20, background: "none", border: "none", cursor: "pointer", padding: 0, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <img src={imgBackArrow} alt="back" style={{ width: "100%", height: "100%" }} />
            </button>
            <span style={{ fontSize: 22, fontWeight: 500, color: "#111", letterSpacing: "-0.55px" }}>{islandName}</span>
          </div>

          {/* Place list */}
          <div style={{
            position: "absolute", top: 99, left: 0, right: 0, bottom: 0,
            overflowY: "auto", padding: "24px 23px 40px",
            display: "flex", flexDirection: "column", gap: 16,
          }}>
            {places.length === 0 ? (
              <p style={{ textAlign: "center", color: "#9a9a9a", fontSize: 14, marginTop: 40 }}>
                아직 장소가 없어요.
              </p>
            ) : (
              places.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  entries={bookmarkEntries}
                  onToggleSave={setBookmarkEntries}
                  onClick={() => router.push(`/place/${place.id}`)}
                />
              ))
            )}
          </div>

          {/* 제보 FAB */}
          <button
            style={{
              position: "absolute", right: 20, bottom: 30, width: 68, height: 68,
              borderRadius: "50%", border: "none", cursor: "pointer",
              background: "linear-gradient(-48.54deg, #ffbf00 5.17%, #fe7023 118.47%)",
              boxShadow: "0px 4px 12px rgba(254,112,35,0.4)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 0,
              zIndex: 10,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" fill="none" />
              <line x1="12" y1="7" x2="12" y2="13" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="9" y1="10" x2="15" y2="10" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span style={{ fontSize: 14, fontWeight: 500, color: "#fff", letterSpacing: "-0.35px", marginTop: 2 }}>제보</span>
          </button>

          {/* Home indicator */}
        </div>
      </div>
    </div>
  );
}
