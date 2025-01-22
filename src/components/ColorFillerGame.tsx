import React, { useReducer, useState, useEffect } from 'react';
import { ColorPosition, GameState, HistoryState } from '../types';
import ColorPalette from './ColorPalette';
import GameControls from './GameControls';
import Timer from './Timer';
import { Image, HelpCircle } from 'lucide-react';

const IMAGES = [
  {
    id: 'butterfly',
    name: 'Butterfly',
    positions: [
      { id: '1', x: 100, y: 100, color: '#FF0000' },
      { id: '2', x: 200, y: 100, color: '#00FF00' },
      { id: '3', x: 300, y: 100, color: '#0000FF' },
      { id: '4', x: 100, y: 200, color: '#FFFF00' },
      { id: '5', x: 200, y: 200, color: '#FF00FF' },
    ],
  },
  {
    id: 'flower',
    name: 'Flower',
    positions: [
      { id: '1', x: 150, y: 150, color: '#FF1493' },
      { id: '2', x: 250, y: 150, color: '#32CD32' },
      { id: '3', x: 350, y: 150, color: '#4169E1' },
      { id: '4', x: 150, y: 250, color: '#FFD700' },
      { id: '5', x: 250, y: 250, color: '#8A2BE2' },
    ],
  },
];

type Action =
  | { type: 'SET_COLOR'; payload: { id: string; color: string } }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'START_GAME'; payload: ColorPosition[] }
  | { type: 'END_GAME' }
  | { type: 'REVEAL_HINT' };

const historyInitialState: HistoryState = {
  past: [],
  present: {
    positions: [],
    selectedColor: null,
    gameStarted: false,
    startTime: null,
    endTime: null,
  },
  future: [],
};

const gameReducer = (state: HistoryState, action: Action): HistoryState => {
  switch (action.type) {
    case 'SET_COLOR': {
      const newPresent: GameState = {
        ...state.present,
        positions: state.present.positions.map((pos) =>
          pos.id === action.payload.id ? { ...pos, color: action.payload.color } : pos
        ),
      };

      return {
        past: [...state.past, state.present],
        present: newPresent,
        future: [],
      };
    }
    case 'UNDO': {
      if (state.past.length === 0) return state;

      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, -1);

      return {
        past: newPast,
        present: previous,
        future: [state.present, ...state.future],
      };
    }
    case 'REDO': {
      if (state.future.length === 0) return state;

      const next = state.future[0];
      const newFuture = state.future.slice(1);

      return {
        past: [...state.past, state.present],
        present: next,
        future: newFuture,
      };
    }
    case 'START_GAME': {
      return {
        past: [],
        present: {
          positions: action.payload,
          selectedColor: null,
          gameStarted: true,
          startTime: Date.now(),
          endTime: null,
        },
        future: [],
      };
    }
    case 'END_GAME': {
      return {
        ...state,
        present: {
          ...state.present,
          endTime: Date.now(),
          gameStarted: false,
        },
      };
    }
    case 'REVEAL_HINT': {
      const uncoloredPositions = state.present.positions.filter(pos => !pos.color);
      if (uncoloredPositions.length === 0) return state;

      const randomPosition = uncoloredPositions[Math.floor(Math.random() * uncoloredPositions.length)];
      const originalImage = IMAGES.find(img => img.positions.some(pos => pos.id === randomPosition.id));
      const originalPosition = originalImage?.positions.find(pos => pos.id === randomPosition.id);

      if (!originalPosition) return state;

      const newPresent: GameState = {
        ...state.present,
        positions: state.present.positions.map(pos =>
          pos.id === randomPosition.id ? { ...pos, color: originalPosition.color } : pos
        ),
      };

      return {
        past: [...state.past, state.present],
        present: newPresent,
        future: [],
      };
    }
    default:
      return state;
  }
};

interface ColorFillerGameProps {
  onGameComplete: (time: number) => void;
  onReset: () => void;
}

const ColorFillerGame: React.FC<ColorFillerGameProps> = ({ onGameComplete, onReset }) => {
  const [state, dispatch] = useReducer(gameReducer, historyInitialState);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    if (!state.present.gameStarted || state.present.endTime) return;

    const isComplete = state.present.positions.every((pos) => pos.color !== '');
    if (isComplete) {
      const image = IMAGES.find((img) => img.id === selectedImage);
      const isCorrect = state.present.positions.every((pos) => {
        const originalPos = image?.positions.find((p) => p.id === pos.id);
        return originalPos?.color === pos.color;
      });

      if (isCorrect) {
        dispatch({ type: 'END_GAME' });
        onGameComplete(Date.now() - (state.present.startTime || 0));
      }
    }
  }, [state.present.positions, selectedImage, state.present.gameStarted, state.present.endTime]);

  const handleImageSelect = (imageId: string) => {
    const image = IMAGES.find((img) => img.id === imageId);
    if (!image) return;

    setSelectedImage(imageId);
    dispatch({ type: 'START_GAME', payload: image.positions.map(pos => ({ ...pos, color: '' })) });
    setShowPreview(true);
    
    setTimeout(() => {
      setShowPreview(false);
    }, 5000);
  };

  const handleColorSelect = (color: string) => {
    if (!state.present.gameStarted) return;
    const newState = { ...state.present, selectedColor: color };
    dispatch({ type: 'SET_COLOR', payload: { id: '', color } });
  };

  const handlePositionClick = (id: string) => {
    if (!state.present.selectedColor || !state.present.gameStarted) return;
    dispatch({
      type: 'SET_COLOR',
      payload: { id, color: state.present.selectedColor },
    });
  };

  const handleHint = () => {
    dispatch({ type: 'REVEAL_HINT' });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Color Filler Game</h1>
      
      {!selectedImage ? (
        <div className="grid grid-cols-2 gap-4">
          {IMAGES.map((image) => (
            <button
              key={image.id}
              onClick={() => handleImageSelect(image.id)}
              className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-2 justify-center">
                <Image size={24} />
                <span className="text-lg font-medium">{image.name}</span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Timer
              startTime={state.present.startTime}
              endTime={state.present.endTime}
            />
            <GameControls
              onUndo={() => dispatch({ type: 'UNDO' })}
              onRedo={() => dispatch({ type: 'REDO' })}
              onStart={() => setShowPreview(false)}
              onReset={() => {
                setSelectedImage(null);
                onReset();
              }}
              canUndo={state.past.length > 0}
              canRedo={state.future.length > 0}
              gameStarted={state.present.gameStarted}
            />
          </div>

          <div className="flex gap-6">
            <div className="flex-1">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <svg width="400" height="300" className="w-full h-auto">
                  {state.present.positions.map((pos) => (
                    <circle
                      key={pos.id}
                      cx={pos.x}
                      cy={pos.y}
                      r="20"
                      fill={showPreview ? IMAGES.find(img => img.id === selectedImage)?.positions.find(p => p.id === pos.id)?.color || 'white' : pos.color || 'white'}
                      stroke="black"
                      strokeWidth="2"
                      onClick={() => handlePositionClick(pos.id)}
                      className="cursor-pointer"
                    />
                  ))}
                </svg>
              </div>
            </div>

            <div className="w-64 space-y-4">
              <ColorPalette
                colors={Array.from(new Set(IMAGES.find(img => img.id === selectedImage)?.positions.map(pos => pos.color) || []))}
                selectedColor={state.present.selectedColor}
                onColorSelect={handleColorSelect}
              />
              
              <button
                onClick={handleHint}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                <HelpCircle size={20} />
                Get Hint
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorFillerGame;