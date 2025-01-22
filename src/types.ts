export interface ColorPosition {
  x: number;
  y: number;
  color: string;
  id: string;
}

export interface GameState {
  positions: ColorPosition[];
  selectedColor: string | null;
  gameStarted: boolean;
  startTime: number | null;
  endTime: number | null;
}

export interface HistoryState {
  past: GameState[];
  present: GameState;
  future: GameState[];
}

export interface MemoryTableState {
  size: number;
  numbers: number[];
  revealed: boolean;
  selectedNumbers: number[];
  startTime: number | null;
  endTime: number | null;
  gameStarted: boolean;
}

export type GameType = 'colorFiller' | 'memoryTable';