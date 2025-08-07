"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Calendar, X, Clock } from 'lucide-react';
import { storageUtils } from '@/lib/storage';

export interface Session {
  id: string;
  startTime: string;
  endTime: string;
  duration: string;
}

interface GeneratedSlot {
  startTime: string;
  endTime: string;
  sessionId: string;
  slotId: string;
  capacity: number;
  bookedCount: number;
  patients: string[];
}

interface DoctorSlotEditorProps {
  doctorId?: string;
  onSlotsGenerated?: (slots: string[]) => void;
}

export function DoctorSlotEditor({ doctorId, onSlotsGenerated }: DoctorSlotEditorProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [generatedSlots, setGeneratedSlots] = useState<GeneratedSlot[]>([]);
  const [showSlots, setShowSlots] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load existing sessions from localStorage on component mount
  useEffect(() => {
    if (doctorId) {
      const savedSessions = localStorage.getItem(`doctor_sessions_${doctorId}`);
      if (savedSessions) {
        try {
          const parsedSessions = JSON.parse(savedSessions);
          setSessions(parsedSessions);
        } catch (error) {
          console.error('Error loading saved sessions:', error);
        }
      }
    }
  }, [doctorId]);

  const addSession = () => {
    const newSession: Session = {
      id: `session-${Date.now()}`,
      startTime: '',
      endTime: '',
      duration: '15'
    };
    setSessions([...sessions, newSession]);
  };

  const updateSession = (updatedSession: Session) => {
    const updatedSessions = sessions.map(session => 
      session.id === updatedSession.id ? updatedSession : session
    );
    setSessions(updatedSessions);
    
    // Save to localStorage
    if (doctorId) {
      localStorage.setItem(`doctor_sessions_${doctorId}`, JSON.stringify(updatedSessions));
    }
  };

  const removeSession = (sessionId: string) => {
    const updatedSessions = sessions.filter(session => session.id !== sessionId);
    setSessions(updatedSessions);
    
    // Save to localStorage
    if (doctorId) {
      localStorage.setItem(`doctor_sessions_${doctorId}`, JSON.stringify(updatedSessions));
    }
    
    // Clear generated slots if we remove sessions
    if (showSlots) {
      setShowSlots(false);
      setGeneratedSlots([]);
    }
  };

  const validateSession = (session: Session): boolean => {
    if (!session.startTime || !session.endTime) return false;
    return session.startTime < session.endTime;
  };

  const timeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const formatTime12Hour = (time24: string): string => {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const generateSlots = () => {
    const newGeneratedSlots: GeneratedSlot[] = [];
    
    sessions.forEach(session => {
      if (validateSession(session)) {
        const startMinutes = timeToMinutes(session.startTime);
        const endMinutes = timeToMinutes(session.endTime);
        const durationMinutes = parseInt(session.duration);
        
        // Calculate capacity based on slot duration
        let capacity: number;
        switch (durationMinutes) {
          case 10:
            capacity = 6; // 6 patients per hour (10 min slots)
            break;
          case 15:
            capacity = 4; // 4 patients per hour (15 min slots)
            break;
          case 30:
            capacity = 2; // 2 patients per hour (30 min slots)
            break;
          case 60:
            capacity = 1; // 1 patient per hour (60 min slots)
            break;
          default:
            capacity = 4; // Default to 4 for other durations
        }
        
        for (let current = startMinutes; current + durationMinutes <= endMinutes; current += durationMinutes) {
          const slotId = `slot_${session.id}_${current}`;
          newGeneratedSlots.push({
            startTime: formatTime12Hour(minutesToTime(current)),
            endTime: formatTime12Hour(minutesToTime(current + durationMinutes)),
            sessionId: session.id,
            slotId: slotId,
            capacity: capacity,
            bookedCount: 0,
            patients: []
          });
        }
      }
    });
    
    setGeneratedSlots(newGeneratedSlots);
    setShowSlots(true);
  };

  const saveSlotsToSystem = async () => {
    if (!doctorId || generatedSlots.length === 0) return;
    
    setIsSaving(true);
    try {
      // Convert slots to the format expected by the booking system
      const slotTimes = generatedSlots.map(slot => slot.startTime);
      
      // Save to localStorage for the booking system
      localStorage.setItem(`doctor_slots_${doctorId}`, JSON.stringify(slotTimes));
      
      // Save the full slot data with capacity and booking info
      localStorage.setItem(`doctor_full_slots_${doctorId}`, JSON.stringify(generatedSlots));
      
      // Save session data for calendar integration
      localStorage.setItem(`doctor_sessions_${doctorId}`, JSON.stringify(sessions));
      
      // Notify parent component if callback provided
      if (onSlotsGenerated) {
        onSlotsGenerated(slotTimes);
      }
      
      console.log('✅ Slots saved successfully:', slotTimes);
      console.log('✅ Full slot data saved:', generatedSlots);
      alert('Time slots saved successfully! Patients can now book these slots.');
    } catch (error) {
      console.error('Error saving slots:', error);
      alert('Failed to save slots. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const canFinalize = sessions.length > 0 && sessions.every(validateSession);

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">
          Set Your Daily Sessions
        </h1>
        <p className="text-gray-600">
          Define your availability and slot durations for patient appointments
        </p>
      </div>

      {/* Add Session Button */}
      <div className="mb-6">
        <Button
          onClick={addSession}
          className="w-full lg:w-auto px-6 py-3 bg-[#46C2DE] text-white rounded-xl shadow-lg hover:bg-[#3bb0ca] hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Session
        </Button>
      </div>

      {/* Sessions */}
      <div className="space-y-4 mb-8">
        {sessions.map(session => (
          <SessionBlock
            key={session.id}
            session={session}
            onUpdate={updateSession}
            onRemove={removeSession}
            hasError={!validateSession(session) && (session.startTime !== '' || session.endTime !== '')}
          />
        ))}
      </div>

      {/* Finalize Button */}
      {sessions.length > 0 && (
        <div className="mb-8">
          <Button
            onClick={generateSlots}
            disabled={!canFinalize}
            className="w-full py-4 bg-[#46C2DE] text-white rounded-xl shadow-lg hover:bg-[#3bb0ca] hover:shadow-xl transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Calendar className="h-5 w-5" />
            Generate Time Slots
          </Button>
        </div>
      )}

      {/* Generated Slots */}
      {showSlots && generatedSlots.length > 0 && (
        <Card className="bg-white rounded-xl shadow-lg border-2 border-gray-200 mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Calendar className="h-5 w-5 text-[#46C2DE]" />
              Generated Time Slots
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sessions.map(session => {
              const sessionSlots = generatedSlots.filter(slot => slot.sessionId === session.id);
              if (sessionSlots.length === 0) return null;
              
              return (
                <div key={session.id} className="mb-6 last:mb-0">
                  <h3 className="text-lg font-medium text-gray-700 mb-3">
                    Session: {formatTime12Hour(session.startTime)} - {formatTime12Hour(session.endTime)}
                    <span className="text-sm text-gray-500 ml-2">
                      ({session.duration} min slots)
                    </span>
                  </h3>
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex flex-wrap -m-1">
                      {sessionSlots.map((slot, index) => (
                        <TimeSlot
                          key={`${slot.sessionId}-${index}`}
                          startTime={slot.startTime}
                          endTime={slot.endTime}
                          capacity={slot.capacity}
                          bookedCount={slot.bookedCount}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Save Button */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <Button
                onClick={saveSlotsToSystem}
                disabled={isSaving}
                className="w-full py-3 bg-green-600 text-white rounded-xl shadow-lg hover:bg-green-700 hover:shadow-xl transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Clock className="h-5 w-5" />
                {isSaving ? 'Saving...' : 'Save Slots for Patients'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {sessions.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-[#E8F8FC] rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-[#46C2DE]" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            No sessions added yet
          </h3>
          <p className="text-gray-500 mb-4">
            Click "Add Session" to start defining your availability
          </p>
        </div>
      )}
    </div>
  );
}

// SessionBlock Component
interface SessionBlockProps {
  session: Session;
  onUpdate: (session: Session) => void;
  onRemove: (id: string) => void;
  hasError?: boolean;
}

function SessionBlock({ session, onUpdate, onRemove, hasError }: SessionBlockProps) {
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
          : 'border-gray-200 bg-white hover:border-[#46C2DE] hover:shadow-md'
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
              focus:ring-2 focus:ring-[#46C2DE] focus:border-[#46C2DE]
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
              focus:ring-2 focus:ring-[#46C2DE] focus:border-[#46C2DE]
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
                focus:ring-2 focus:ring-[#46C2DE] focus:border-[#46C2DE]
                hover:border-gray-300
                ${hasError ? 'border-red-300' : 'border-gray-200'}
              `}
            >
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="45">45 minutes</SelectItem>
              <SelectItem value="60">1 hour</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Remove Button */}
        <div className="flex-shrink-0">
          <Button
            onClick={() => onRemove(session.id)}
            variant="outline"
            className="px-3 py-3 text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 transition-all duration-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {hasError && (
        <p className="text-red-600 text-sm mt-2">
          Please ensure end time is after start time
        </p>
      )}
    </div>
  );
}

// TimeSlot Component
interface TimeSlotProps {
  startTime: string;
  endTime: string;
  capacity?: number;
  bookedCount?: number;
}

function TimeSlot({ startTime, endTime, capacity = 4, bookedCount = 0 }: TimeSlotProps) {
  const isFull = bookedCount >= capacity;
  
  return (
    <div className={`
      inline-block px-3 py-2 m-1 rounded-lg 
      text-sm transition-all duration-200
      ${isFull 
        ? 'bg-red-100 border border-red-300 text-red-700' 
        : 'bg-[#E8F8FC] border border-[#46C2DE]/20 text-gray-700 hover:bg-[#46C2DE]/10 hover:border-[#46C2DE]/30'
      }
    `}>
      <div className="font-medium">{startTime} – {endTime}</div>
      <div className="text-xs opacity-75">
        {bookedCount}/{capacity} booked
      </div>
    </div>
  );
} 