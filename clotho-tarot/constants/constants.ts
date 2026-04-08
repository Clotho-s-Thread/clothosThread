// constants/constants.ts

import { TarotMaster } from '../types/types';
import { TarotDeck } from '../types/types';

// 🚨 TAROT_CARDS 배열은 이제 DB에서 가져오므로 완전히 삭제했습니다!

export const TAROT_MASTERS: TarotMaster[] = [
  {
    id: 'm1',
    name: 'Aurelia',
    title: 'Sun Oracle',
    description: 'Expert in solar transitions and identifying hidden strengths in your current path.',
    specialization: ['Career', 'Wealth', 'Ambition'],
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300&h=400',
    rating: 5.0,
    isOnline: true
  },
  {
    id: 'm2',
    name: 'Thalassa',
    title: 'Moon Weaver',
    description: 'Specializes in emotional tides, subconscious dreams, and deep spiritual healing.',
    specialization: ['Love', 'Family', 'Inner Child'],
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=300&h=400',
    rating: 4.9,
    isOnline: true
  },
  {
    id: 'm3',
    name: 'Cassian',
    title: 'Shadow Walker',
    description: 'Brave the darkness to find the light. Expert in deep karmic cycles and resolution.',
    specialization: ['Karma', 'Obstacles', 'Health'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=400',
    rating: 4.8,
    isOnline: false
  },
  {
    id: 'm4',
    name: 'Lyra',
    title: 'Star Whisperer',
    description: 'Aligning your mortal steps with the celestial dance. Accurate timing and foresight.',
    specialization: ['Timing', 'Fate', 'Travel'],
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=300&h=400',
    rating: 5.0,
    isOnline: true
  }
];

export const TAROT_DECKS: TarotDeck[] = [
  {
    id: 'deck-classic',
    name: 'Classic Canvas',
    nameKo: '클래식 캔버스',
    description: '운명의 흐름을 있는 그대로 비춰주는 가장 순수한 형태의 덱입니다.',
    thumbnail: '/images/tarot/0_fool.png',
    cssFilter: 'none'
  },
  {
    id: 'deck-moonlight',
    name: 'Moonlight Whisper',
    nameKo: '달빛의 속삭임',
    description: '푸른 달빛 아래 은은하게 빛나며 무의식의 심연을 보여줍니다.',
    thumbnail: '/images/tarot/2_priestess.png',
    cssFilter: 'hue-rotate(200deg) saturate(0.8) brightness(0.9)' // 푸른빛이 돌게 만듦
  },
  {
    id: 'deck-sunset',
    name: 'Sunset Oracle',
    nameKo: '노을빛 신탁',
    description: '황혼의 따뜻한 빛을 머금어 직관적이고 감성적인 해답을 제시합니다.',
    thumbnail: '/images/tarot/19_sun.png',
    cssFilter: 'sepia(0.6) hue-rotate(-20deg) saturate(1.2)' // 노을빛 몽환적인 느낌
  }
];