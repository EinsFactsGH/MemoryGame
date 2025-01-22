import React from 'react';
import { TowerControl as GameController, Palette } from 'lucide-react';
import { GameType } from '../types';

interface GameSelectionProps {
  onSelectGame: (game: GameType) => void;
}

const GameSelection: React.FC<GameSelectionProps> = ({ onSelectGame }) => {
  const games = [
    {
      id: 'colorFiller',
      name: 'Color Filler',
      description: 'Fill in the colors in the correct positions',
      icon: Palette,
    },
    {
      id: 'memoryTable',
      name: 'Memory Table',
      description: 'Remember and click numbers in sequence',
      icon: GameController,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-12">Choose a Game</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {games.map((game) => (
          <button
            key={game.id}
            onClick={() => onSelectGame(game.id as GameType)}
            className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow group"
          >
            <div className="flex flex-col items-center gap-4">
              <game.icon size={48} className="text-blue-500 group-hover:scale-110 transition-transform" />
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">{game.name}</h2>
                <p className="text-gray-600">{game.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default GameSelection;