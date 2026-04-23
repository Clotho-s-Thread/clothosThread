
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
  CHECKOUT = 'CHECKOUT',
  SUBSCRIPTION_PURCHASE = 'SUBSCRIPTION_PURCHASE',
  DECK_SELECTION = 'DECK_SELECTION'
}

export enum ReadingType {
  YES_NO = 'YES_NO',
  PAST_PRESENT_FUTURE = 'PAST_PRESENT_FUTURE'
}

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
}

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

export interface ReadingResult {
  question: string;
  type: ReadingType;
  cards: TarotCard[];
  interpretation: string;
  answer?: 'Yes' | 'No' | 'Maybe';
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  points?: number;
}

// 2. 파일 맨 아래에 타로 덱(테마) 설계도 추가
export interface TarotDeck {
  id: string;
  name: string;
  nameKo: string;
  description: string;
  thumbnail: string;
  cssFilter: string; // ✨ 이미지를 덱 테마에 맞게 변환해 줄 마법의 필터
  seed: string;
}