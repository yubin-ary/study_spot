export type TreasureType = "밤샘섬" | "가성비섬" | null;
export type Category = "카페" | "도서관" | "스터디카페";

export interface Place {
  id: number;
  name: string;
  category: Category;
  weekdayHours: string;
  weekendHours: string;
  imageUrl: string;
  position: { x: number; y: number }; // percentage of map container
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
    id: 1,
    name: "카페어바웃",
    category: "카페",
    weekdayHours: "10:00~22:00",
    weekendHours: "12:00~22:00",
    imageUrl: "/assets/ab9b57e850c9d68cef7849e730bf7a1716cd76f6.png",
    position: { x: 48, y: 46 },
    noiseLevel: "조용함",
    size: "큼",
    cleanliness: "좋음",
    visitTags: ["소음 보통", "여유좌석 적당"],
    treasureType: null,
    pinType: "yellow",
  },
  {
    id: 2,
    name: "카페어바웃",
    category: "카페",
    weekdayHours: "10:00~22:00",
    weekendHours: "12:00~22:00",
    imageUrl: "/assets/ab9b57e850c9d68cef7849e730bf7a1716cd76f6.png",
    position: { x: 72, y: 28 },
    noiseLevel: "조용함",
    size: "보통",
    cleanliness: "좋음",
    visitTags: ["조용함", "넓은 공간"],
    treasureType: "밤샘섬",
    pinType: "purple",
  },
  {
    id: 3,
    name: "카페어바웃",
    category: "스터디카페",
    weekdayHours: "10:00~22:00",
    weekendHours: "12:00~22:00",
    imageUrl: "/assets/ab9b57e850c9d68cef7849e730bf7a1716cd76f6.png",
    position: { x: 58, y: 60 },
    noiseLevel: "보통",
    size: "큼",
    cleanliness: "보통",
    visitTags: ["집중 잘됨", "콘센트 많음"],
    treasureType: "가성비섬",
    pinType: "yellow",
  },
  {
    id: 4,
    name: "카페어바웃",
    category: "카페",
    weekdayHours: "10:00~22:00",
    weekendHours: "12:00~22:00",
    imageUrl: "/assets/ab9b57e850c9d68cef7849e730bf7a1716cd76f6.png",
    position: { x: 30, y: 70 },
    noiseLevel: "시끄러움",
    size: "작음",
    cleanliness: "보통",
    visitTags: ["분위기 좋음"],
    treasureType: "밤샘섬",
    pinType: "cyan",
  },
  {
    id: 5,
    name: "카페어바웃",
    category: "도서관",
    weekdayHours: "10:00~22:00",
    weekendHours: "12:00~22:00",
    imageUrl: "/assets/ab9b57e850c9d68cef7849e730bf7a1716cd76f6.png",
    position: { x: 68, y: 55 },
    noiseLevel: "조용함",
    size: "큼",
    cleanliness: "깨끗함",
    visitTags: ["조용함", "무료 이용"],
    treasureType: null,
    pinType: "lavender",
  },
  {
    id: 6,
    name: "카페어바웃",
    category: "스터디카페",
    weekdayHours: "10:00~22:00",
    weekendHours: "12:00~22:00",
    imageUrl: "/assets/ab9b57e850c9d68cef7849e730bf7a1716cd76f6.png",
    position: { x: 50, y: 72 },
    noiseLevel: "보통",
    size: "보통",
    cleanliness: "좋음",
    visitTags: ["깔끔함", "편의시설 많음"],
    treasureType: "가성비섬",
    pinType: "blue",
  },
];

export default mockPlaces;
