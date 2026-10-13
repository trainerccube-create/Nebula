export type GameScreen = 'BRIEFING' | 'SECTOR_EVENT' | 'BOSS_FIGHT' | 'VICTORY' | 'GAME_OVER';

export interface ShipStats {
  hull: number;
  maxHull: number;
  energy: number;
  maxEnergy: number;
  credits: number;
  level: number;
  score: number;
  shieldOverloaded?: boolean;
  evasionActive?: boolean;
}

export interface EventChoiceOutcome {
  text: string;
  hullChange: number;
  energyChange: number;
  creditsChange: number;
  sfxType?: 'damage' | 'heal' | 'gain' | 'laser' | 'warp' | 'shield';
}

export interface EventChoice {
  id: string;
  label: string;
  detail: string;
  costPreview?: string;
  reqEnergy?: number;
  reqCredits?: number;
  successRate?: number;
  outcomeSuccess: EventChoiceOutcome;
  outcomeFailure?: EventChoiceOutcome;
}

export interface SectorEvent {
  id: string;
  level: number;
  sectorName: string;
  title: string;
  category: 'asteroid' | 'drone' | 'derelict' | 'smuggler' | 'flare' | 'combat' | 'anomaly' | 'outpost';
  narrative: string;
  logTransmission: string;
  choices: EventChoice[];
}

export interface BossState {
  name: string;
  title: string;
  hp: number;
  maxHp: number;
  phase: 1 | 2 | 3;
  nextMove: {
    name: string;
    description: string;
    predictedDamage: number;
    specialEffect?: 'drain_energy' | 'shield_pierce' | 'dark_surge';
  };
  turnCount: number;
  isVulnerable?: boolean;
}

export interface TerminalLogEntry {
  id: string;
  timestamp: string;
  type: 'system' | 'event' | 'combat' | 'warning' | 'gain' | 'damage';
  text: string;
}
