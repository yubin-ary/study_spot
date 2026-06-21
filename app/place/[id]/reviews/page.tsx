"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getReviews, type Review } from "../../../services/reviewService";

const imgBackArrow = "/assets/45d8a0f6495680e676880af5da9c876d1c9d332b.svg";

export default function ReviewsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReviews(id).then((data) => {
      setReviews(data);
      setLoading(false);
    });
  }, [id]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f3f4f6" }}>
      <div style={{ width: 390, height: 844, position: "relative" }}>
        <div style={{ width: "100%", height: "100%", border: "2px solid #111", borderRadius: 25, overflow: "hidden", position: "relative", background: "#fff" }}>

          {/* Header */}
          <div style={{ position: "absolute", top: 43, left: 0, right: 0, height: 56, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <button
              onClick={() => router.back()}
              style={{ position: "absolute", left: 20, background: "none", border: "none", cursor: "pointer", padding: 0, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <img src={imgBackArrow} alt="back" style={{ width: "100%", height: "100%" }} />
            </button>
            <span style={{ fontSize: 18, fontWeight: 600, color: "#111", letterSpacing: "-0.45px" }}>방문 후기</span>
          </div>

          {/* Review list */}
          <div style={{ position: "absolute", top: 99, left: 0, right: 0, bottom: 0, overflowY: "auto", padding: "16px 24px 40px" }}>
            {loading ? (
              <p style={{ textAlign: "center", color: "#aeaeae", fontSize: 14, marginTop: 40 }}>불러오는 중...</p>
            ) : reviews.length === 0 ? (
              <p style={{ textAlign: "center", color: "#aeaeae", fontSize: 14, marginTop: 40 }}>아직 후기가 없어요.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {reviews.map((review, i) => {
                  const tags = [
                    ...(review.seats ? [`여유좌석 ${review.seats}`] : []),
                    ...(review.noise ? [`소음 ${review.noise}`] : []),
                    ...review.keywords,
                  ];
                  return (
                    <div key={review.id ?? i}>
                      <div style={{ padding: "16px 0" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#e0e0e0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ fontSize: 16 }}>👤</span>
                          </div>
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 600, color: "#111", margin: 0, lineHeight: 1.4 }}>방문자</p>
                            <p style={{ fontSize: 12, color: "#aeaeae", margin: 0, lineHeight: 1.4 }}>{review.visitDate}</p>
                          </div>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {tags.map((tag, j) => (
                            <span key={j} style={{ background: "#fff8e6", border: "1px solid #ffe38e", borderRadius: 20, padding: "4px 10px", fontSize: 12, color: "#636363", letterSpacing: "-0.3px" }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      {i < reviews.length - 1 && <div style={{ height: 1, background: "#e8e8e8" }} />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
