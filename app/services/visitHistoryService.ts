const BASE_URL = "/api/backend";
const DEFAULT_USER_ID = 1;

export interface VisitHistory {
  id: number;
  placeId: number;
  visitedAt: string;
  seatStatus: string;
  noiseStatus: string;
}

const SEAT_TO_API: Record<string, string> = {
  "넉넉": "MANY",
  "적당": "MODERATE",
  "혼잡": "FEW",
};

const NOISE_TO_API: Record<string, string> = {
  "조용": "VERY_QUIET",
  "보통": "MODERATE",
  "시끌": "LOUD",
};

const SEAT_FROM_API: Record<string, string> = {
  MANY: "넉넉",
  MODERATE: "적당",
  FEW: "혼잡",
};

const NOISE_FROM_API: Record<string, string> = {
  VERY_QUIET: "조용",
  QUIET: "조용",
  MODERATE: "보통",
  LOUD: "시끄러움",
  VERY_LOUD: "매우 시끄러움",
};

export async function saveVisitHistory(
  placeId: string,
  seats: string | null,
  noise: string | null,
  visitedAt: string,
): Promise<void> {
  const seatStatus = SEAT_TO_API[seats ?? ""] ?? "MODERATE";
  const noiseStatus = NOISE_TO_API[noise ?? ""] ?? "MODERATE";
  try {
    await fetch(`${BASE_URL}/SPOTYU/visit-histories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: DEFAULT_USER_ID,
        placeId: Number(placeId),
        visitedAt,
        seatStatus,
        noiseStatus,
      }),
    });
  } catch {
    // non-blocking
  }
}

export async function getVisitHistoriesByPlace(placeId: string): Promise<VisitHistory[]> {
  try {
    const res = await fetch(`${BASE_URL}/SPOTYU/visit-histories/place/${placeId}`);
    if (!res.ok) return [];
    const json = await res.json();
    const arr = json?.data ?? (Array.isArray(json) ? json : []);
    return arr.map((h: VisitHistory) => ({
      ...h,
      seatStatus: SEAT_FROM_API[h.seatStatus] ?? h.seatStatus,
      noiseStatus: NOISE_FROM_API[h.noiseStatus] ?? h.noiseStatus,
    }));
  } catch {
    return [];
  }
}
