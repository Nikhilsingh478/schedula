import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { SessionBlock, Session } from './SessionBlock';
import { TimeSlot } from './TimeSlot';
import { Plus, Calendar } from 'lucide-react';

interface GeneratedSlot {
  startTime: string;
  endTime: string;
  sessionId: string;
}

export function DoctorSlotEditor() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [generatedSlots, setGeneratedSlots] = useState<GeneratedSlot[]>([]);
  const [showSlots, setShowSlots] = useState(false);

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
    setSessions(sessions.map(session => 
      session.id === updatedSession.id ? updatedSession : session
    ));
  };

  const removeSession = (sessionId: string) => {
    setSessions(sessions.filter(session => session.id !== sessionId));
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
        
        for (let current = startMinutes; current + durationMinutes <= endMinutes; current += durationMinutes) {
          newGeneratedSlots.push({
            startTime: formatTime12Hour(minutesToTime(current)),
            endTime: formatTime12Hour(minutesToTime(current + durationMinutes)),
            sessionId: session.id
          });
        }
      }
    });
    
    setGeneratedSlots(newGeneratedSlots);
    setShowSlots(true);
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
          className="
            w-full lg:w-auto px-6 py-3 bg-[var(--healthcare-primary)] text-white 
            rounded-xl shadow-lg hover:bg-[var(--healthcare-primary-dark)] 
            hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2
          "
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
            className="
              w-full py-4 bg-[var(--healthcare-primary)] text-white 
              rounded-xl shadow-lg hover:bg-[var(--healthcare-primary-dark)] 
              hover:shadow-xl transition-all duration-200 disabled:bg-gray-400 
              disabled:cursor-not-allowed flex items-center justify-center gap-2
            "
          >
            <Calendar className="h-5 w-5" />
            Finalize Sessions
          </Button>
        </div>
      )}

      {/* Generated Slots */}
      {showSlots && generatedSlots.length > 0 && (
        <Card className="bg-white rounded-xl shadow-lg border-2 border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Calendar className="h-5 w-5 text-[var(--healthcare-primary)]" />
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
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {sessions.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-[var(--healthcare-secondary)] rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-[var(--healthcare-primary)]" />
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