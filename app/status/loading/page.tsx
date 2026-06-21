"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const imgRobot  = "/assets/2f4104ed00626a5de703f34eb551e9f802923d56.png";
const imgCircle = "/assets/046d1ed484f11c5677e085396fed4193598c3c5c.svg";

export default function LoadingPage() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.push("/map"), 2500);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f3f4f6" }}>
      <div style={{ width: 390, height: 844, position: "relative" }}>
        <div style={{
          width: "100%", height: "100%",
          border: "2px solid #111", borderRadius: 45, overflow: "hidden",
          position: "relative",
          background: "linear-gradient(to bottom, #c9e7ff 55.569%, #f6fbff 100%)",
        }}>

          {/* Text content */}
          <div style={{
            position: "absolute", top: 138, left: "50%", transform: "translateX(-50%)",
            width: 245, textAlign: "center",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
          }}>
            <div style={{ fontSize: 32, fontWeight: 600, color: "#111", lineHeight: 1.5, wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
              <p style={{ margin: 0, lineHeight: 1.5 }}>보물 스팟</p>
              <p style={{ margin: 0, lineHeight: 1.5 }}>찾는 중...</p>
            </div>
            <p style={{ margin: 0, fontSize: 14, color: "#525252", letterSpacing: "-0.35px", lineHeight: 1.5, whiteSpace: "nowrap" }}>
              조금만 기다려주세요!<br />
              딱 맞는 장소를 찾고 있어요.
            </p>
          </div>

          {/* Spinning circle + robot illustration */}
          <div style={{ position: "absolute", top: 350, left: "50%", transform: "translateX(-50%)", width: 280, height: 280, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* Spinning ring */}
            <img
              src={imgCircle}
              alt=""
              style={{
                position: "absolute", inset: 0, width: "100%", height: "100%",
                animation: "spin 2s linear infinite",
              }}
            />
            {/* Robot image — sprite crop: container 152×191, centered in ring */}
            <div style={{ transform: "rotate(-9.99deg)", flexShrink: 0 }}>
              <div style={{ width: 152, height: 191, position: "relative", overflow: "hidden" }}>
                <img
                  src={imgRobot}
                  alt="robot"
                  style={{
                    position: "absolute", top: 0, left: 0,
                    width: "295.59%", height: "156.73%",
                    maxWidth: "none",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Home indicator */}
          <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", width: 134, height: 5, background: "#111", borderRadius: 100 }} />
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
