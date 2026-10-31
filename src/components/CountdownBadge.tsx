import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

interface CountdownBadgeProps {
  endTime: string;
  startTime?: string;
}

export const CountdownBadge: React.FC<CountdownBadgeProps> = ({ endTime, startTime }) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; expired: boolean; totalMinutes: number }>({
    hours: 0,
    minutes: 0,
    expired: false,
    totalMinutes: 0
  });

  useEffect(() => {
    const calculateTime = () => {
      const end = new Date(endTime).getTime();
      const now = new Date().getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, expired: true, totalMinutes: 0 });
        return;
      }

      const totalMinutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft({ hours, minutes, expired: false, totalMinutes });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [endTime]);

  if (timeLeft.expired) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
        <Clock className="w-3.5 h-3.5" />
        Pickup Window Closed
      </span>
    );
  }

  // < 60 minutes remaining: Red pulsing urgent badge
  if (timeLeft.totalMinutes < 60) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-300 shadow-sm animate-pulse">
        <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
        Closes in {timeLeft.minutes}m (Urgent!)
      </span>
    );
  }

  // 1 to 3 hours remaining: Amber warning badge
  if (timeLeft.totalMinutes < 180) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
        <Clock className="w-3.5 h-3.5 text-amber-600" />
        Closes in {timeLeft.hours}h {timeLeft.minutes}m
      </span>
    );
  }

  // Normal > 3 hours: Emerald badge
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
      <Clock className="w-3.5 h-3.5 text-emerald-600" />
      Closes in {timeLeft.hours}h {timeLeft.minutes}m
    </span>
  );
};

