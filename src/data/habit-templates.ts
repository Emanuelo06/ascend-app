import { HabitTemplate } from '@/types';
import { Sun, Moon, Clock, Target, Heart, Star, Zap, Package } from 'lucide-react';

export const HABIT_TEMPLATES: HabitTemplate[] = [
  // Faith Pack
  {
    id: 'faith-morning-prayer',
    title: 'Morning Prayer',
    purpose: 'Start the day with gratitude and spiritual connection',
    moment: 'morning',
    cadence: { type: 'daily' },
    dose: { unit: 'minutes', target: 10 },
    window: { start: '07:00', end: '11:00' },
    difficulty: 2,
    category: 'faith',
    description: 'Begin each day with prayer and reflection'
  },
  {
    id: 'faith-bible-reading',
    title: 'Bible Reading',
    purpose: 'Daily scripture study for spiritual growth',
    moment: 'morning',
    cadence: { type: 'daily' },
    dose: { unit: 'minutes', target: 15 },
    window: { start: '07:00', end: '11:00' },
    difficulty: 2,
    category: 'faith',
    description: 'Read and reflect on God\'s Word daily'
  },
  {
    id: 'faith-evening-reflection',
    title: 'Evening Reflection',
    purpose: 'End the day with gratitude and prayer',
    moment: 'evening',
    cadence: { type: 'daily' },
    dose: { unit: 'minutes', target: 5 },
    window: { start: '20:00', end: '22:00' },
    difficulty: 1,
    category: 'faith',
    description: 'Reflect on the day and give thanks'
  },

  // Focus Pack
  {
    id: 'focus-deep-work',
    title: 'Deep Work',
    purpose: 'Uninterrupted focused work sessions',
    moment: 'morning',
    cadence: { type: 'weekdays' },
    dose: { unit: 'minutes', target: 90 },
    window: { start: '08:00', end: '12:00' },
    difficulty: 3,
    category: 'focus',
    description: '90-minute focused work sessions without distractions'
  },
  {
    id: 'focus-mindful-breaks',
    title: 'Mindful Breaks',
    purpose: 'Take intentional breaks to maintain focus',
    moment: 'midday',
    cadence: { type: 'daily' },
    dose: { unit: 'minutes', target: 5 },
    window: { start: '12:00', end: '14:00' },
    difficulty: 1,
    category: 'focus',
    description: 'Short mindful breaks to refresh and refocus'
  },
  {
    id: 'focus-planning',
    title: 'Daily Planning',
    purpose: 'Plan the next day for better productivity',
    moment: 'evening',
    cadence: { type: 'daily' },
    dose: { unit: 'minutes', target: 10 },
    window: { start: '20:00', end: '21:00' },
    difficulty: 1,
    category: 'focus',
    description: 'Plan tomorrow\'s priorities and schedule'
  },

  // Health Pack
  {
    id: 'health-hydration',
    title: 'Hydration',
    purpose: 'Stay hydrated throughout the day',
    moment: 'morning',
    cadence: { type: 'daily' },
    dose: { unit: 'liters', target: 2 },
    window: { start: '06:00', end: '22:00' },
    difficulty: 1,
    category: 'health',
    description: 'Drink 2 liters of water daily'
  },
  {
    id: 'health-exercise',
    title: 'Daily Exercise',
    purpose: 'Maintain physical fitness and energy',
    moment: 'morning',
    cadence: { type: 'daily' },
    dose: { unit: 'minutes', target: 30 },
    window: { start: '06:00', end: '09:00' },
    difficulty: 2,
    category: 'health',
    description: '30 minutes of physical activity daily'
  },
  {
    id: 'health-sleep',
    title: 'Sleep Schedule',
    purpose: 'Maintain consistent sleep for better health',
    moment: 'evening',
    cadence: { type: 'daily' },
    dose: { unit: 'hours', target: 8 },
    window: { start: '22:00', end: '06:00' },
    difficulty: 2,
    category: 'health',
    description: 'Get 8 hours of quality sleep nightly'
  },

  // Micro-habits Pack
  {
    id: 'micro-gratitude',
    title: 'Gratitude',
    purpose: 'Practice daily gratitude for better mindset',
    moment: 'morning',
    cadence: { type: 'daily' },
    dose: { unit: 'items', target: 3 },
    window: { start: '07:00', end: '09:00' },
    difficulty: 1,
    category: 'micro',
    description: 'Write down 3 things you\'re grateful for'
  },
  {
    id: 'micro-breathing',
    title: 'Mindful Breathing',
    purpose: 'Quick stress relief and focus',
    moment: 'midday',
    cadence: { type: 'daily' },
    dose: { unit: 'breaths', target: 5 },
    window: { start: '12:00', end: '14:00' },
    difficulty: 1,
    category: 'micro',
    description: 'Take 5 deep, mindful breaths'
  },
  {
    id: 'micro-stretching',
    title: 'Quick Stretch',
    purpose: 'Relieve tension and improve posture',
    moment: 'evening',
    cadence: { type: 'daily' },
    dose: { unit: 'minutes', target: 2 },
    window: { start: '20:00', end: '22:00' },
    difficulty: 1,
    category: 'micro',
    description: '2-minute stretching routine'
  }
];

export const HABIT_PACKS = [
  {
    id: 'faith',
    name: 'Faith Pack',
    description: 'Spiritual growth and daily connection with God',
    habits: HABIT_TEMPLATES.filter(t => t.category === 'faith'),
    color: 'from-purple-500 to-pink-500',
    icon: Heart
  },
  {
    id: 'focus',
    name: 'Focus Pack',
    description: 'Productivity and mental clarity',
    habits: HABIT_TEMPLATES.filter(t => t.category === 'focus'),
    color: 'from-blue-500 to-cyan-500',
    icon: Target
  },
  {
    id: 'health',
    name: 'Health Pack',
    description: 'Physical wellness and energy',
    habits: HABIT_TEMPLATES.filter(t => t.category === 'health'),
    color: 'from-green-500 to-emerald-500',
    icon: Star
  },
  {
    id: 'micro',
    name: 'Micro-habits Pack',
    description: 'Small wins that add up to big changes',
    habits: HABIT_TEMPLATES.filter(t => t.category === 'micro'),
    color: 'from-yellow-500 to-orange-500',
    icon: Zap
  }
];

export const MOMENTS = [
  {
    id: 'morning',
    name: 'Morning',
    displayName: 'Morning',
    startTime: '06:00',
    endTime: '11:00',
    color: 'from-yellow-400 to-orange-500',
    icon: Sun
  },
  {
    id: 'midday',
    name: 'Midday',
    displayName: 'Midday',
    startTime: '11:00',
    endTime: '17:00',
    color: 'from-blue-400 to-cyan-500',
    icon: Clock
  },
  {
    id: 'evening',
    name: 'Evening',
    displayName: 'Evening',
    startTime: '17:00',
    endTime: '22:00',
    color: 'from-purple-400 to-pink-500',
    icon: Moon
  }
];

