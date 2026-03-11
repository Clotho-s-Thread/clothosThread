
export enum AppState {
  HOME = 'HOME',
  READING_TYPE_SELECTION = 'READING_TYPE_SELECTION',
  QUESTION_INPUT = 'QUESTION_INPUT',
  CARD_PICKING = 'CARD_PICKING',
  RESULT = 'RESULT',
  DECK_VIEW = 'DECK_VIEW',
  MASTERS_VIEW = 'MASTERS_VIEW',
  MASTER_REGISTRATION = 'MASTER_REGISTRATION',
  LIVE_CONSULTATION = 'LIVE_CONSULTATION'
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
}
