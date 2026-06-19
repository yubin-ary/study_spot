import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import mockPlaces from "@/app/data/mockPlaces";

const client = new Anthropic();

export async function POST(request: NextRequest) {
  const { purpose, duration, distance } = await request.json();

  const placesSummary = mockPlaces.map((p) => ({
    id: p.id,
    category: p.category,
    noiseLevel: p.noiseLevel,
    size: p.size,
    cleanliness: p.cleanliness,
    treasureType: p.treasureType ?? "일반",
  }));

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 128,
    messages: [
      {
        role: "user",
        content: `사용자 공부 상태:
- 목적: ${purpose}
- 예상 공부 시간: ${duration}
- 이동 가능 거리: ${distance}

장소 목록 (JSON):
${JSON.stringify(placesSummary)}

위 사용자에게 가장 잘 맞는 장소 id를 최대 3개 골라서 JSON 배열로만 응답해. 설명 없이 배열만. 예시: [1,3,5]`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text.trim() : "[]";
  const match = text.match(/\[[\d,\s]+\]/);
  const ids: number[] = match ? JSON.parse(match[0]) : [];

  return NextResponse.json({ ids });
}
