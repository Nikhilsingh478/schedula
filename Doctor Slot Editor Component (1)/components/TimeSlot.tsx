import React from 'react';

interface TimeSlotProps {
  startTime: string;
  endTime: string;
}

export function TimeSlot({ startTime, endTime }: TimeSlotProps) {
  return (
    <div className="
      inline-block px-3 py-2 m-1 bg-[var(--healthcare-secondary)] 
      border border-[var(--healthcare-primary)]/20 rounded-lg 
      text-sm text-gray-700 transition-all duration-200
      hover:bg-[var(--healthcare-primary)]/10 hover:border-[var(--healthcare-primary)]/30
    ">
      {startTime} – {endTime}
    </div>
  );
}