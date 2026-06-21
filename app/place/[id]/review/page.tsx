"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { getReviews, saveReview } from "../../../services/reviewService";
import { saveVisitHistory } from "../../../services/visitHistoryService";

const imgChevronLeft  = "/assets/c308fc232ec5e74ad2b99de339b0301252bc8d90.svg";

const KEYWORDS = ["콘센트 많음", "집중 잘됨", "가성비", "팀플가능", "분위기 좋음"];
const SEATS    = ["넉넉", "적당", "혼잡"];
const NOISES   = ["시끌", "보통", "조용"];
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function formatKoreanDate(y: number, m: number, d: number) {
  return `${y}년 ${String(m).padStart(2, "0")}월 ${String(d).padStart(2, "0")}일`;
}

function CalendarPicker({ year, month, selectedDay, onSelect, onClose }: {
  year: number; month: number; selectedDay: number;
  onSelect: (y: number, m: number, d: number) => void;
  onClose: () => void;
}) {
  const [viewYear, setViewYear]   = useState(year);
  const [viewMonth, setViewMonth] = useState(month);

  const firstDay    = new Date(viewYear, viewMonth - 1, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();

  function prevMonth() {
    if (viewMonth === 1) { setViewYear(y => y - 1); setViewMonth(12); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 12) { setViewYear(y => y + 1); setViewMonth(1); }
    else setViewMonth(m => m + 1);
  }

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div
      style={{
        position: "absolute", left: "50%", transform: "translateX(-50%)",
        top: 270, width: 330, zIndex: 50,
        background: "#fff", border: "1px solid #d9d9d9", borderRadius: 16,
        boxShadow: "0 2px 12px rgba(0,0,0,0.12)", padding: 16,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <button onClick={prevMonth} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#525252", padding: "0 6px" }}>‹</button>
        <span style={{ fontSize: 16, fontWeight: 600, color: "#111", letterSpacing: "-0.4px" }}>
          {viewYear}년 {String(viewMonth).padStart(2, "0")}월
        </span>
        <button onClick={nextMonth} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#525252", padding: "0 6px" }}>›</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 4 }}>
        {WEEKDAYS.map((w, i) => (
          <div key={w} style={{ textAlign: "center", fontSize: 11, fontWeight: 500, padding: "4px 0",
            color: i === 0 ? "#e06060" : i === 6 ? "#4a7be0" : "#aeaeae" }}>{w}</div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px 0" }}>
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const isSelected = day === selectedDay && viewMonth === month && viewYear === year;
          return (
            <div key={i} onClick={() => { onSelect(viewYear, viewMonth, day); onClose(); }}
              style={{
                textAlign: "center", padding: "6px 0", fontSize: 14, cursor: "pointer", borderRadius: 8,
                background: isSelected ? "#ffbf00" : "none",
                color: isSelected ? "#fff" : i % 7 === 0 ? "#e06060" : i % 7 === 6 ? "#4a7be0" : "#111",
                fontWeight: isSelected ? 700 : 400,
              }}>
              {day}
            </div>
          );
        })}
      </div>

      <button onClick={onClose}
        style={{ marginTop: 12, width: "100%", height: 36, background: "#f2f2f2", border: "none", borderRadius: 8, fontSize: 14, color: "#525252", cursor: "pointer" }}>
        닫기
      </button>
    </div>
  );
}

export default function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const today = new Date();
  const [selYear,  setSelYear]  = useState(today.getFullYear());
  const [selMonth, setSelMonth] = useState(today.getMonth() + 1);
  const [selDay,   setSelDay]   = useState(today.getDate());
  const [visitTime,    setVisitTime]    = useState("11:00");
  const [showCalendar, setShowCalendar] = useState(false);
  const [editingTime,  setEditingTime]  = useState(false);
  const [seats,    setSeats]    = useState<string | null>(null);
  const [noise,    setNoise]    = useState<string | null>(null);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const visitDate = formatKoreanDate(selYear, selMonth, selDay);

  function toggleKeyword(kw: string) {
    setKeywords(prev => prev.includes(kw) ? prev.filter(k => k !== kw) : [...prev, kw]);
  }

  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);
    try {
      await saveReview(id, { visitDate, visitTime, seats, noise, keywords });
      const isoDate = new Date().toISOString();
      await saveVisitHistory(id, seats, noise, isoDate);
      // router.back()이 히스토리 없을 때 실패할 수 있으므로 명시적 경로 이동
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push(`/place/${id}`);
      }
    } catch (e) {
      console.error("리뷰 저장 실패", e);
      setSubmitting(false);
    }
  }

  function chip(selected: boolean) {
    return {
      height: 39, display: "flex", alignItems: "center", justifyContent: "center",
      padding: "0 24px", borderRadius: 20, cursor: "pointer",
      background: selected ? "#ffe38e" : "#ececec",
      border: selected ? "1px solid #ffbf00" : "1px solid transparent",
      fontSize: 16, fontWeight: 500, color: "#525252" as const,
      letterSpacing: "-0.32px", whiteSpace: "nowrap" as const, flexShrink: 0,
      boxSizing: "border-box" as const,
    };
  }

  const overlayOpen = showCalendar || editingTime;

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#e5e5e5" }}>
      <div style={{ width: 390, height: 844, position: "relative" }}>
        <div style={{ width: "100%", height: "100%", border: "2px solid #111", borderRadius: 25, overflow: "hidden", position: "relative", background: "#fff" }}>

          {/* Overlay backdrop */}
          {overlayOpen && (
            <div onClick={() => { setShowCalendar(false); setEditingTime(false); }}
              style={{ position: "absolute", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.2)" }} />
          )}

          {/* Calendar overlay */}
          {showCalendar && (
            <CalendarPicker
              year={selYear} month={selMonth} selectedDay={selDay}
              onSelect={(y, m, d) => { setSelYear(y); setSelMonth(m); setSelDay(d); }}
              onClose={() => setShowCalendar(false)}
            />
          )}

          {/* Time input overlay */}
          {editingTime && (
            <div style={{
              position: "absolute", left: "50%", transform: "translateX(-50%)",
              top: 270, width: 220, zIndex: 50,
              background: "#fff", border: "1px solid #d9d9d9", borderRadius: 16,
              boxShadow: "0 2px 12px rgba(0,0,0,0.12)", padding: 20,
            }} onClick={(e) => e.stopPropagation()}>
              <p style={{ fontSize: 13, color: "#aeaeae", marginBottom: 10, letterSpacing: "-0.3px" }}>시간 직접 입력 (예: 14:30)</p>
              <input
                type="text"
                value={visitTime}
                onChange={(e) => setVisitTime(e.target.value)}
                placeholder="00:00"
                autoFocus
                style={{
                  width: "100%", height: 48, border: "1px solid #ffbf00", borderRadius: 10,
                  fontSize: 22, fontWeight: 700, color: "#111", textAlign: "center",
                  background: "#fff8e6", outline: "none", boxSizing: "border-box",
                  letterSpacing: "2px",
                }}
              />
              <button onClick={() => setEditingTime(false)}
                style={{ marginTop: 12, width: "100%", height: 36, background: "#ffbf00", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, color: "#111", cursor: "pointer" }}>
                확인
              </button>
            </div>
          )}

          {/* Scrollable content — bottom: 110 to avoid overlapping the fixed button */}
          <div style={{ position: "absolute", top: 99, left: 0, right: 0, bottom: 110, overflowY: "auto" }}>
            <div style={{ padding: "14px 0 24px" }}>
              <p style={{ fontSize: 26, fontWeight: 600, color: "#111", letterSpacing: "-0.65px", lineHeight: 1.5, margin: "0 0 0 25px" }}>
                방문한 스팟은<br />어땠나요?
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 42, margin: "26px 30px 0" }}>
                {/* 언제 방문하셨나요? */}
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  <p style={{ fontSize: 20, fontWeight: 600, color: "#525252", letterSpacing: "-0.4px", lineHeight: 1.5, margin: 0 }}>언제 방문하셨나요?</p>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <div onClick={() => { setShowCalendar(true); setEditingTime(false); }} style={chip(true)}>{visitDate}</div>
                    <div onClick={() => { setEditingTime(true); setShowCalendar(false); }} style={chip(true)}>{visitTime}</div>
                  </div>
                </div>

                {/* 좌석 여유 */}
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  <p style={{ fontSize: 20, fontWeight: 600, color: "#525252", letterSpacing: "-0.4px", lineHeight: 1.5, margin: 0 }}>좌석 여유는 어땠나요?</p>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    {SEATS.map(s => <div key={s} onClick={() => setSeats(s === seats ? null : s)} style={chip(seats === s)}>{s}</div>)}
                  </div>
                </div>

                {/* 소음 */}
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  <p style={{ fontSize: 20, fontWeight: 600, color: "#525252", letterSpacing: "-0.4px", lineHeight: 1.5, margin: 0 }}>소음은 어느 정도였나요?</p>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    {NOISES.map(n => <div key={n} onClick={() => setNoise(n === noise ? null : n)} style={chip(noise === n)}>{n}</div>)}
                  </div>
                </div>

                {/* 키워드 */}
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  <p style={{ fontSize: 20, fontWeight: 600, color: "#525252", letterSpacing: "-0.4px", lineHeight: 1.5, margin: 0 }}>공간 키워드는?</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                    {KEYWORDS.map(kw => <div key={kw} onClick={() => toggleKeyword(kw)} style={chip(keywords.includes(kw))}>{kw}</div>)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fixed: Status bar */}
          {/* Fixed: Header */}
          <div style={{ position: "absolute", top: 43, left: 0, right: 0, height: 56, zIndex: 30, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <button onClick={() => router.back()}
              style={{ position: "absolute", left: 20, background: "none", border: "none", padding: 0, cursor: "pointer", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src={imgChevronLeft} alt="back" style={{ width: "100%", height: "100%" }} />
            </button>
            <span style={{ fontSize: 20, fontWeight: 600, color: "#111", letterSpacing: "-0.5px" }}>방문기록</span>
          </div>

          {/* Fixed: 등록하기 button */}
          <div style={{ position: "absolute", bottom: 42, left: 0, right: 0, zIndex: 35, padding: "0 25px" }}>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                width: "100%", height: 60, background: submitting ? "#e0a800" : "#ffbf00",
                borderRadius: 10, border: "none", fontSize: 16, fontWeight: 600, color: "#111",
                letterSpacing: "-0.4px", cursor: submitting ? "not-allowed" : "pointer",
                transition: "background 0.15s",
              }}
            >
              {submitting ? "저장 중..." : "등록하기"}
            </button>
          </div>

          {/* Home indicator */}
        </div>
      </div>
    </div>
  );
}
