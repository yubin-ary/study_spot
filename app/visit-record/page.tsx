"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

function PillGroup({
  options, value, onChange,
}: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            style={{
              background: active ? "#ffc933" : "#f4f4f4",
              color: active ? "#3a2e10" : "#888",
              border: "none", borderRadius: 18, padding: "8px 18px",
              fontSize: 13, fontWeight: active ? 700 : 500, cursor: "pointer", letterSpacing: "-0.3px",
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function KeywordGroup({
  options, selected, onToggle,
}: { options: string[]; selected: string[]; onToggle: (v: string) => void }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            onClick={() => onToggle(opt)}
            style={{
              background: active ? "#ffc933" : "#f4f4f4",
              color: active ? "#3a2e10" : "#888",
              border: "none", borderRadius: 18, padding: "8px 16px",
              fontSize: 13, fontWeight: active ? 700 : 500, cursor: "pointer", letterSpacing: "-0.3px",
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export default function VisitRecordPage() {
  const router = useRouter();

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [showCalendar, setShowCalendar] = useState(false);

  const [time] = useState("11:00");
  const [seat, setSeat] = useState("");
  const [noise, setNoise] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const toggleKeyword = (k: string) => {
    setKeywords((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));
  };

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  const dateLabel = `${year}년 ${String(month + 1).padStart(2, "0")}월 ${String(selectedDate).padStart(2, "0")}일`;

  const handleSubmit = () => {
    const record = { date: dateLabel, time, seat, noise, keywords };
    console.log("방문기록:", record);
    alert("방문기록이 등록되었어요!");
    router.back();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div style={{ width: 390, height: 844, position: "relative" }}>
        <div
          className="border-2 border-[#111] border-solid overflow-clip relative rounded-[25px]"
          style={{ width: "100%", height: "100%", background: "#fff" }}
        >
          <div className="absolute" style={{ top: 50, left: 0, width: "100%", height: 50, display: "flex", alignItems: "center" }}>
            <button
              onClick={() => router.back()}
              style={{ position: "absolute", left: 18, background: "none", border: "none", cursor: "pointer", fontSize: 22, color: "#111", padding: 4 }}
            >
              ‹
            </button>
            <p style={{ width: "100%", textAlign: "center", fontSize: 18, fontWeight: 700, color: "#1a1a1a", letterSpacing: "-0.4px" }}>
              방문기록
            </p>
          </div>

          <div className="absolute" style={{ top: 105, left: 0, right: 0, bottom: 90, overflowY: "auto", padding: "10px 24px 20px" }}>
            <p style={{ fontSize: 20, fontWeight: 700, color: "#1a1a1a", letterSpacing: "-0.4px" }}>
              방문한 스팟은 어땠나요?
            </p>

            <p style={{ fontSize: 14, fontWeight: 600, color: "#333", marginTop: 24 }}>언제 방문하셨나요?</p>
            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <button
                onClick={() => setShowCalendar((s) => !s)}
                style={{
                  flex: 1, background: showCalendar ? "#ffe9a8" : "#f4f4f4", border: "none", borderRadius: 10,
                  padding: "12px 14px", fontSize: 13, color: "#333", textAlign: "left", cursor: "pointer", letterSpacing: "-0.3px",
                }}
              >
                {dateLabel}
              </button>
              <div style={{ background: "#f4f4f4", borderRadius: 10, padding: "12px 18px", fontSize: 13, color: "#333" }}>
                {time}
              </div>
            </div>

            {showCalendar && (
              <div style={{ marginTop: 10, border: "1px solid #eee", borderRadius: 12, padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <button onClick={prevMonth} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#555" }}>‹</button>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#333" }}>{MONTHS[month]} {year}</span>
                  <button onClick={nextMonth} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#555" }}>›</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center" }}>
                  {WEEKDAYS.map((w) => (
                    <span key={w} style={{ fontSize: 11, color: "#aaa", padding: "4px 0" }}>{w}</span>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", gap: 2 }}>
                  {cells.map((d, i) => {
                    if (d === null) return <span key={i} />;
                    const active = d === selectedDate;
                    return (
                      <button
                        key={i}
                        onClick={() => { setSelectedDate(d); }}
                        style={{
                          aspectRatio: "1", border: "none", borderRadius: "50%", cursor: "pointer",
                          background: active ? "#ffc933" : "transparent",
                          color: active ? "#3a2e10" : "#444",
                          fontSize: 13, fontWeight: active ? 700 : 400,
                        }}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <p style={{ fontSize: 14, fontWeight: 600, color: "#333", marginTop: 24 }}>좌석 여유는 어땠나요?</p>
            <div style={{ marginTop: 10 }}>
              <PillGroup options={["넉넉", "적당", "혼잡"]} value={seat} onChange={setSeat} />
            </div>

            <p style={{ fontSize: 14, fontWeight: 600, color: "#333", marginTop: 24 }}>소음은 어느 정도였나요?</p>
            <div style={{ marginTop: 10 }}>
              <PillGroup options={["시끌", "보통", "조용"]} value={noise} onChange={setNoise} />
            </div>

            <p style={{ fontSize: 14, fontWeight: 600, color: "#333", marginTop: 24 }}>공간 키워드는?</p>
            <div style={{ marginTop: 10 }}>
              <KeywordGroup
                options={["콘센트 많음", "집중 잘됨", "가성비", "팀플 가능", "분위기 좋음"]}
                selected={keywords}
                onToggle={toggleKeyword}
              />
            </div>
          </div>

          <div className="absolute" style={{ left: 0, right: 0, bottom: 0, padding: "12px 24px 24px", background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, #fff 30%)" }}>
            <button
              onClick={handleSubmit}
              style={{
                width: "100%", height: 52, background: "#ffbf00", border: "none", borderRadius: 12,
                fontSize: 15, fontWeight: 700, color: "#3a2e10", cursor: "pointer",
              }}
            >
              등록하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}