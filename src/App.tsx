import React, { useState } from 'react';
import { GameType } from './types';
import GameSelection from './components/GameSelection';
import ColorFillerGame from './components/ColorFillerGame';
import MemoryTable from './components/MemoryTable';

function App() {
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);
  const [completionTime, setCompletionTime] = useState<number | null>(null);

  const handleGameComplete = (time: number) => {
    setCompletionTime(time);
    setShowCompletionMessage(true);
  };

  const handleReset = () => {
    setShowCompletionMessage(false);
    setCompletionTime(null);
  };

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {showCompletionMessage && completionTime && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Congratulations! 🎉</h2>
            <p className="text-lg mb-4">
              You completed the game in{' '}
              <span className="font-bold">{formatTime(completionTime)}</span>
            </p>
            <button
              onClick={() => {
                handleReset();
                setSelectedGame(null);
              }}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
            >
              Play Another Game
            </button>
          </div>
        </div>
      )}

      {!selectedGame ? (
        <GameSelection onSelectGame={setSelectedGame} />
      ) : (
        <div className="p-8">
          <button
            onClick={() => setSelectedGame(null)}
            className="mb-8 px-4 py-2 text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-2"
          >
            ← Back to Games
          </button>

          {selectedGame === 'colorFiller' ? (
            <ColorFillerGame onGameComplete={handleGameComplete} onReset={handleReset} />
          ) : (
            <MemoryTable onGameComplete={handleGameComplete} onReset={handleReset} />
          )}
        </div>
      )}
    </div>
  );
}

export default App;