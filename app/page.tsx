"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SplashStartButton from "./SplashStartButton";

const imgIllustration = "/assets/2f4104ed00626a5de703f34eb551e9f802923d56.png";
const imgHill          = "/assets/7c24e1614bef5f8590527308836259710db124d0.svg";
const imgStatusIcons   = "/assets/cf8adf0c371ee4bab6d9c27869714c5a52b939c5.svg";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("spotyu_visited")) {
      router.replace("/map");
    }
  }, [router]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#e5e5e5" }}>
      <div style={{ width: 390, height: 844, position: "relative" }}>
        <div
          className="border-2 border-[#111] border-solid overflow-clip relative rounded-[25px]"
          style={{
            width: "100%", height: "100%",
            backgroundImage:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.2) 42.536%, rgba(255, 195, 17, 0.1) 118.84%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)",
          }}
        >
          {/* 하단 모래언덕 */}
        
          <div style={{ position: "absolute", left: -64, top: 613, width: 460, height: 310 }}>
            <img alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} src={imgHill} />
          </div>

          {/* SPOTYU 타이틀 — 그라디언트 */}
          <p style={{
            position: "absolute", left: 32, top: 130,
            fontSize: 62.6, fontWeight: 900,
            letterSpacing: "-1.565px", lineHeight: 1.5,
            whiteSpace: "nowrap", margin: 0,
            backgroundImage: "linear-gradient(-45.5deg, rgba(255, 191, 0, 0.2) 28.7%, rgba(255, 77, 0, 0.2) 78.5%), linear-gradient(90deg, rgb(255, 191, 0) 0%, rgb(255, 191, 0) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            SPOTYU
          </p>

          {/* 서브타이틀 */}
          <p style={{ position: "absolute", left: 32, top: 224, fontSize: 16, fontWeight: 600, color: "#525252", letterSpacing: "-0.4px", lineHeight: 1.5, whiteSpace: "nowrap", margin: 0 }}>
            최적의 공부스팟을 찾아주는 서비스
          </p>

          {/* 일러스트레이션 */}
          <div style={{ position: "absolute", left: 38, top: 248, width: 310, height: 372, overflow: "hidden" }}>
            <img alt="" style={{ position: "absolute", height: "164.42%", left: "-97.77%", top: "-3.85%", width: "295.59%", maxWidth: "none" }} src={imgIllustration} />
          </div>

          {/* 홈 인디케이터 */}
          <div style={{ position: "absolute", bottom: -2, left: "50%", transform: "translateX(-50%)", width: 390, height: 34, overflow: "hidden" }}>
            <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", width: 134, height: 5, borderRadius: 100, background: "#111" }} />
          </div>

          {/* 시작하기 버튼 */}
          <SplashStartButton />
        </div>
      </div>
    </div>
  );
}
