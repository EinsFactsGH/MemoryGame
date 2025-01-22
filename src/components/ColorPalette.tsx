import React from 'react';
import { Square } from 'lucide-react';

interface ColorPaletteProps {
  colors: string[];
  selectedColor: string | null;
  onColorSelect: (color: string) => void;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ colors, selectedColor, onColorSelect }) => {
  return (
    <div className="flex flex-col gap-2 p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">Colors</h3>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onColorSelect(color)}
            className={`p-2 rounded-lg transition-transform ${
              selectedColor === color ? 'scale-110 ring-2 ring-blue-500' : ''
            }`}
          >
            <Square size={32} fill={color} color={color} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorPalette;