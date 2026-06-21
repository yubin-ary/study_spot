"use client";

import { useState, useEffect } from "react";

export default function StatusClock({ color = "#111" }: { color?: string }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    function fmt() {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes().toString().padStart(2, "0");
      return `${h}:${m}`;
    }
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.5px", color, lineHeight: "20px" }}>
      {time}
    </span>
  );
}
