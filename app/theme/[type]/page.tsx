"use client";

import { useRouter, useParams } from "next/navigation";
import mockPlaces, { Place } from "../../data/mockPlaces";

const imgStatusIcons = "/assets/b655a4944c744b18f533b9c4e87522b5f1e0f728.svg";

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  카페: { bg: "#fff8e6", text: "#d29d00" },
  도서관: { bg: "#e8f0fe", text: "#3b5bdb" },
  스터디카페: { bg: "#e6e9ff", text: "#2474ed" },
};

function PlaceListCard({ place, onClick }: { place: Place; onClick: () => void }) {
  const cat = CATEGORY_COLORS[place.category] ?? { bg: "#f0f0f0", text: "#666" };
  return (
    <div
      onClick={onClick}
      style={{
        width: "100%",
        background: "#fffdf7",
        border: "1px solid #f2ead4",
        borderRadius: 14,
        padding: 14,
        boxSizing: "border-box",
        cursor: "pointer",
        position: "relative",
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
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", letterSpacing: "-0.3px" }}>{place.name}</span>
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

export default function ThemeListPage() {
  const router = useRouter();
  const params = useParams();

  const islandType = decodeURIComponent((params.type as string) ?? "");

  const places = mockPlaces.filter((p) => p.treasureType === islandType);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div style={{ width: 390, height: 844, position: "relative" }}>
        <div
          className="border-2 border-[#111] border-solid overflow-clip relative rounded-[25px]"
          style={{ width: "100%", height: "100%", background: "#fefdfb" }}
        >
          <div className="absolute overflow-clip" style={{ top: 0, left: "50%", transform: "translateX(-50%)", width: 388, height: 43 }}>
            <div className="absolute" style={{ right: 24, top: 16.33, width: 64.341, height: 11.337 }}>
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgStatusIcons} />
            </div>
            <p className="absolute text-center" style={{ left: "50%", transform: "translateX(-50%)", top: 12, fontSize: 15, fontWeight: 600, lineHeight: "20px", letterSpacing: "-0.5px", color: "#111" }}>
              9:41
            </p>
          </div>

          <div className="absolute" style={{ top: 50, left: 0, width: "100%", height: 50, display: "flex", alignItems: "center" }}>
            <button
              onClick={() => router.back()}
              style={{ position: "absolute", left: 18, background: "none", border: "none", cursor: "pointer", fontSize: 22, color: "#111", padding: 4 }}
            >
              ‹
            </button>
            <p style={{ width: "100%", textAlign: "center", fontSize: 18, fontWeight: 700, color: "#1a1a1a", letterSpacing: "-0.4px" }}>
              {islandType}
            </p>
          </div>

          <div
            className="absolute"
            style={{
              top: 110, left: 0, right: 0, bottom: 0,
              overflowY: "auto",
              padding: "8px 18px 100px",
              display: "flex", flexDirection: "column", gap: 14,
            }}
          >
            {places.length === 0 ? (
              <p style={{ textAlign: "center", color: "#9a9a9a", fontSize: 14, marginTop: 40 }}>
                아직 등록된 장소가 없어요.
              </p>
            ) : (
              places.map((place) => (
                <PlaceListCard
                  key={place.id}
                  place={place}
                  onClick={() => router.push(`/place/${place.id}`)}
                />
              ))
            )}
          </div>

          <button
            onClick={() => alert("제보 기능은 준비 중이에요!")}
            className="absolute"
            style={{
              right: 20, bottom: 28,
              width: 60, height: 60, borderRadius: 30,
              background: "#ffa726", border: "none", cursor: "pointer",
              boxShadow: "0px 4px 12px rgba(255,167,38,0.45)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              color: "#fff",
            }}
          >
            <span style={{ fontSize: 20, lineHeight: 1, marginBottom: 2 }}>＋</span>
            <span style={{ fontSize: 11, fontWeight: 700 }}>제보</span>
          </button>
        </div>
      </div>
    </div>
  );
}