
import { TarotCard, TarotMaster } from '@/types';

export const TAROT_CARDS: TarotCard[] = [
  {
    id: '0',
    name: 'The Fool',
    nameKo: '광대',
    suit: 'Major',
    number: 0,
    image: 'https://picsum.photos/seed/fool/400/600',
    meaningUp: 'Beginnings, innocence, spontaneity, a free spirit.',
    meaningRev: 'Holding back, recklessness, risk-taking.'
  },
  {
    id: '1',
    name: 'The Magician',
    nameKo: '마법사',
    suit: 'Major',
    number: 1,
    image: 'https://picsum.photos/seed/magician/400/600',
    meaningUp: 'Manifestation, resourcefulness, power, inspired action.',
    meaningRev: 'Manipulation, poor planning, untapped talents.'
  },
  {
    id: '2',
    name: 'The High Priestess',
    nameKo: '고위 여사제',
    suit: 'Major',
    number: 2,
    image: 'https://picsum.photos/seed/priestess/400/600',
    meaningUp: 'Intuition, sacred knowledge, divine feminine, the subconscious mind.',
    meaningRev: 'Secrets, disconnected from intuition, withdrawal and silence.'
  },
  {
    id: '3',
    name: 'The Empress',
    nameKo: '황후',
    suit: 'Major',
    number: 3,
    image: 'https://picsum.photos/seed/empress/400/600',
    meaningUp: 'Femininity, beauty, nature, nurturing, abundance.',
    meaningRev: 'Creative block, dependence on others.'
  },
  {
    id: '4',
    name: 'The Emperor',
    nameKo: '황제',
    suit: 'Major',
    number: 4,
    image: 'https://picsum.photos/seed/emperor/400/600',
    meaningUp: 'Authority, establishment, structure, a father figure.',
    meaningRev: 'Domination, excessive control, lack of discipline, inflexibility.'
  },
  {
    id: '5',
    name: 'The Hierophant',
    nameKo: '교황',
    suit: 'Major',
    number: 5,
    image: 'https://picsum.photos/seed/hierophant/400/600',
    meaningUp: 'Spiritual wisdom, religious beliefs, conformity, tradition, institutions.',
    meaningRev: 'Personal beliefs, freedom, challenging the status quo.'
  },
  {
    id: '6',
    name: 'The Lovers',
    nameKo: '연인',
    suit: 'Major',
    number: 6,
    image: 'https://picsum.photos/seed/lovers/400/600',
    meaningUp: 'Love, harmony, relationships, values alignment, choices.',
    meaningRev: 'Self-love, disharmony, imbalance, misalignment of values.'
  },
  {
    id: '7',
    name: 'The Chariot',
    nameKo: '전차',
    suit: 'Major',
    number: 7,
    image: 'https://picsum.photos/seed/chariot/400/600',
    meaningUp: 'Control, willpower, success, action, determination.',
    meaningRev: 'Self-discipline, opposition, lack of direction.'
  }
];

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
