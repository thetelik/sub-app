import { Player } from '../types';
import geckosHeaderImg from '../assets/header-geckos.png';
import baabaasHeaderImg from '../assets/header-baabaas.png';

export interface TeamDefinition {
  id: string;
  name: string;
  headerImage: string;
  defaultRoster: Player[];
  storageKey: string;
}

export const DEFAULT_ROSTER_GECKOS: Player[] = [
  { id: 'p-1', name: 'Jake', number: 1, status: 'playing', totalPlayTime: 0, totalBenchTime: 0, currentShiftTime: 0, shiftsPlayed: 0, queueOrder: 1 },
  { id: 'p-2', name: 'Jack', number: 2, status: 'playing', totalPlayTime: 0, totalBenchTime: 0, currentShiftTime: 0, shiftsPlayed: 0, queueOrder: 2 },
  { id: 'p-3', name: 'Liam', number: 3, status: 'playing', totalPlayTime: 0, totalBenchTime: 0, currentShiftTime: 0, shiftsPlayed: 0, queueOrder: 3 },
  { id: 'p-4', name: 'Cooper', number: 4, status: 'playing', totalPlayTime: 0, totalBenchTime: 0, currentShiftTime: 0, shiftsPlayed: 0, queueOrder: 4 },
  { id: 'p-5', name: 'Owen', number: 5, status: 'playing', totalPlayTime: 0, totalBenchTime: 0, currentShiftTime: 0, shiftsPlayed: 0, queueOrder: 5 },
  { id: 'p-6', name: 'Laine', number: 6, status: 'playing', totalPlayTime: 0, totalBenchTime: 0, currentShiftTime: 0, shiftsPlayed: 0, queueOrder: 6 },
  { id: 'p-7', name: 'Jerzy', number: 7, status: 'playing', totalPlayTime: 0, totalBenchTime: 0, currentShiftTime: 0, shiftsPlayed: 0, queueOrder: 7 },
  { id: 'p-8', name: 'Jai', number: 8, status: 'playing', totalPlayTime: 0, totalBenchTime: 0, currentShiftTime: 0, shiftsPlayed: 0, queueOrder: 8 },
  { id: 'p-9', name: 'Zeke', number: 9, status: 'playing', totalPlayTime: 0, totalBenchTime: 0, currentShiftTime: 0, shiftsPlayed: 0, queueOrder: 9 },
  { id: 'p-10', name: 'Bjorn', number: 10, status: 'playing', totalPlayTime: 0, totalBenchTime: 0, currentShiftTime: 0, shiftsPlayed: 0, queueOrder: 10 },
  { id: 'p-11', name: 'Orric', number: 11, status: 'playing', totalPlayTime: 0, totalBenchTime: 0, currentShiftTime: 0, shiftsPlayed: 0, queueOrder: 11 },
  { id: 'p-12', name: 'Kai', number: 12, status: 'playing', totalPlayTime: 0, totalBenchTime: 0, currentShiftTime: 0, shiftsPlayed: 0, queueOrder: 12 },
];

export const DEFAULT_ROSTER_BAABAAS: Player[] = [
  { id: 'p-1', name: 'Tiam', number: 12, status: 'playing', totalPlayTime: 0, totalBenchTime: 0, currentShiftTime: 0, shiftsPlayed: 0, queueOrder: 1 },
  { id: 'p-2', name: 'Archie', number: 7, status: 'playing', totalPlayTime: 0, totalBenchTime: 0, currentShiftTime: 0, shiftsPlayed: 0, queueOrder: 2 },
  { id: 'p-3', name: 'Nelis', number: 6, status: 'playing', totalPlayTime: 0, totalBenchTime: 0, currentShiftTime: 0, shiftsPlayed: 0, queueOrder: 3 },
  { id: 'p-4', name: 'Rexton', number: 9, status: 'playing', totalPlayTime: 0, totalBenchTime: 0, currentShiftTime: 0, shiftsPlayed: 0, queueOrder: 4 },
  { id: 'p-5', name: 'Otis', number: 4, status: 'playing', totalPlayTime: 0, totalBenchTime: 0, currentShiftTime: 0, shiftsPlayed: 0, queueOrder: 5 },
  { id: 'p-6', name: 'Gustaw', number: 2, status: 'playing', totalPlayTime: 0, totalBenchTime: 0, currentShiftTime: 0, shiftsPlayed: 0, queueOrder: 6 },
  { id: 'p-7', name: 'Zayden', number: 5, status: 'playing', totalPlayTime: 0, totalBenchTime: 0, currentShiftTime: 0, shiftsPlayed: 0, queueOrder: 7 },
  { id: 'p-8', name: 'Laila', number: 1, status: 'playing', totalPlayTime: 0, totalBenchTime: 0, currentShiftTime: 0, shiftsPlayed: 0, queueOrder: 8 },
  { id: 'p-9', name: 'Sammy', number: 8, status: 'playing', totalPlayTime: 0, totalBenchTime: 0, currentShiftTime: 0, shiftsPlayed: 0, queueOrder: 9 },
  { id: 'p-10', name: 'Koa', number: 10, status: 'playing', totalPlayTime: 0, totalBenchTime: 0, currentShiftTime: 0, shiftsPlayed: 0, queueOrder: 10 },
  { id: 'p-11', name: 'Hudson', number: 3, status: 'playing', totalPlayTime: 0, totalBenchTime: 0, currentShiftTime: 0, shiftsPlayed: 0, queueOrder: 11 },
];

export const TEAMS: Record<string, TeamDefinition> = {
  geckos: {
    id: 'geckos',
    name: 'Geckos',
    headerImage: geckosHeaderImg,
    defaultRoster: DEFAULT_ROSTER_GECKOS,
    storageKey: 'subsquad_saved_roster_v1_geckos',
  },
  baabaas: {
    id: 'baabaas',
    name: 'Baa Baas',
    headerImage: baabaasHeaderImg,
    defaultRoster: DEFAULT_ROSTER_BAABAAS,
    storageKey: 'subsquad_saved_roster_v1_baabaas',
  },
};

export function getActiveTeam(): TeamDefinition {
  // 1. Build-time environment variable (e.g. VITE_TEAM=geckos or VITE_TEAM=baabaas)
  const envTeam = (import.meta.env.VITE_TEAM || '').toLowerCase().trim();
  if (envTeam && TEAMS[envTeam]) {
    return TEAMS[envTeam];
  }

  // 2. Browser runtime checks (URL search param or pathname)
  if (typeof window !== 'undefined' && window.location) {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const teamParam = (searchParams.get('team') || '').toLowerCase().trim();
      if (teamParam && TEAMS[teamParam]) {
        return TEAMS[teamParam];
      }

      const pathname = window.location.pathname.toLowerCase();
      if (pathname.includes('baabaas') || pathname.includes('baa-baas') || pathname.includes('baa_baas')) {
        return TEAMS.baabaas;
      }
      if (pathname.includes('geckos') || pathname.includes('gecko')) {
        return TEAMS.geckos;
      }
    } catch {
      // Fall through to default if URL parsing fails
    }
  }

  // 3. Fallback default
  return TEAMS.geckos;
}

export const ACTIVE_TEAM: TeamDefinition = getActiveTeam();
export const TEAM_NAME: string = ACTIVE_TEAM.name;
