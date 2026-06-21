import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "http://15.164.231.65:8080";
const USER_LAT = 37.6043;
const USER_LNG = 127.0440;

export async function POST(request: NextRequest) {
  const { purpose, duration, distance } = await request.json();

  const res = await fetch(`${BACKEND_URL}/SPOTYU/recommendations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      purpose,
      condition: purpose,
      studyTime: duration,
      distance,
      userLatitude: USER_LAT,
      userLongitude: USER_LNG,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ ids: [] }, { status: res.status });
  }

  const json = await res.json();
  const arr: { placeId: number }[] = json?.data ?? (Array.isArray(json) ? json : []);
  const ids = arr.map((item) => item.placeId);

  return NextResponse.json({ ids });
}
