import React, { useState, useEffect } from 'react';
import { Timer, HelpCircle } from 'lucide-react';
import { MemoryTableState } from '../types';

interface MemoryTableProps {
  onGameComplete: (time: number) => void;
  onReset: () => void;
}

const MemoryTable: React.FC<MemoryTableProps> = ({ onGameComplete, onReset }) => {
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'expert' | null>(null);
  const [state, setState] = useState<MemoryTableState>({
    size: 0,
    numbers: [],
    revealed: true,
    selectedNumbers: [],
    startTime: null,
    endTime: null,
    gameStarted: false,
  });
  const [showHelp, setShowHelp] = useState(false);
  const [helpCount, setHelpCount] = useState(3); // Give user 3 helps per game

  const getDifficultySize = (diff: string): number => {
    switch (diff) {
      case 'beginner': return 2;
      case 'intermediate': return 3;
      case 'expert': return 4;
      default: return 2;
    }
  };

  const initializeGame = (diff: 'beginner' | 'intermediate' | 'expert') => {
    const size = getDifficultySize(diff);
    const totalCells = size * size;
    const numbers = Array.from({ length: totalCells }, (_, i) => i + 1)
      .sort(() => Math.random() - 0.5);

    setDifficulty(diff);
    setHelpCount(3); // Reset help count for new game
    setState({
      size,
      numbers,
      revealed: true,
      selectedNumbers: [],
      startTime: null,
      endTime: null,
      gameStarted: false,
    });

    // Hide numbers after 5 seconds and start the game
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        revealed: false,
        startTime: Date.now(),
        gameStarted: true,
      }));
    }, 5000);
  };

  const handleCellClick = (index: number) => {
    if (!state.gameStarted || state.revealed) return;

    const number = state.numbers[index];
    const expectedNumber = state.selectedNumbers.length + 1;

    if (number === expectedNumber) {
      const newSelectedNumbers = [...state.selectedNumbers, number];
      
      if (newSelectedNumbers.length === state.numbers.length) {
        // Game completed
        const endTime = Date.now();
        setState(prev => ({ ...prev, endTime, gameStarted: false }));
        onGameComplete(endTime - (state.startTime || 0));
      } else {
        setState(prev => ({ ...prev, selectedNumbers: newSelectedNumbers }));
      }
    } else {
      // Wrong number selected, reset the game
      setState(prev => ({
        ...prev,
        selectedNumbers: [],
      }));
    }
  };

  const handleHelp = () => {
    if (helpCount > 0 && state.gameStarted && !state.revealed) {
      setShowHelp(true);
      setHelpCount(prev => prev - 1);
      
      // Hide numbers after 2 seconds
      setTimeout(() => {
        setShowHelp(false);
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {!difficulty ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center mb-6">Select Difficulty</h2>
          <div className="flex flex-col gap-3">
            {['beginner', 'intermediate', 'expert'].map((diff) => (
              <button
                key={diff}
                onClick={() => initializeGame(diff as 'beginner' | 'intermediate' | 'expert')}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors capitalize w-48"
              >
                {diff} ({getDifficultySize(diff)}x{getDifficultySize(diff)})
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          {state.revealed && (
            <div className="flex items-center gap-2 text-lg font-medium">
              <Timer className="animate-pulse" />
              <span>Memorize the numbers! Game starts in 5 seconds...</span>
            </div>
          )}
          
          <div className="flex flex-col items-center gap-4">
            {state.gameStarted && !state.revealed && (
              <div className="flex items-center gap-4">
                <button
                  onClick={handleHelp}
                  disabled={helpCount === 0}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    helpCount > 0
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <HelpCircle size={20} />
                  Help ({helpCount} left)
                </button>
              </div>
            )}
            
            <div
              className="grid gap-4 bg-white p-6 rounded-lg shadow-lg"
              style={{
                gridTemplateColumns: `repeat(${state.size}, minmax(0, 1fr))`,
              }}
            >
              {state.numbers.map((number, index) => (
                <button
                  key={index}
                  onClick={() => handleCellClick(index)}
                  className={`
                    w-20 h-20 text-2xl font-bold rounded-lg
                    ${state.revealed || showHelp ? 'bg-blue-100' : 'bg-white'}
                    ${state.selectedNumbers.includes(number) ? 'bg-green-100' : ''}
                    border-2 border-gray-200 hover:border-blue-500
                    transition-colors duration-200
                  `}
                  disabled={state.revealed || !state.gameStarted}
                >
                  {state.revealed || showHelp || state.selectedNumbers.includes(number) ? number : ''}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setDifficulty(null);
                setState({
                  size: 0,
                  numbers: [],
                  revealed: true,
                  selectedNumbers: [],
                  startTime: null,
                  endTime: null,
                  gameStarted: false,
                });
                onReset();
              }}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Reset Game
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MemoryTable;