// 테마섬(보물섬) 종류 — 디자인의 4개 섬으로 확장
export type TreasureType = "현실도피섬" | "가성비섬" | "밤샘섬" | "비밀섬" | null;
export type Category = "카페" | "도서관" | "스터디카페";

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Place {
  id: number;
  name: string;
  category: Category;
  weekdayHours: string;
  weekendHours: string;
  imageUrl: string;
  address: string;
  coordinates: GeoPoint;
  externalPlaceId?: string;
  noiseLevel: string;
  size: string;
  cleanliness: string;
  visitTags: string[];
  treasureType: TreasureType;
  pinType: "yellow" | "purple" | "cyan" | "lavender" | "blue";
}

// TODO: API 연동 시 교체
const mockPlaces: Place[] = [
  { id: 1, name: "카페어바웃", category: "카페", weekdayHours: "10:00~22:00", weekendHours: "12:00~22:00", imageUrl: "/assets/ab9b57e850c9d68cef7849e730bf7a1716cd76f6.png", address: "서울시 성북구 장월로 1마길 5 1F, B1", coordinates: { lat: 37.6039, lng: 127.0462 }, externalPlaceId: "mock-kakao-place-1", noiseLevel: "조용함", size: "큼", cleanliness: "좋음", visitTags: ["소음 보통", "여유좌석 적당"], treasureType: "현실도피섬", pinType: "yellow" },
  { id: 2, name: "카페어바웃", category: "카페", weekdayHours: "10:00~22:00", weekendHours: "12:00~22:00", imageUrl: "/assets/ab9b57e850c9d68cef7849e730bf7a1716cd76f6.png", address: "서울시 성북구 화랑로 13길 17", coordinates: { lat: 37.6061, lng: 127.0495 }, externalPlaceId: "mock-kakao-place-2", noiseLevel: "조용함", size: "보통", cleanliness: "좋음", visitTags: ["조용함", "넓은 공간"], treasureType: "밤샘섬", pinType: "purple" },
  { id: 3, name: "카페어바웃", category: "스터디카페", weekdayHours: "10:00~22:00", weekendHours: "12:00~22:00", imageUrl: "/assets/ab9b57e850c9d68cef7849e730bf7a1716cd76f6.png", address: "서울시 성북구 월곡로 44", coordinates: { lat: 37.6025, lng: 127.0476 }, externalPlaceId: "mock-kakao-place-3", noiseLevel: "보통", size: "큼", cleanliness: "보통", visitTags: ["집중 잘됨", "콘센트 많음"], treasureType: "가성비섬", pinType: "yellow" },
  { id: 4, name: "카페어바웃", category: "카페", weekdayHours: "10:00~22:00", weekendHours: "12:00~22:00", imageUrl: "/assets/ab9b57e850c9d68cef7849e730bf7a1716cd76f6.png", address: "서울시 성북구 종암로 167", coordinates: { lat: 37.6014, lng: 127.0437 }, externalPlaceId: "mock-kakao-place-4", noiseLevel: "시끄러움", size: "작음", cleanliness: "보통", visitTags: ["분위기 좋음"], treasureType: "밤샘섬", pinType: "cyan" },
  { id: 5, name: "카페어바웃", category: "도서관", weekdayHours: "10:00~22:00", weekendHours: "12:00~22:00", imageUrl: "/assets/ab9b57e850c9d68cef7849e730bf7a1716cd76f6.png", address: "서울시 성북구 오패산로 46", coordinates: { lat: 37.6030, lng: 127.0489 }, externalPlaceId: "mock-kakao-place-5", noiseLevel: "조용함", size: "큼", cleanliness: "깨끗함", visitTags: ["조용함", "무료 이용"], treasureType: "현실도피섬", pinType: "lavender" },
  { id: 6, name: "카페어바웃", category: "스터디카페", weekdayHours: "10:00~22:00", weekendHours: "12:00~22:00", imageUrl: "/assets/ab9b57e850c9d68cef7849e730bf7a1716cd76f6.png", address: "서울시 성북구 하월곡동 88", coordinates: { lat: 37.6012, lng: 127.0465 }, externalPlaceId: "mock-kakao-place-6", noiseLevel: "보통", size: "보통", cleanliness: "좋음", visitTags: ["깔끔함", "편의시설 많음"], treasureType: "가성비섬", pinType: "blue" },
  { id: 7, name: "성북길빛 도서관", category: "도서관", weekdayHours: "10:00~22:00", weekendHours: "12:00~22:00", imageUrl: "/assets/ab9b57e850c9d68cef7849e730bf7a1716cd76f6.png", address: "서울시 성북구 동소문로 23", coordinates: { lat: 37.6048, lng: 127.0512 }, externalPlaceId: "mock-kakao-place-7", noiseLevel: "조용함", size: "큼", cleanliness: "좋음", visitTags: ["조용함", "넓은 공간"], treasureType: "현실도피섬", pinType: "lavender" },
  { id: 8, name: "비밀의 공부방", category: "스터디카페", weekdayHours: "10:00~22:00", weekendHours: "12:00~22:00", imageUrl: "/assets/ab9b57e850c9d68cef7849e730bf7a1716cd76f6.png", address: "서울시 성북구 보문로 12", coordinates: { lat: 37.5882, lng: 127.0193 }, externalPlaceId: "mock-kakao-place-8", noiseLevel: "조용함", size: "보통", cleanliness: "깨끗함", visitTags: ["숨은 명당", "아늑함"], treasureType: "비밀섬", pinType: "purple" },
  { id: 9, name: "단골 카페", category: "카페", weekdayHours: "10:00~22:00", weekendHours: "12:00~22:00", imageUrl: "/assets/ab9b57e850c9d68cef7849e730bf7a1716cd76f6.png", address: "서울시 성북구 삼선교로 8", coordinates: { lat: 37.5901, lng: 127.0078 }, externalPlaceId: "mock-kakao-place-9", noiseLevel: "보통", size: "작음", cleanliness: "좋음", visitTags: ["숨은 명당", "분위기 좋음"], treasureType: "비밀섬", pinType: "yellow" },
];

export default mockPlaces;