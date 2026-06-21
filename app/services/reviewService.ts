const BASE_URL = "http://15.164.231.65:8080";
const DEFAULT_USER_ID = 1;

export interface Review {
  id?: number;
  visitDate: string;
  visitTime: string;
  seats: string | null;
  noise: string | null;
  keywords: string[];
  submittedAt: string;
}

interface ApiReview {
  id: number;
  placeId: number;
  userId: number;
  rating: number;
  noiseLevel: string;
  content: string;
}

const NOISE_TO_API: Record<string, string> = {
  "시끌": "HIGH",
  "보통": "MEDIUM",
  "조용": "LOW",
};

const NOISE_FROM_API: Record<string, string> = {
  HIGH: "시끌",
  MEDIUM: "보통",
  LOW: "조용",
};

function apiToReview(api: ApiReview): Review {
  let parsed: Partial<Review> = {};
  try { parsed = JSON.parse(api.content); } catch { /* plain text content */ }
  return {
    id: api.id,
    visitDate: parsed.visitDate ?? "",
    visitTime: parsed.visitTime ?? "",
    seats: parsed.seats ?? null,
    noise: NOISE_FROM_API[api.noiseLevel] ?? null,
    keywords: parsed.keywords ?? [],
    submittedAt: String(api.id ?? ""),
  };
}

export async function getReviews(placeId: string): Promise<Review[]> {
  try {
    const res = await fetch(`${BASE_URL}/SPOTYU/reviews/place/${placeId}`);
    if (!res.ok) return [];
    const json = await res.json();
    const arr: ApiReview[] = json?.data ?? (Array.isArray(json) ? json : []);
    return arr.map(apiToReview);
  } catch {
    return [];
  }
}

export async function saveReview(
  placeId: string,
  review: Omit<Review, "submittedAt">
): Promise<void> {
  const noiseLevel = NOISE_TO_API[review.noise ?? ""] ?? "MEDIUM";
  const content = JSON.stringify({
    visitDate: review.visitDate,
    visitTime: review.visitTime,
    seats: review.seats,
    keywords: review.keywords,
  });

  const res = await fetch(`${BASE_URL}/SPOTYU/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      placeId: Number(placeId),
      userId: DEFAULT_USER_ID,
      rating: 5,
      noiseLevel,
      content,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`리뷰 저장 실패: ${err}`);
  }
}
