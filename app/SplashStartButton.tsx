"use client";

import { useRouter } from "next/navigation";

export default function SplashStartButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => { localStorage.setItem("spotyu_visited", "1"); router.push("/onboarding"); }}
      className="absolute flex items-center justify-center rounded-[10px] cursor-pointer"
      style={{
        left: 24,
        top: 732,
        width: 339,
        height: 60,
        backgroundColor: "#ffbf00",
        border: "none",
      }}
    >
      <span
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: "#111",
          letterSpacing: "-0.4px",
          lineHeight: 1.5,
        }}
      >
        시작하기
      </span>
    </button>
  );
}
