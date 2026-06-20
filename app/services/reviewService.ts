// 리뷰 서비스 레이어 — localStorage 기반 임시 구현
// TODO: API 연동 시 각 함수 내부만 교체 (인터페이스는 그대로 유지)

export interface Review {
  visitDate: string;
  visitTime: string;
  seats: string | null;
  noise: string | null;
  keywords: string[];
  submittedAt: string;
  // TODO: API 연동 후 추가될 필드
  // id?: string;
  // userId?: string;
  // placeId?: string;
}

const STORAGE_KEY = (placeId: string) => `spotyu_reviews_${placeId}`;

export async function getReviews(placeId: string): Promise<Review[]> {
  // TODO: return await fetch(`/api/places/${placeId}/reviews`).then(r => r.json());
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY(placeId)) ?? "[]");
  } catch {
    return [];
  }
}

export async function saveReview(placeId: string, review: Omit<Review, "submittedAt">): Promise<void> {
  // TODO: await fetch(`/api/places/${placeId}/reviews`, { method: "POST", body: JSON.stringify(review) });
  const full: Review = { ...review, submittedAt: new Date().toISOString() };
  const existing = await getReviews(placeId);
  localStorage.setItem(STORAGE_KEY(placeId), JSON.stringify([full, ...existing]));
}
