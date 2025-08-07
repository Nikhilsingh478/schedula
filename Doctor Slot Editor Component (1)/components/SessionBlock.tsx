import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { X } from 'lucide-react';

export interface Session {
  id: string;
  startTime: string;
  endTime: string;
  duration: string;
}

interface SessionBlockProps {
  session: Session;
  onUpdate: (session: Session) => void;
  onRemove: (id: string) => void;
  hasError?: boolean;
}

export function SessionBlock({ session, onUpdate, onRemove, hasError }: SessionBlockProps) {
  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...session, startTime: e.target.value });
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...session, endTime: e.target.value });
  };

  const handleDurationChange = (value: string) => {
    onUpdate({ ...session, duration: value });
  };

  return (
    <div 
      className={`
        p-6 rounded-xl shadow-sm border-2 transition-all duration-200 
        ${hasError 
          ? 'border-red-300 bg-red-50' 
          : 'border-gray-200 bg-white hover:border-[var(--healthcare-primary)] hover:shadow-md'
        }
      `}
    >
      <div className="flex flex-col lg:flex-row lg:items-end gap-4 lg:gap-6">
        {/* Start Time */}
        <div className="flex-1">
          <Label htmlFor={`start-${session.id}`} className="block mb-2 text-gray-700">
            Start Time
          </Label>
          <Input
            id={`start-${session.id}`}
            type="time"
            value={session.startTime}
            onChange={handleStartTimeChange}
            className={`
              w-full px-4 py-3 rounded-lg border-2 bg-white transition-all duration-200
              focus:ring-2 focus:ring-[var(--healthcare-primary)] focus:border-[var(--healthcare-primary)]
              hover:border-gray-300
              ${hasError ? 'border-red-300' : 'border-gray-200'}
            `}
          />
        </div>

        {/* End Time */}
        <div className="flex-1">
          <Label htmlFor={`end-${session.id}`} className="block mb-2 text-gray-700">
            End Time
          </Label>
          <Input
            id={`end-${session.id}`}
            type="time"
            value={session.endTime}
            onChange={handleEndTimeChange}
            className={`
              w-full px-4 py-3 rounded-lg border-2 bg-white transition-all duration-200
              focus:ring-2 focus:ring-[var(--healthcare-primary)] focus:border-[var(--healthcare-primary)]
              hover:border-gray-300
              ${hasError ? 'border-red-300' : 'border-gray-200'}
            `}
          />
        </div>

        {/* Duration */}
        <div className="flex-1">
          <Label className="block mb-2 text-gray-700">
            Slot Duration
          </Label>
          <Select value={session.duration} onValueChange={handleDurationChange}>
            <SelectTrigger 
              className={`
                w-full px-4 py-3 rounded-lg border-2 bg-white transition-all duration-200
                focus:ring-2 focus:ring-[var(--healthcare-primary)] focus:border-[var(--healthcare-primary)]
                hover:border-gray-300
                ${hasError ? 'border-red-300' : 'border-gray-200'}
              `}
            >
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 mins</SelectItem>
              <SelectItem value="10">10 mins</SelectItem>
              <SelectItem value="15">15 mins</SelectItem>
              <SelectItem value="20">20 mins</SelectItem>
              <SelectItem value="30">30 mins</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Remove Button */}
        <div className="lg:ml-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onRemove(session.id)}
            className="
              w-10 h-10 rounded-lg border-2 border-red-200 text-red-500 
              hover:bg-red-50 hover:border-red-300 transition-all duration-200
            "
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {hasError && (
        <div className="mt-3 text-sm text-red-600">
          Please ensure start time is before end time
        </div>
      )}
    </div>
  );
}