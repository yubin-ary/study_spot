"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

const ILLUSTRATION = "/assets/2f4104ed00626a5de703f34eb551e9f802923d56.png";
const HILL_SVG = "/assets/2b7cb77738f8586c7f8c6e76ae6e9af45b3ec7e5.svg";
const STATUS_ICONS = "/assets/b655a4944c744b18f533b9c4e87522b5f1e0f728.svg";

const slides = [
  {
    title: "오늘은 어디서 공부하지?",
    titleLines: ["오늘은 어디서 공부하지?"],
    desc: ["장소를 찾느라 공부 시간을", "낭비하고 있진 않나요?"],
    // container: w=255.847 h=321.69 rotate=-9.99, img: h=156.73% left=0 top=0 w=295.59%
    illustration: {
      containerW: 256,
      containerH: 322,
      containerTop: 266,
      containerLeft: 67,
      rotate: -9.99,
      imgW: "295.59%",
      imgH: "156.73%",
      imgLeft: "0%",
      imgTop: "0%",
    },
    button: "다음",
    dots: [true, false, false],
  },
  {
    title: "당신에게 맞는 장소를\n찾아드릴게요",
    titleLines: ["당신에게 맞는 장소를", "찾아드릴게요"],
    desc: ["공부목적, 기분, 이동 거리만 알려주세요"],
    illustration: {
      containerW: 250,
      containerH: 300,
      containerTop: 296,
      containerLeft: 73,
      rotate: 0,
      imgW: "295.59%",
      imgH: "164.42%",
      imgLeft: "-97.77%",
      imgTop: "-3.85%",
    },
    button: "다음",
    dots: [false, true, false],
  },
  {
    title: "나만의 공부지도를\n완성해보세요",
    titleLines: ["나만의 공부지도를", "완성해보세요"],
    desc: ["새로운 공간을 발견하며 더 즐겁게 공부하세요"],
    illustration: {
      containerW: 250,
      containerH: 292,
      containerTop: 308,
      containerLeft: 77,
      rotate: 0,
      imgW: "295.59%",
      imgH: "168.55%",
      imgLeft: "-190.47%",
      imgTop: "-8.5%",
    },
    button: "시작하기",
    dots: [false, false, true],
  },
];

export default function OnboardingPage() {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const router = useRouter();

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx < -40 && current < slides.length - 1) setCurrent(current + 1);
    if (dx > 40 && current > 0) setCurrent(current - 1);
    touchStartX.current = null;
  }

  function handleNext() {
    if (current < slides.length - 1) {
      setCurrent(current + 1);
    } else {
      router.push("/status/purpose");
    }
  }

  const slide = slides[current];
  const ill = slide.illustration;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div
        className="relative overflow-hidden select-none"
        style={{
          width: 390,
          height: 844,
          background: "#fefefe",
          border: "2px solid #111",
          borderRadius: 25,
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Status Bar */}
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-6" style={{ height: 44, paddingTop: 14 }}>
          <span style={{ fontWeight: 600, fontSize: 15, letterSpacing: "-0.5px", color: "#111" }}>9:41</span>
          <img src={STATUS_ICONS} alt="" style={{ height: 11.337, width: 64.341 }} />
        </div>

        {/* Title + Desc */}
        <div
          className="absolute flex flex-col"
          style={{ top: current === 0 ? 197 : 188, left: current === 0 ? 37 : "50%", transform: current === 0 ? undefined : "translateX(-50%)", width: 298, gap: 12 }}
        >
          <div style={{ fontWeight: 600, fontSize: 28, letterSpacing: "-0.7px", color: "#111", lineHeight: 1.5, textAlign: "center", whiteSpace: "pre-line" }}>
            {slide.titleLines.join("\n")}
          </div>
          <div style={{ fontWeight: 500, fontSize: 16, letterSpacing: "-0.4px", color: "#111", lineHeight: 1.5, textAlign: "center" }}>
            {slide.desc.map((line, i) => (
              <p key={i} style={{ margin: i < slide.desc.length - 1 ? "0 0 0 0" : 0 }}>{line}</p>
            ))}
          </div>
        </div>

        {/* Illustration */}
        <div
          className="absolute overflow-hidden"
          style={{
            width: ill.containerW,
            height: ill.containerH,
            top: ill.containerTop,
            left: ill.containerLeft,
            transform: ill.rotate ? `rotate(${ill.rotate}deg)` : undefined,
          }}
        >
          <img
            src={ILLUSTRATION}
            alt=""
            style={{
              position: "absolute",
              width: ill.imgW,
              height: ill.imgH,
              left: ill.imgLeft,
              top: ill.imgTop,
              maxWidth: "none",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Hill + Flag */}
        <div className="absolute" style={{ left: -60, top: 627, width: 460, height: 310 }}>
          <img src={HILL_SVG} alt="" style={{ width: "100%", height: "100%", display: "block" }} />
        </div>

        {/* Dot Indicators */}
        <div className="absolute flex gap-[6px] items-center" style={{ top: 663, left: "50%", transform: "translateX(-50%)" }}>
          {slide.dots.map((active, i) => (
            <div
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: active ? 10 : 8,
                height: active ? 10 : 8,
                borderRadius: "50%",
                backgroundColor: active ? "#111" : "#D9D9D9",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            />
          ))}
        </div>

        {/* Button */}
        <button
          onClick={handleNext}
          className="absolute"
          style={{
            left: 24,
            top: 732,
            width: 339,
            height: 60,
            backgroundColor: "#ffbf00",
            borderRadius: 10,
            border: "none",
            fontSize: 16,
            fontWeight: 600,
            color: "#111",
            letterSpacing: "-0.4px",
            cursor: "pointer",
            transition: "opacity 0.15s",
          }}
          onMouseDown={(e) => (e.currentTarget.style.opacity = "0.8")}
          onMouseUp={(e) => (e.currentTarget.style.opacity = "1")}
        >
          {slide.button}
        </button>

        {/* Home Indicator */}
      </div>
    </div>
  );
}
