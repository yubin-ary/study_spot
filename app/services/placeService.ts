import { Place, Category, TreasureType } from "../data/mockPlaces";

const BASE_URL = "http://15.164.231.65:8080";

interface ApiPlace {
  id: number;
  name: string;
  address: string;
  category: string;
  description: string;
  focusLevel: string;
  noiseLevel: string;
  sizeLevel: string;
  hasOutlet: boolean;
  hiddenSpot: boolean;
  imageUrl: string;
  latitude: number;
  longitude: number;
  mood: string;
  operatingHours: string;
  theme: string;
  averageRating: number;
  reviewCount: number;
}

const CATEGORY_MAP: Record<string, Category> = {
  CAFE: "카페",
  LIBRARY: "도서관",
  STUDY_CAFE: "스터디카페",
};

const NOISE_MAP: Record<string, string> = {
  LOW: "조용함",
  MEDIUM: "보통",
  HIGH: "시끄러움",
};

const SIZE_MAP: Record<string, string> = {
  SMALL: "작음",
  MEDIUM: "보통",
  LARGE: "큼",
};

const FOCUS_MAP: Record<string, string> = {
  LOW: "낮음",
  MEDIUM: "보통",
  HIGH: "좋음",
};

function resolveTreasureType(theme: string, hiddenSpot: boolean): TreasureType {
  if (hiddenSpot) return "비밀섬";
  if (theme === "현실도피섬" || theme === "가성비섬" || theme === "밤샘섬" || theme === "비밀섬") {
    return theme;
  }
  return null;
}

function splitHours(operatingHours: string): { weekday: string; weekend: string } {
  return { weekday: operatingHours, weekend: operatingHours };
}

const PIN_TYPES = ["yellow", "purple", "cyan", "lavender", "blue"] as const;

function toPlace(api: ApiPlace): Place {
  const hours = splitHours(api.operatingHours);
  return {
    id: api.id,
    name: api.name,
    category: CATEGORY_MAP[api.category] ?? "카페",
    weekdayHours: hours.weekday,
    weekendHours: hours.weekend,
    imageUrl: api.imageUrl && api.imageUrl.length > 0
      ? api.imageUrl
      : "/assets/ab9b57e850c9d68cef7849e730bf7a1716cd76f6.png",
    address: api.address,
    coordinates: { lat: api.latitude, lng: api.longitude },
    noiseLevel: NOISE_MAP[api.noiseLevel] ?? "보통",
    size: SIZE_MAP[api.sizeLevel] ?? "보통",
    cleanliness: FOCUS_MAP[api.focusLevel] ?? "보통",
    visitTags: api.mood ? [api.mood] : [],
    treasureType: resolveTreasureType(api.theme, api.hiddenSpot),
    pinType: PIN_TYPES[api.id % PIN_TYPES.length],
    hasOutlet: api.hasOutlet,
    description: api.description,
    islandTheme: api.theme,
  };
}

export async function getPlaces(): Promise<Place[]> {
  const res = await fetch(`${BASE_URL}/SPOTYU/places`);
  if (!res.ok) throw new Error(`장소 목록을 불러오지 못했어요 (${res.status})`);
  const json = await res.json();
  // 백엔드 응답이 { success, data: [...] } 형태이거나 그냥 배열인 경우 모두 대응
  const list: ApiPlace[] = Array.isArray(json) ? json : json.data;
  return list.map(toPlace);
}

export async function getPlace(placeId: number): Promise<Place> {
  const res = await fetch(`${BASE_URL}/SPOTYU/places/${placeId}`);
  if (!res.ok) throw new Error(`장소 정보를 불러오지 못했어요 (${res.status})`);
  const json = await res.json();
  const item: ApiPlace = json.data ?? json;
  return toPlace(item);
}

export async function getPlacesByTheme(theme: string): Promise<Place[]> {
  // 비밀섬은 theme 필드가 아닌 hiddenSpot:true 로 구분
  if (theme === "비밀섬") {
    const all = await getPlaces();
    return all.filter((p) => p.treasureType === "비밀섬");
  }
  const res = await fetch(`${BASE_URL}/SPOTYU/places/theme/${encodeURIComponent(theme)}`);
  if (!res.ok) throw new Error(`테마 장소를 불러오지 못했어요 (${res.status})`);
  const json = await res.json();
  const list: ApiPlace[] = Array.isArray(json) ? json : (json.data ?? []);
  return list.map(toPlace);
}

export async function searchPlaces(keyword: string): Promise<Place[]> {
  const res = await fetch(`${BASE_URL}/SPOTYU/places/search?keyword=${encodeURIComponent(keyword)}`);
  if (!res.ok) throw new Error(`검색에 실패했어요 (${res.status})`);
  const json = await res.json();
  const list: ApiPlace[] = Array.isArray(json) ? json : (json.data ?? []);
  return list.map(toPlace);
}