'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type TimeRemaining = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

export default function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference <= 0) {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({
        days: days.toString().padStart(2, '0'),
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0'),
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-4 md:gap-8 font-display">
      {/* Days */}
      <CountdownSegment value={timeLeft.days} label="DAYS" />
      <span className="text-lg sm:text-3xl md:text-5xl font-black text-white/40 -translate-y-2">:</span>
      {/* Hours */}
      <CountdownSegment value={timeLeft.hours} label="HOURS" />
      <span className="text-lg sm:text-3xl md:text-5xl font-black text-white/40 -translate-y-2">:</span>
      {/* Mins */}
      <CountdownSegment value={timeLeft.minutes} label="MINS" />
      <span className="text-lg sm:text-3xl md:text-5xl font-black text-white/40 -translate-y-2">:</span>
      {/* Secs */}
      <CountdownSegment value={timeLeft.seconds} label="SECS" />
    </div>
  );
}

function CountdownSegment({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      {/* Digits row */}
      <div className="flex overflow-hidden h-9 sm:h-14 md:h-20 items-center justify-center">
        {value.split('').map((char, index) => (
          <Digit key={`${index}-${char}`} char={char} />
        ))}
      </div>
      <span className="text-[10px] tracking-[0.2em] text-gray-500 font-bold uppercase mt-2">
        {label}
      </span>
    </div>
  );
}

function Digit({ char }: { char: string }) {
  return (
    <div className="relative w-4 sm:w-8 md:w-12 h-9 sm:h-14 md:h-20 flex items-center justify-center">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={char}
          initial={{ y: '80%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-80%', opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute text-2xl sm:text-4xl md:text-6xl font-black text-white"
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
