// constants/constants.ts

import { TarotMaster, TarotDeck } from '../types/types';

// ============ 포인트 패키지 ============
export const POINT_PACKAGES = [
  {
    id: 'points-100',
    points: 100,
    price: 1000,
    isPopular: false
  },
  {
    id: 'points-500',
    points: 500,
    bonus: 50,
    price: 4500,
    isPopular: false
  },
  {
    id: 'points-1000',
    points: 1000,
    bonus: 200,
    price: 8500,
    isPopular: true
  },
  {
    id: 'points-5000',
    points: 5000,
    bonus: 1500,
    price: 39900,
    isPopular: false
  }
];

// ============ 구독 패키지 ============
export const SUBSCRIPTION_PACKAGES = [
  {
    id: 'sub-basic',
    name: 'Basic',
    description: '기본적인 상담 서비스',
    price: 9900,
    benefits: [
      '월 1,000 포인트 지급',
      '상담 비용 10% 할인',
      '우선 상담 예약',
      '매일 운세 조회'
    ],
    isPopular: false
  },
  {
    id: 'sub-premium',
    name: 'Premium',
    description: '프리미엄 상담 경험',
    price: 24900,
    benefits: [
      '월 3,000 포인트 지급',
      '상담 비용 25% 할인',
      '최우선 상담 예약',
      '무제한 운세 조회',
      '전문가 추천 서비스',
      '월 1회 무료 상담'
    ],
    isPopular: true
  },
  {
    id: 'sub-vip',
    name: 'VIP',
    description: 'VIP 전용 특별 서비스',
    price: 49900,
    benefits: [
      '월 7,000 포인트 지급',
      '상담 비용 40% 할인',
      'VIP 전용 마스터 상담',
      '무제한 운세 조회',
      '전문가 맞춤 추천',
      '월 4회 무료 상담',
      'VIP 커뮤니티 접근',
      '24시간 우선 지원'
    ],
    isPopular: false
  }
];

// ============ 타로 마스터 (기존) ============
export const TAROT_MASTERS: TarotMaster[] = [
  {
    id: 'm-luna',
    name: '루나',
    title: '달의 예언자',
    description: '달의 신비로운 힘으로 과거, 현재, 미래를 읽는 전문가입니다.',
    specialization: ['연애', '미래'],
    image: 'https://picsum.photos/seed/luna/300/400',
    rating: 4.9,
    isOnline: true
  },
  {
    id: 'm-sol',
    name: '솔',
    title: '태양의 예언자',
    description: '밝은 에너지로 당신의 길을 밝혀주는 타로 마스터입니다.',
    specialization: ['진로', '재물'],
    image: 'https://picsum.photos/seed/sol/300/400',
    rating: 4.8,
    isOnline: true
  },
  {
    id: 'm-stella',
    name: '스텔라',
    title: '별의 무녀',
    description: '별들의 속삭임을 통해 당신의 운명을 해석합니다.',
    specialization: ['과거사', '영혼'],
    image: 'https://picsum.photos/seed/stella/300/400',
    rating: 4.7,
    isOnline: false
  },
  {
    id: 'm-mystique',
    name: '미스틱',
    title: '신비의 인도자',
    description: '깊은 영적 통찰력으로 당신의 내면의 목소리를 듣게 합니다.',
    specialization: ['인간관계', '자기발견'],
    image: 'https://picsum.photos/seed/mystique/300/400',
    rating: 4.6,
    isOnline: true
  }
];

// ============ 타로 덱 (기존) ============
export const TAROT_DECKS: TarotDeck[] = [
  {
    id: 'deck-classic',
    name: 'Classic Canvas',
    nameKo: '클래식 캔버스',
    description: '운명의 흐름을 있는 그대로 비춰주는 가장 순수한 형태의 덱입니다.',
    thumbnail: '/images/tarot/0_fool.png',
    seed: 'classic-canvas',
    cssFilter: 'none'
  },
  {
    id: 'deck-moonlight',
    name: 'Moonlight Whisper',
    nameKo: '달빛의 속삭임',
    description: '푸른 달빛 아래 은은하게 빛나며 무의식의 심연을 보여줍니다.',
    thumbnail: '/images/tarot/2_priestess.png',
    seed: 'moonlight-whisper',
    cssFilter: 'hue-rotate(200deg) saturate(0.8) brightness(0.9)'
  },
  {
    id: 'deck-sunset',
    name: 'Sunset Oracle',
    nameKo: '노을빛 신탁',
    description: '황혼의 따뜻한 빛을 머금어 직관적이고 감성적인 해답을 제시합니다.',
    thumbnail: '/images/tarot/19_sun.png',
    seed: 'sunset-oracle',
    cssFilter: 'sepia(0.6) hue-rotate(-20deg) saturate(1.2)'
  }
];

// ============ 기타 상수 ============
// 필요한 다른 상수들을 여기에 추가하세요