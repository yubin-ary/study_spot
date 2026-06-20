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
  {
    id: 1, name: "카페어바웃", category: "카페",
    weekdayHours: "10:00~22:00", weekendHours: "12:00~22:00",
    imageUrl: "/assets/ab9b57e850c9d68cef7849e730bf7a1716cd76f6.png",
    address: "서울시 성북구 장월로 1마길 5 1F, B1",
    coordinates: { lat: 37.6039, lng: 127.0462 },
    noiseLevel: "조용함", size: "큼", cleanliness: "좋음",
    visitTags: ["소음 보통", "여유좌석 적당", "분위기 좋음"],
    treasureType: "현실도피섬", pinType: "yellow",
  },
  {
    id: 2, name: "성북 스터디 라운지", category: "스터디카페",
    weekdayHours: "07:00~24:00", weekendHours: "09:00~24:00",
    imageUrl: "/assets/ab9b57e850c9d68cef7849e730bf7a1716cd76f6.png",
    address: "서울시 성북구 화랑로 13길 17",
    coordinates: { lat: 37.6061, lng: 127.0495 },
    noiseLevel: "조용함", size: "보통", cleanliness: "좋음",
    visitTags: ["조용함", "넓은 공간", "콘센트 많음"],
    treasureType: "밤샘섬", pinType: "purple",
  },
  {
    id: 3, name: "이디야커피 성북점", category: "카페",
    weekdayHours: "08:00~22:00", weekendHours: "10:00~21:00",
    imageUrl: "/assets/ab9b57e850c9d68cef7849e730bf7a1716cd76f6.png",
    address: "서울시 성북구 월곡로 44",
    coordinates: { lat: 37.6025, lng: 127.0476 },
    noiseLevel: "보통", size: "큼", cleanliness: "보통",
    visitTags: ["집중 잘됨", "콘센트 많음", "가성비"],
    treasureType: "가성비섬", pinType: "yellow",
  },
  {
    id: 4, name: "메가커피 월곡점", category: "카페",
    weekdayHours: "07:00~23:00", weekendHours: "08:00~23:00",
    imageUrl: "/assets/ab9b57e850c9d68cef7849e730bf7a1716cd76f6.png",
    address: "서울시 성북구 종암로 167",
    coordinates: { lat: 37.6014, lng: 127.0437 },
    noiseLevel: "보통", size: "작음", cleanliness: "보통",
    visitTags: ["분위기 좋음", "저렴함"],
    treasureType: "밤샘섬", pinType: "cyan",
  },
  {
    id: 5, name: "성북정보도서관", category: "도서관",
    weekdayHours: "09:00~22:00", weekendHours: "09:00~18:00",
    imageUrl: "/assets/ab9b57e850c9d68cef7849e730bf7a1716cd76f6.png",
    address: "서울시 성북구 오패산로 46",
    coordinates: { lat: 37.6030, lng: 127.0489 },
    noiseLevel: "조용함", size: "큼", cleanliness: "깨끗함",
    visitTags: ["조용함", "무료 이용", "열람실 넓음"],
    treasureType: "현실도피섬", pinType: "lavender",
  },
  {
    id: 6, name: "토즈 스터디센터 성북점", category: "스터디카페",
    weekdayHours: "09:00~23:00", weekendHours: "10:00~22:00",
    imageUrl: "/assets/ab9b57e850c9d68cef7849e730bf7a1716cd76f6.png",
    address: "서울시 성북구 하월곡동 88",
    coordinates: { lat: 37.6012, lng: 127.0465 },
    noiseLevel: "보통", size: "보통", cleanliness: "좋음",
    visitTags: ["깔끔함", "편의시설 많음", "쾌적함"],
    treasureType: "가성비섬", pinType: "blue",
  },
  {
    id: 7, name: "성북길빛 도서관", category: "도서관",
    weekdayHours: "10:00~22:00", weekendHours: "12:00~22:00",
    imageUrl: "/assets/ab9b57e850c9d68cef7849e730bf7a1716cd76f6.png",
    address: "서울시 성북구 동소문로 23",
    coordinates: { lat: 37.6048, lng: 127.0512 },
    noiseLevel: "조용함", size: "큼", cleanliness: "좋음",
    visitTags: ["조용함", "넓은 공간", "무료 이용"],
    treasureType: "현실도피섬", pinType: "lavender",
  },
  {
    id: 8, name: "비밀의 공부방", category: "스터디카페",
    weekdayHours: "24시간", weekendHours: "24시간",
    imageUrl: "/assets/ab9b57e850c9d68cef7849e730bf7a1716cd76f6.png",
    address: "서울시 성북구 보문로 12",
    coordinates: { lat: 37.5882, lng: 127.0193 },
    noiseLevel: "조용함", size: "보통", cleanliness: "깨끗함",
    visitTags: ["숨은 명당", "아늑함", "24시간"],
    treasureType: "비밀섬", pinType: "purple",
  },
  {
    id: 9, name: "오래된 책방 카페", category: "카페",
    weekdayHours: "11:00~21:00", weekendHours: "12:00~20:00",
    imageUrl: "/assets/ab9b57e850c9d68cef7849e730bf7a1716cd76f6.png",
    address: "서울시 성북구 삼선교로 8",
    coordinates: { lat: 37.5901, lng: 127.0078 },
    noiseLevel: "조용함", size: "작음", cleanliness: "좋음",
    visitTags: ["숨은 명당", "분위기 좋음", "아늑함"],
    treasureType: "비밀섬", pinType: "yellow",
  },
  {
    id: 10, name: "스타벅스 고려대점", category: "카페",
    weekdayHours: "07:30~22:00", weekendHours: "09:00~21:00",
    imageUrl: "/assets/ab9b57e850c9d68cef7849e730bf7a1716cd76f6.png",
    address: "서울시 성북구 안암로 145",
    coordinates: { lat: 37.5894, lng: 127.0321 },
    noiseLevel: "시끄러움", size: "큼", cleanliness: "보통",
    visitTags: ["와이파이 빠름", "좌석 많음", "콘센트 있음"],
    treasureType: "가성비섬", pinType: "cyan",
  },
  {
    id: 11, name: "해오름 독서실", category: "스터디카페",
    weekdayHours: "06:00~24:00", weekendHours: "07:00~24:00",
    imageUrl: "/assets/ab9b57e850c9d68cef7849e730bf7a1716cd76f6.png",
    address: "서울시 성북구 보문로 34다길 5",
    coordinates: { lat: 37.5920, lng: 127.0150 },
    noiseLevel: "조용함", size: "큼", cleanliness: "깨끗함",
    visitTags: ["집중 잘됨", "조용함", "장기 이용 가능"],
    treasureType: "밤샘섬", pinType: "blue",
  },
  {
    id: 12, name: "북카페 두루두루", category: "카페",
    weekdayHours: "10:00~21:00", weekendHours: "11:00~20:00",
    imageUrl: "/assets/ab9b57e850c9d68cef7849e730bf7a1716cd76f6.png",
    address: "서울시 성북구 성북로 130",
    coordinates: { lat: 37.5975, lng: 127.0022 },
    noiseLevel: "조용함", size: "보통", cleanliness: "좋음",
    visitTags: ["책 많음", "아늑함", "숨은 명당"],
    treasureType: "현실도피섬", pinType: "lavender",
  },
  {
    id: 13, name: "공공도서관 안암분관", category: "도서관",
    weekdayHours: "09:00~21:00", weekendHours: "09:00~17:00",
    imageUrl: "/assets/ab9b57e850c9d68cef7849e730bf7a1716cd76f6.png",
    address: "서울시 성북구 안암로 5길 4",
    coordinates: { lat: 37.5873, lng: 127.0289 },
    noiseLevel: "조용함", size: "큼", cleanliness: "깨끗함",
    visitTags: ["무료 이용", "조용함", "열람실 넓음"],
    treasureType: "가성비섬", pinType: "lavender",
  },
  {
    id: 14, name: "컴포즈커피 종암점", category: "카페",
    weekdayHours: "08:00~22:00", weekendHours: "09:00~22:00",
    imageUrl: "/assets/ab9b57e850c9d68cef7849e730bf7a1716cd76f6.png",
    address: "서울시 성북구 종암로 42",
    coordinates: { lat: 37.5998, lng: 127.0417 },
    noiseLevel: "보통", size: "보통", cleanliness: "보통",
    visitTags: ["저렴함", "콘센트 있음", "와이파이 빠름"],
    treasureType: "가성비섬", pinType: "yellow",
  },
  {
    id: 15, name: "밤새도록 스터디카페", category: "스터디카페",
    weekdayHours: "24시간", weekendHours: "24시간",
    imageUrl: "/assets/ab9b57e850c9d68cef7849e730bf7a1716cd76f6.png",
    address: "서울시 성북구 동선동 3가 105",
    coordinates: { lat: 37.5946, lng: 127.0090 },
    noiseLevel: "조용함", size: "큼", cleanliness: "좋음",
    visitTags: ["24시간", "새벽 이용 가능", "집중 잘됨"],
    treasureType: "밤샘섬", pinType: "purple",
  },
];

export default mockPlaces;
