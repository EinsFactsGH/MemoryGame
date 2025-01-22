import React from 'react';
import { Undo2, Redo2, Play, RotateCcw } from 'lucide-react';

interface GameControlsProps {
  onUndo: () => void;
  onRedo: () => void;
  onStart: () => void;
  onReset: () => void;
  canUndo: boolean;
  canRedo: boolean;
  gameStarted: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  onUndo,
  onRedo,
  onStart,
  onReset,
  canUndo,
  canRedo,
  gameStarted,
}) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="p-2 bg-white rounded-lg shadow-md disabled:opacity-50 hover:bg-gray-50"
        title="Undo"
      >
        <Undo2 size={24} />
      </button>
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className="p-2 bg-white rounded-lg shadow-md disabled:opacity-50 hover:bg-gray-50"
        title="Redo"
      >
        <Redo2 size={24} />
      </button>
      {!gameStarted ? (
        <button
          onClick={onStart}
          className="p-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 flex items-center gap-2"
        >
          <Play size={24} /> Start Game
        </button>
      ) : (
        <button
          onClick={onReset}
          className="p-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 flex items-center gap-2"
        >
          <RotateCcw size={24} /> Reset
        </button>
      )}
    </div>
  );
};

export default GameControls;