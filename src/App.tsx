import { useState, useEffect, useRef, useCallback } from 'react';
import { Player, GameStage, GameSettings } from './types';
import { loadSavedRoster, saveRoster } from './utils/rosterData';
import { sounds } from './utils/audio';
import { calculateNextRotation, executeRotation } from './utils/rotation';
import { Header } from './components/Header';
import { AttendanceStep } from './components/AttendanceStep';
import { LineupWizardStep } from './components/LineupWizardStep';
import { ActiveMatch } from './components/ActiveMatch';
import { SubModal } from './components/SubModal';
import { InGameSquadModal } from './components/InGameSquadModal';
import { RosterEditorModal } from './components/RosterEditorModal';
import { StatsDrawer } from './components/StatsDrawer';

export function App() {
  // Master squad list
  const [players, setPlayers] = useState<Player[]>(() => loadSavedRoster());

  // Game flow state
  const [stage, setStage] = useState<GameStage>('attendance');
  const [shiftNumber, setShiftNumber] = useState<number>(1);
  const [totalMatchSeconds, setTotalMatchSeconds] = useState<number>(0);
  const [subCountdownSeconds, setSubCountdownSeconds] = useState<number>(300); // 5 mins default
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Settings
  const [settings, setSettings] = useState<GameSettings>({
    subIntervalSeconds: 300,
    fieldPlayerCount: 7,
    subBatchCount: 0, // 0 = all bench rotate
    soundEnabled: true,
    vibrationEnabled: true,
  });

  // Modals state
  const [isSubModalOpen, setIsSubModalOpen] = useState<boolean>(false);
  const [isRosterEditorOpen, setIsRosterEditorOpen] = useState<boolean>(false);
  const [isInGameEditorOpen, setIsInGameEditorOpen] = useState<boolean>(false);
  const [isStatsOpen, setIsStatsOpen] = useState<boolean>(false);

  // Sound sync
  useEffect(() => {
    sounds.enabled = settings.soundEnabled;
  }, [settings.soundEnabled]);

  // Persist roster edits
  const handleSaveRoster = (newPlayers: Player[]) => {
    setPlayers(newPlayers);
    saveRoster(newPlayers);
  };

  // Next rotation preview
  const { nextIn, nextOut } = calculateNextRotation(players, settings.subBatchCount);

  // Keep ref to avoid stale closures in timer interval
  const nextInRef = useRef(nextIn);
  const nextOutRef = useRef(nextOut);
  useEffect(() => {
    nextInRef.current = nextIn;
    nextOutRef.current = nextOut;
  }, [nextIn, nextOut]);

  // Timer loop for Active Match
  useEffect(() => {
    if (stage !== 'playing' || isPaused || isSubModalOpen) {
      return;
    }

    const timer = setInterval(() => {
      // 1. Decrement countdown
      setSubCountdownSeconds((prevCountdown) => {
        // Warning beeps at 3, 2, 1
        if (prevCountdown <= 4 && prevCountdown > 1) {
          sounds.playBeep(false);
        } else if (prevCountdown === 1) {
          sounds.playBeep(true);
        }

        if (prevCountdown <= 1) {
          // Time expired! Trigger whistle & popup
          sounds.playWhistle();
          sounds.vibrate([300, 150, 400]);
          setIsSubModalOpen(true);
          return 0;
        }
        return prevCountdown - 1;
      });

      // 2. Increment match time
      setTotalMatchSeconds((prev) => prev + 1);

      // 3. Increment individual player stats
      setPlayers((prevPlayers) =>
        prevPlayers.map((p) => {
          if (p.status === 'playing') {
            return {
              ...p,
              totalPlayTime: p.totalPlayTime + 1,
              currentShiftTime: p.currentShiftTime + 1,
            };
          }
          if (p.status === 'bench') {
            return {
              ...p,
              totalBenchTime: p.totalBenchTime + 1,
            };
          }
          return p;
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [stage, isPaused, isSubModalOpen]);

  // Stage 1: Attendance handler (Tap X next to kid's name)
  const handleTogglePlayerAbsent = (playerId: string) => {
    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id === playerId) {
          return {
            ...p,
            status: p.status === 'absent' ? 'playing' : 'absent',
          };
        }
        return p;
      })
    );
  };

  // Proceed to Wizard Step 2
  const handleProceedToWizard = () => {
    // If all are marked playing, auto-assign starters vs bench reasonably
    const active = players.filter((p) => p.status !== 'absent');
    if (active.length > 7) {
      // First 7 playing, rest bench
      setPlayers((prev) =>
        prev.map((p, idx) => {
          if (p.status === 'absent') return p;
          return {
            ...p,
            status: idx < 7 ? 'playing' : 'bench',
          };
        })
      );
    }
    setStage('setup');
  };

  // Stage 2: Toggle player status between Pitch and Bench
  const handleUpdatePlayerStatus = (playerId: string, newStatus: 'playing' | 'bench') => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, status: newStatus } : p))
    );
  };

  // Start Game button
  const handleStartGame = () => {
    setSubCountdownSeconds(settings.subIntervalSeconds);
    setShiftNumber(1);
    setTotalMatchSeconds(0);
    setIsPaused(false);
    setIsSubModalOpen(false);

    // Reset current shift times
    setPlayers((prev) =>
      prev.map((p) => ({
        ...p,
        currentShiftTime: 0,
        totalPlayTime: 0,
        totalBenchTime: 0,
        shiftsPlayed: p.status === 'playing' ? 1 : 0,
      }))
    );

    sounds.playWhistle();
    setStage('playing');
  };

  // Confirm "Subs Done"
  const handleConfirmSubs = useCallback(() => {
    const curNextIn = nextInRef.current;
    const curNextOut = nextOutRef.current;

    if (curNextIn.length > 0 && curNextOut.length > 0) {
      setPlayers((prev) =>
        executeRotation(
          prev,
          curNextIn.map((p) => p.id),
          curNextOut.map((p) => p.id)
        )
      );
    }

    sounds.playSubsDoneChime();
    setShiftNumber((prev) => prev + 1);
    setSubCountdownSeconds(settings.subIntervalSeconds);
    setIsSubModalOpen(false);
    setIsPaused(false);
  }, [settings.subIntervalSeconds]);

  // Early manual trigger for sub
  const handleTriggerSubNow = () => {
    sounds.playWhistle();
    sounds.vibrate([200, 100, 200]);
    setIsSubModalOpen(true);
  };

  // Adjust countdown (+30s or -30s)
  const handleAdjustCountdown = (deltaSeconds: number) => {
    setSubCountdownSeconds((prev) => Math.max(0, prev + deltaSeconds));
  };

  // In-Game squad handlers
  // 1. Late arrival: added to end of bench queue
  const handleAddLatePlayer = (name: string, number: number, existingPlayerId?: string) => {
    const maxQueue = Math.max(...players.map((p) => p.queueOrder), 0);

    if (existingPlayerId) {
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === existingPlayerId
            ? {
                ...p,
                status: 'bench',
                queueOrder: maxQueue + 1,
                currentShiftTime: 0,
              }
            : p
        )
      );
    } else {
      const newP: Player = {
        id: `p-${Date.now()}`,
        name,
        number,
        status: 'bench',
        totalPlayTime: 0,
        totalBenchTime: 0,
        currentShiftTime: 0,
        shiftsPlayed: 0,
        queueOrder: maxQueue + 1,
      };
      setPlayers((prev) => [...prev, newP]);
    }
  };

  // 2. Player cannot continue / injured
  const handleRemovePlayerMidGame = (playerId: string, replacementPlayerId?: string) => {
    setPlayers((prev) => {
      return prev.map((p) => {
        if (p.id === playerId) {
          return { ...p, status: 'injured' };
        }
        if (replacementPlayerId && p.id === replacementPlayerId) {
          return { ...p, status: 'playing', currentShiftTime: 0 };
        }
        return p;
      });
    });
  };

  // 3. Quick emergency swap
  const handleManualSwap = (onPitchPlayerId: string, benchPlayerId: string) => {
    setPlayers((prev) => {
      const maxQueue = Math.max(...prev.map((p) => p.queueOrder), 0);
      return prev.map((p) => {
        if (p.id === onPitchPlayerId) {
          return { ...p, status: 'bench', currentShiftTime: 0, queueOrder: maxQueue + 1 };
        }
        if (p.id === benchPlayerId) {
          return { ...p, status: 'playing', currentShiftTime: 0 };
        }
        return p;
      });
    });
  };

  // 4. Reactivate player
  const handleReactivatePlayer = (playerId: string) => {
    const maxQueue = Math.max(...players.map((p) => p.queueOrder), 0);
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === playerId
          ? { ...p, status: 'bench', queueOrder: maxQueue + 1, currentShiftTime: 0 }
          : p
      )
    );
  };

  // Reset Match
  const handleResetMatch = () => {
    if (confirm('Are you sure you want to start a new match? Current timer will be reset.')) {
      setStage('attendance');
      setIsPaused(false);
      setIsSubModalOpen(false);
      setShiftNumber(1);
      setTotalMatchSeconds(0);
      setSubCountdownSeconds(settings.subIntervalSeconds);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top App Header */}
      <Header
        stage={stage}
        soundEnabled={settings.soundEnabled}
        onToggleSound={() =>
          setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))
        }
        onResetMatch={handleResetMatch}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {stage === 'attendance' && (
          <AttendanceStep
            players={players}
            onTogglePlayerAbsent={handleTogglePlayerAbsent}
            onProceedToWizard={handleProceedToWizard}
            onOpenRosterEditor={() => setIsRosterEditorOpen(true)}
          />
        )}

        {stage === 'setup' && (
          <LineupWizardStep
            players={players}
            settings={settings}
            onUpdatePlayerStatus={handleUpdatePlayerStatus}
            onSetSettings={setSettings}
            onBackToAttendance={() => setStage('attendance')}
            onStartGame={handleStartGame}
          />
        )}

        {stage === 'playing' && (
          <ActiveMatch
            players={players}
            settings={settings}
            subCountdownSeconds={subCountdownSeconds}
            totalMatchSeconds={totalMatchSeconds}
            shiftNumber={shiftNumber}
            isPaused={isPaused}
            nextIn={nextIn}
            nextOut={nextOut}
            onTogglePause={() => setIsPaused((prev) => !prev)}
            onAdjustCountdown={handleAdjustCountdown}
            onTriggerSubNow={handleTriggerSubNow}
            onOpenInGameEditor={() => setIsInGameEditorOpen(true)}
            onOpenStats={() => setIsStatsOpen(true)}
          />
        )}
      </main>

      {/* Notification Modal: Who goes off and who goes on when time passes */}
      <SubModal
        isOpen={isSubModalOpen}
        shiftNumber={shiftNumber}
        nextIn={nextIn}
        nextOut={nextOut}
        onConfirmSubs={handleConfirmSubs}
        onOpenInGameEditor={() => setIsInGameEditorOpen(true)}
      />

      {/* In-game squad manager (Late arrival / injury / quick swap) */}
      <InGameSquadModal
        isOpen={isInGameEditorOpen}
        onClose={() => setIsInGameEditorOpen(false)}
        players={players}
        onAddLatePlayer={handleAddLatePlayer}
        onRemovePlayerMidGame={handleRemovePlayerMidGame}
        onManualSwap={handleManualSwap}
        onReactivatePlayer={handleReactivatePlayer}
      />

      {/* Master Roster Editor */}
      <RosterEditorModal
        isOpen={isRosterEditorOpen}
        onClose={() => setIsRosterEditorOpen(false)}
        players={players}
        onSaveRoster={handleSaveRoster}
      />

      {/* Equal Play Time Stats Drawer */}
      <StatsDrawer
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        players={players}
        totalMatchSeconds={totalMatchSeconds}
      />
    </div>
  );
}
export default App;
