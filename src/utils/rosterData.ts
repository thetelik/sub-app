import { Player } from '../types';
import { ACTIVE_TEAM } from '../config/teamConfig';

export const DEFAULT_ROSTER: Player[] = ACTIVE_TEAM.defaultRoster;
export const STORAGE_KEY: string = ACTIVE_TEAM.storageKey;

export function loadSavedRoster(storageKey = STORAGE_KEY, fallbackRoster = DEFAULT_ROSTER): Player[] {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error(`Failed to load roster from localStorage (${storageKey}):`, e);
  }
  return fallbackRoster;
}

export function saveRoster(roster: Player[], storageKey = STORAGE_KEY) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(roster));
  } catch (e) {
    console.error(`Failed to save roster to localStorage (${storageKey}):`, e);
  }
}
