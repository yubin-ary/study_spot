"use client";

import { useRouter } from "next/navigation";

const imgHill = "/assets/e4d5f9c1430b0b30a1eb7593dfe8f415ce5a0f83.svg";
const imgStatusIcons = "/assets/b655a4944c744b18f533b9c4e87522b5f1e0f728.svg";

export default function SplashPage() {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div style={{ width: 390, height: 844, position: "relative" }}>
        {/* Phone frame — exact Figma styles */}
        <div
          className="border-2 border-[#111] border-solid overflow-clip relative rounded-[25px]"
          style={{
            width: "100%",
            height: "100%",
            backgroundImage:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.2) 42.536%, rgba(255, 195, 17, 0.1) 118.84%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)",
          }}
        >
          {/* Hill illustration */}
          <div className="absolute" style={{ left: -60, top: 627, width: 460, height: 310 }}>
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgHill} />
          </div>

          {/* Status bar */}
          <div
            className="absolute overflow-clip"
            style={{ top: 0, left: "50%", transform: "translateX(-50%)", width: 388, height: 43 }}
          >
            <div className="absolute" style={{ right: 24, top: 16.33, width: 64.341, height: 11.337 }}>
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgStatusIcons} />
            </div>
            <p
              className="absolute text-center"
              style={{
                left: "50%",
                transform: "translateX(-50%)",
                top: 12,
                width: 52.121,
                height: 20,
                fontSize: 15,
                fontWeight: 600,
                lineHeight: "20px",
                letterSpacing: "-0.5px",
                color: "#111",
              }}
            >
              9:41
            </p>
          </div>

          {/* Home indicator */}
          <div
            className="absolute overflow-clip"
            style={{ bottom: -2, left: "50%", transform: "translateX(-50%)", width: 390, height: 34 }}
          >
            <div
              className="absolute rounded-[100px]"
              style={{
                bottom: 8,
                left: "50%",
                transform: "translateX(-50%)",
                width: 134,
                height: 5,
                backgroundColor: "#111",
              }}
            />
          </div>

          {/* Start button */}
          <button
            onClick={() => router.push("/onboarding")}
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

          {/* Subtitle text */}
          <p
            className="absolute whitespace-nowrap"
            style={{
              left: 43,
              top: 314,
              fontSize: 16,
              fontWeight: 500,
              color: "#000",
              letterSpacing: "-0.4px",
              lineHeight: 1.5,
            }}
          >
            맞춤형 공부 장소 추천 서비스
          </p>
        </div>
      </div>
    </div>
  );
}
