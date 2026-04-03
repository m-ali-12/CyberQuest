// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function xpForNextLevel(currentLevel: number): number {
  return Math.pow(currentLevel, 2) * 100;
}

export function xpProgress(xp: number): { level: number; current: number; needed: number; percent: number } {
  const level = calculateLevel(xp);
  const currentLevelXp = Math.pow(level - 1, 2) * 100;
  const nextLevelXp = Math.pow(level, 2) * 100;
  const current = xp - currentLevelXp;
  const needed = nextLevelXp - currentLevelXp;
  return { level, current, needed, percent: Math.floor((current / needed) * 100) };
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function difficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    BEGINNER: 'text-cyber-green border-cyber-green',
    INTERMEDIATE: 'text-cyber-yellow border-cyber-yellow',
    ADVANCED: 'text-orange-400 border-orange-400',
    EXPERT: 'text-cyber-red border-cyber-red',
  };
  return colors[difficulty] || 'text-gray-400 border-gray-400';
}

export function difficultyBg(difficulty: string): string {
  const colors: Record<string, string> = {
    BEGINNER: 'bg-cyber-green/10',
    INTERMEDIATE: 'bg-cyber-yellow/10',
    ADVANCED: 'bg-orange-400/10',
    EXPERT: 'bg-cyber-red/10',
  };
  return colors[difficulty] || 'bg-gray-400/10';
}

export function categoryIcon(category: string): string {
  const icons: Record<string, string> = {
    WEB: '🌐',
    CRYPTO: '🔐',
    FORENSICS: '🔍',
    NETWORK: '🌐',
    REVERSE: '⚙️',
    OSINT: '👁️',
    STEGANOGRAPHY: '🖼️',
  };
  return icons[category] || '💻';
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + '...' : str;
}
