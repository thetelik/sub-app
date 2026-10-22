import { Player } from '../types';

export const DEFAULT_ROSTER: Player[] = [
  { id: 'p-1', name: 'John', number: 1, status: 'playing', totalPlayTime: 0, totalBenchTime: 0, currentShiftTime: 0, shiftsPlayed: 0, queueOrder: 1 },
  { id: 'p-2', name: 'Aaron', number: 2, status: 'playing', totalPlayTime: 0, totalBenchTime: 0, currentShiftTime: 0, shiftsPlayed: 0, queueOrder: 2 },
  { id: 'p-3', name: 'Leo', number: 3, status: 'playing', totalPlayTime: 0, totalBenchTime: 0, currentShiftTime: 0, shiftsPlayed: 0, queueOrder: 3 },
  { id: 'p-4', name: 'Maya', number: 4, status: 'playing', totalPlayTime: 0, totalBenchTime: 0, currentShiftTime: 0, shiftsPlayed: 0, queueOrder: 4 },
  { id: 'p-5', name: 'Lucas', number: 5, status: 'playing', totalPlayTime: 0, totalBenchTime: 0, currentShiftTime: 0, shiftsPlayed: 0, queueOrder: 5 },
  { id: 'p-6', name: 'Emma', number: 6, status: 'playing', totalPlayTime: 0, totalBenchTime: 0, currentShiftTime: 0, shiftsPlayed: 0, queueOrder: 6 },
  { id: 'p-7', name: 'Noah', number: 7, status: 'playing', totalPlayTime: 0, totalBenchTime: 0, currentShiftTime: 0, shiftsPlayed: 0, queueOrder: 7 },
  { id: 'p-8', name: 'Sophia', number: 8, status: 'bench', totalPlayTime: 0, totalBenchTime: 0, currentShiftTime: 0, shiftsPlayed: 0, queueOrder: 8 },
  { id: 'p-9', name: 'Oliver', number: 9, status: 'bench', totalPlayTime: 0, totalBenchTime: 0, currentShiftTime: 0, shiftsPlayed: 0, queueOrder: 9 },
  { id: 'p-10', name: 'Liam', number: 10, status: 'bench', totalPlayTime: 0, totalBenchTime: 0, currentShiftTime: 0, shiftsPlayed: 0, queueOrder: 10 },
  { id: 'p-11', name: 'Ava', number: 11, status: 'bench', totalPlayTime: 0, totalBenchTime: 0, currentShiftTime: 0, shiftsPlayed: 0, queueOrder: 11 },
  { id: 'p-12', name: 'Ethan', number: 12, status: 'bench', totalPlayTime: 0, totalBenchTime: 0, currentShiftTime: 0, shiftsPlayed: 0, queueOrder: 12 },
];

const STORAGE_KEY = 'subsquad_saved_roster_v1';

export function loadSavedRoster(): Player[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load roster from localStorage:', e);
  }
  return DEFAULT_ROSTER;
}

export function saveRoster(roster: Player[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(roster));
  } catch (e) {
    console.error('Failed to save roster to localStorage:', e);
  }
}
