export interface Player {
  id: string;
  name: string;
  number: number;
  status: 'playing' | 'bench' | 'absent' | 'injured';
  totalPlayTime: number; // in seconds
  totalBenchTime: number; // in seconds
  currentShiftTime: number; // in seconds
  shiftsPlayed: number;
  // Position in the round-robin queue (FIFO order)
  queueOrder: number;
}

export type GameStage = 'attendance' | 'setup' | 'playing' | 'paused' | 'sub_due';

export interface SubstitutionEvent {
  id: string;
  timestamp: number; // match seconds elapsed
  timeFormatted: string;
  outPlayers: Player[];
  inPlayers: Player[];
  reason: 'scheduled_rotation' | 'injury' | 'manual';
}

export interface GameSettings {
  subIntervalSeconds: number; // default e.g. 300 (5 mins)
  fieldPlayerCount: number; // target count on pitch
  subBatchCount: number; // how many players rotate per shift (default: all bench or equal)
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}
