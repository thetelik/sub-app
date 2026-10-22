import { Player } from '../types';

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatFullTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs.toString().padStart(2, '0')}s`;
}

/**
 * Calculates the next fair round-robin substitution:
 * - Next players coming ON: from the front of the bench queue
 * - Next players going OFF: the players on pitch who have played the longest consecutive time / earliest queue order
 */
export function calculateNextRotation(
  players: Player[],
  batchCountOverride?: number
): {
  nextIn: Player[];
  nextOut: Player[];
} {
  const bench = players
    .filter((p) => p.status === 'bench')
    .sort((a, b) => {
      // Bench players with least total play time or earliest queue order get priority
      if (a.totalPlayTime !== b.totalPlayTime) {
        return a.totalPlayTime - b.totalPlayTime;
      }
      return a.queueOrder - b.queueOrder;
    });

  const playing = players
    .filter((p) => p.status === 'playing')
    .sort((a, b) => {
      // Playing players with most consecutive current shift time or highest total play time sub off first
      if (b.currentShiftTime !== a.currentShiftTime) {
        return b.currentShiftTime - a.currentShiftTime;
      }
      if (b.totalPlayTime !== a.totalPlayTime) {
        return b.totalPlayTime - a.totalPlayTime;
      }
      return a.queueOrder - b.queueOrder;
    });

  if (bench.length === 0 || playing.length === 0) {
    return { nextIn: [], nextOut: [] };
  }

  // Number of players to substitute: either all bench players or min(bench.length, batchCountOverride)
  const countToSwap = batchCountOverride && batchCountOverride > 0
    ? Math.min(batchCountOverride, bench.length, playing.length)
    : Math.min(bench.length, playing.length);

  const nextIn = bench.slice(0, countToSwap);
  const nextOut = playing.slice(0, countToSwap);

  return { nextIn, nextOut };
}

/**
 * Execute the substitution in state:
 * - nextIn players change to 'playing'
 * - nextOut players change to 'bench'
 * - reset currentShiftTime for incoming players
 * - update queueOrder for round-robin rotation continuity
 */
export function executeRotation(
  players: Player[],
  nextInIds: string[],
  nextOutIds: string[]
): Player[] {
  const maxQueue = Math.max(...players.map((p) => p.queueOrder), 0);
  let nextQueueCounter = maxQueue + 1;

  return players.map((player) => {
    if (nextInIds.includes(player.id)) {
      return {
        ...player,
        status: 'playing',
        currentShiftTime: 0,
        shiftsPlayed: player.shiftsPlayed + 1,
      };
    }
    if (nextOutIds.includes(player.id)) {
      return {
        ...player,
        status: 'bench',
        currentShiftTime: 0,
        // Push to end of round robin queue
        queueOrder: nextQueueCounter++,
      };
    }
    return player;
  });
}
