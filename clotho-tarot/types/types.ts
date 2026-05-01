export enum AppState {
  HOME = 'HOME',
  READING_TYPE_SELECTION = 'READING_TYPE_SELECTION',
  QUESTION_INPUT = 'QUESTION_INPUT',
  CARD_PICKING = 'CARD_PICKING',
  RESULT = 'RESULT',
  DECK_VIEW = 'DECK_VIEW',
  MASTERS_VIEW = 'MASTERS_VIEW',
  MASTER_REGISTRATION = 'MASTER_REGISTRATION',
  LIVE_CONSULTATION = 'LIVE_CONSULTATION',
  MAJOR_ARCANA_VIEW = 'MAJOR_ARCANA_VIEW',
  MINOR_ARCANA_VIEW = 'MINOR_ARCANA_VIEW',
  MY_PAGE = 'MY_PAGE',
  SHOP = 'SHOP',
  POINT_PURCHASE = 'POINT_PURCHASE',
  CARD_BACK_SELECTION = 'CARD_BACK_SELECTION',
  CHECKOUT = 'CHECKOUT',
  SUBSCRIPTION_PURCHASE = 'SUBSCRIPTION_PURCHASE',
  DECK_SELECTION = 'DECK_SELECTION'
}

export enum ReadingType {
  YES_NO = 'YES_NO',
  PAST_PRESENT_FUTURE = 'PAST_PRESENT_FUTURE'
}

// ==========================================
// 타로 카드
// ==========================================
export interface TarotCard {
  id: string;
  name: string;
  nameKo: string;
  suit: 'Major' | 'Swords' | 'Cups' | 'Wands' | 'Pentacles';
  number: number;
  image: string;
  meaningUp: string;
  meaningRev: string;
  imageUrl?: string;
  isReversed?: boolean; // ✅ 역방향 여부
  orientation?: string; // ✅ 서버: "upright" | "reversed"
}

// ==========================================
// 타로 마스터
// ==========================================
export interface TarotMaster {
  id: string;
  name: string;
  title: string;
  description: string;
  specialization: string[];
  image: string;
  rating: number;
  isOnline: boolean;
}

// ==========================================
// 타로 읽기 결과 (✅ id 필드 추가됨)
// ==========================================
export interface ReadingResult {
  id?: string; // ✅ DB에서 생성될 Reading ID
  question: string;
  type: ReadingType;
  cards: TarotCard[];
  interpretation: string;
  answer?: 'Yes' | 'No' | 'Maybe';
}

// ==========================================
// 채팅 메시지
// ==========================================
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// ==========================================
// 사용자 (✅ points & point 모두 지원)
// ==========================================
export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  points?: number; // 클라이언트에서 사용
  point?: number; // Prisma에서 사용
  role?: string; // ✅ "user" | "expert" | "admin"
}

// ==========================================
// 타로 덱(테마)
// ==========================================
export interface TarotDeck {
  id: string;
  name: string;
  nameKo: string;
  description: string;
  thumbnail: string;
  cssFilter: string; // ✨ 이미지를 덱 테마에 맞게 변환해 줄 마법의 필터
  seed: string;
}

// ==========================================
// 전문가 프로필 (✅ DB 저장용)
// ==========================================
export interface ExpertProfile {
  id: number;
  userId: string;
  nickname: string;
  intro: string;
  specialty: string;
  pricePerChat: number;
  rating: number;
  reviewCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// ==========================================
// 상담 내역 (✅ DB 저장용)
// ==========================================
export interface Consultation {
  id: string;
  createdAt: Date;
  clientId: string;
  expertId: number;
  status: 'pending' | 'active' | 'completed' | 'canceled';
  expert?: ExpertProfile;
}

// ==========================================
// 포인트 로그 (✅ DB 저장용 - 포인트 거래 기록)
// ==========================================
export interface PointLog {
  id: number;
  userId: string;
  amount: number; // +1000 (충전) 또는 -500 (구매)
  reason: string; // "포인트 충전", "스킨 구매", "상담료"
  createdAt: Date;
}

// ==========================================
// 카드 스킨 (✅ DB 저장용)
// ==========================================
export interface CardSkin {
  id: number;
  name: string;
  frontUrl: string;
  backUrl: string;
  price: number;
  isDefault: boolean;
}

// ==========================================
// 사용자 보유 스킨 (✅ DB 저장용)
// ==========================================
export interface UserUnlockedSkin {
  id: number;
  userId: string;
  skinId: number;
  obtainedAt: Date;
  skin?: CardSkin;
}

// ==========================================
// 포인트 패키지 (상점)
// ==========================================
export interface PointPackage {
  id: number;
  name: string;
  points: number;
  price: number;
  discount?: number;
  recommended?: boolean;
}

// ==========================================
// 구독 패키지
// ==========================================
export interface SubscriptionPackage {
  id: number;
  name: string;
  price: number;
  benefits: string[];
  duration: string; // "monthly", "yearly"
}

// ==========================================
// ReadingCard (✅ Reading과 TarotCard의 연결)
// ==========================================
export interface ReadingCard {
  id?: number;
  readingId: string;
  cardId: string;
  position: number; // 1: 과거/첫번째, 2: 현재/두번째, 3: 미래/세번째
  orientation: 'upright' | 'reversed';
  card?: TarotCard;
}