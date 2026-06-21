import { Place, Category } from "../data/mockPlaces";

const BASE_URL = "/api/backend";
const DEFAULT_USER_ID = 1;

export interface BookmarkEntry {
  bookmarkId: number;
  placeId: number;
}

interface ApiBookmark {
  bookmarkId: number;
  placeId: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  category: string;
  theme: string;
  description: string;
  imageUrl: string;
  hasOutlet: boolean;
  noiseLevel: string;
  mood: string;
  operatingHours: string;
  hiddenSpot: boolean;
}

const CATEGORY_MAP: Record<string, Category> = {
  CAFE: "카페",
  LIBRARY: "도서관",
  STUDY_CAFE: "스터디카페",
};

const NOISE_MAP: Record<string, string> = {
  LOW: "조용함", MEDIUM: "보통", HIGH: "시끄러움",
};

const PIN_TYPES = ["yellow", "purple", "cyan", "lavender", "blue"] as const;

function apiToPlace(api: ApiBookmark): Place {
  return {
    id: api.placeId,
    name: api.name,
    category: CATEGORY_MAP[api.category] ?? "카페",
    weekdayHours: api.operatingHours,
    weekendHours: api.operatingHours,
    imageUrl: api.imageUrl || "/assets/ab9b57e850c9d68cef7849e730bf7a1716cd76f6.png",
    address: api.address,
    coordinates: { lat: api.latitude, lng: api.longitude },
    noiseLevel: NOISE_MAP[api.noiseLevel] ?? "보통",
    size: "보통",
    cleanliness: "보통",
    visitTags: api.mood ? [api.mood] : [],
    treasureType: api.hiddenSpot ? "비밀섬" : (api.theme as Place["treasureType"]) ?? null,
    pinType: PIN_TYPES[api.placeId % PIN_TYPES.length],
  };
}

export async function getBookmarks(): Promise<{ places: Place[]; entries: BookmarkEntry[] }> {
  try {
    const res = await fetch(`${BASE_URL}/SPOTYU/bookmarks/user/${DEFAULT_USER_ID}`);
    if (!res.ok) return { places: [], entries: [] };
    const json = await res.json();
    const arr: ApiBookmark[] = json?.data ?? (Array.isArray(json) ? json : []);
    return {
      places: arr.map(apiToPlace),
      entries: arr.map((b) => ({ bookmarkId: b.bookmarkId, placeId: b.placeId })),
    };
  } catch {
    return { places: [], entries: [] };
  }
}

export async function addBookmark(placeId: number): Promise<number | null> {
  try {
    const res = await fetch(`${BASE_URL}/SPOTYU/bookmarks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: DEFAULT_USER_ID, placeId }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    const data = json?.data ?? json;
    return data?.id ?? null;
  } catch {
    return null;
  }
}

export async function removeBookmark(bookmarkId: number): Promise<void> {
  try {
    await fetch(`${BASE_URL}/SPOTYU/bookmarks/${bookmarkId}`, { method: "DELETE" });
  } catch {
    // ignore
  }
}
