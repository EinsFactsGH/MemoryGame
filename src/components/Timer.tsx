import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  startTime: number | null;
  endTime: number | null;
}

const Timer: React.FC<TimerProps> = ({ startTime, endTime }) => {
  const [elapsed, setElapsed] = useState<number>(0);

  useEffect(() => {
    if (!startTime || endTime) return;

    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, endTime]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-md">
      <Clock size={24} />
      <span className="font-mono text-xl">{formatTime(elapsed)}</span>
    </div>
  );
};

export default Timer;