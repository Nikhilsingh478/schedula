"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer, Views, SlotInfo } from 'react-big-calendar';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import moment from 'moment';
import { format, parseISO, addMinutes } from 'date-fns';
import { useNotification } from '../../context/NotificationContext';
import { useModal } from '../../hooks/useModal';
import { API_ENDPOINTS } from '../../lib/config';
import Modal from '../../components/ui/Modal';

// Import calendar styles
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

interface Appointment {
  id: string;
  doctorId: string;
  patientName: string;
  date: string;
  time: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  token: number;
  patientPhone: string;
  patientEmail?: string;
  symptoms?: string;
  doctorName?: string;
  doctorImage?: string;
  createdAt?: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  appointment: Appointment;
  resource?: any;
}

const DoctorCalendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<any>(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const { success, error: showError } = useNotification();
  const { modal, confirm } = useModal();

  // Get current doctor from localStorage
  const getCurrentDoctor = () => {
    if (typeof window !== 'undefined') {
      const doctorData = localStorage.getItem('currentDoctor');
      return doctorData ? JSON.parse(doctorData) : null;
    }
    return null;
  };

  // Fetch appointments from both JSON server and localStorage
  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const currentDoctor = getCurrentDoctor();
      
      if (!currentDoctor) {
        showError('Authentication Error', 'Please login as a doctor to view appointments.');
        return;
      }

      // Fetch from JSON server
      const response = await fetch(API_ENDPOINTS.appointments);
      let serverAppointments: Appointment[] = [];
      
      if (response.ok) {
        serverAppointments = await response.json();
      }

      // Get appointments from localStorage
      const localAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      
      // Combine and filter appointments for current doctor
      const allAppointments = [...serverAppointments, ...localAppointments];
      const doctorAppointments = allAppointments.filter(
        (apt: Appointment) => apt.doctorId === currentDoctor.id
      );

      // Convert appointments to calendar events
      const calendarEvents: CalendarEvent[] = doctorAppointments.map((apt: Appointment) => {
        const startDate = new Date(`${apt.date}T${apt.time}`);
        const endDate = addMinutes(startDate, 30); // 30-minute appointments

        return {
          id: apt.id,
          title: `Patient: ${apt.patientName} | Token #${apt.token}`,
          start: startDate,
          end: endDate,
          appointment: apt,
        };
      });

      setEvents(calendarEvents);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      showError('Loading Error', 'Failed to load appointments. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Filter events based on status
  const filteredEvents = events.filter(event => {
    if (statusFilter === 'all') return true;
    return event.appointment.status === statusFilter;
  });

  // Handle event selection
  const handleEventSelect = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  // Handle appointment rescheduling
  const handleReschedule = async (eventId: string, newStart: Date, newEnd: Date) => {
    try {
      const event = events.find(e => e.id === eventId);
      if (!event) return;

      const updatedAppointment = {
        ...event.appointment,
        date: format(newStart, 'yyyy-MM-dd'),
        time: format(newStart, 'HH:mm'),
      };

      // Update in JSON server
      try {
        await fetch(`${API_ENDPOINTS.appointments}/${eventId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedAppointment),
        });
      } catch (serverError) {
        console.log('Could not update server, but updated locally');
      }

      // Update in localStorage
      const localAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      const updatedLocalAppointments = localAppointments.map((apt: Appointment) =>
        apt.id === eventId ? updatedAppointment : apt
      );
      localStorage.setItem('appointments', JSON.stringify(updatedLocalAppointments));

      // Update local state
      setEvents(prev => prev.map(e => 
        e.id === eventId 
          ? { ...e, start: newStart, end: newEnd, appointment: updatedAppointment }
          : e
      ));

             success('Appointment Rescheduled', `Appointment with ${event.appointment.patientName} has been rescheduled successfully.`);
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      showError('Reschedule Error', 'Failed to reschedule appointment. Please try again.');
    }
  };

  // Handle appointment cancellation
  const handleCancelAppointment = async (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    confirm(
      'Cancel Appointment',
      `Are you sure you want to cancel the appointment with ${event.appointment.patientName}? This action cannot be undone.`,
      async () => {
        try {
          const updatedAppointment = {
            ...event.appointment,
            status: 'cancelled' as const,
          };

          // Update in JSON server
          try {
            await fetch(`${API_ENDPOINTS.appointments}/${eventId}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(updatedAppointment),
            });
          } catch (serverError) {
            console.log('Could not update server, but updated locally');
          }

          // Update in localStorage
          const localAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
          const updatedLocalAppointments = localAppointments.map((apt: Appointment) =>
            apt.id === eventId ? updatedAppointment : apt
          );
          localStorage.setItem('appointments', JSON.stringify(updatedLocalAppointments));

          // Update local state
          setEvents(prev => prev.map(e => 
            e.id === eventId 
              ? { ...e, appointment: updatedAppointment }
              : e
          ));

                     success('Appointment Cancelled', `Appointment with ${event.appointment.patientName} has been cancelled.`);
        } catch (error) {
          console.error('Error cancelling appointment:', error);
          showError('Cancellation Error', 'Failed to cancel appointment. Please try again.');
        }
      }
    );
  };

  // Custom event component with tooltip and cancel button
  const EventComponent = ({ event }: { event: CalendarEvent }) => {
    const [{ isDragging }, drag] = useDrag({
      type: 'APPOINTMENT',
      item: { id: event.id, event },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'confirmed': return 'bg-green-500';
        case 'completed': return 'bg-blue-500';
        case 'cancelled': return 'bg-red-500';
        default: return 'bg-gray-500';
      }
    };

    return (
      <div
        ref={drag}
        className={`relative p-2 rounded-lg cursor-move transition-all duration-200 ${
          isDragging ? 'opacity-50' : 'opacity-100'
        }`}
        style={{
          backgroundColor: event.appointment.status === 'cancelled' ? '#ef4444' : 
                          event.appointment.status === 'completed' ? '#3b82f6' : '#10b981',
          color: 'white',
          fontSize: '12px',
          fontWeight: '500',
        }}
        onClick={() => handleEventSelect(event)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="font-semibold truncate">{event.appointment.patientName}</div>
            <div className="text-xs opacity-90">Token #{event.appointment.token}</div>
            <div className="text-xs opacity-90">
              {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
            </div>
          </div>
          <div className={`w-2 h-2 rounded-full ${getStatusColor(event.appointment.status)} ml-2`} />
        </div>
        
        {event.appointment.status !== 'cancelled' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCancelAppointment(event.id);
            }}
            className="absolute top-1 right-1 w-4 h-4 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs flex items-center justify-center transition-colors"
            title="Cancel Appointment"
          >
            ×
          </button>
        )}
      </div>
    );
  };

  // Custom toolbar component
  const CustomToolbar = (toolbar: any) => {
    const goToToday = () => {
      toolbar.onNavigate('TODAY');
    };

    const goToPrev = () => {
      toolbar.onNavigate('PREV');
    };

    const goToNext = () => {
      toolbar.onNavigate('NEXT');
    };

    const goToView = (newView: string) => {
      toolbar.onView(newView);
    };

    return (
      <div className="flex flex-col md:flex-row items-center justify-between mb-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-[#46C2DE] text-white rounded-lg hover:bg-[#3bb0ca] transition-colors"
          >
            Today
          </button>
          <button
            onClick={goToPrev}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            ‹
          </button>
          <button
            onClick={goToNext}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            ›
          </button>
          <h2 className="text-xl font-semibold text-gray-800 ml-4">
            {toolbar.label}
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#46C2DE] focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => goToView(Views.MONTH)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                toolbar.view === Views.MONTH
                  ? 'bg-white text-[#46C2DE] shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => goToView(Views.WEEK)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                toolbar.view === Views.WEEK
                  ? 'bg-white text-[#46C2DE] shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => goToView(Views.DAY)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                toolbar.view === Views.DAY
                  ? 'bg-white text-[#46C2DE] shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Day
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Handle event drop (rescheduling)
  const handleEventDrop = ({ event, start, end }: any) => {
    handleReschedule(event.id, start, end);
  };

  // Handle event resize (if needed)
  const handleEventResize = ({ event, start, end }: any) => {
    handleReschedule(event.id, start, end);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#46C2DE] mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Appointment Calendar</h1>
            <p className="text-gray-600">Manage and reschedule your appointments with drag-and-drop functionality</p>
          </div>

          {/* Calendar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <Calendar
              localizer={localizer}
              events={filteredEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 600 }}
              view={view}
              onView={setView}
              date={date}
              onNavigate={setDate}
              components={{
                event: EventComponent,
                toolbar: CustomToolbar,
              }}
              
                                            selectable
               popup
              onSelectEvent={handleEventSelect}
                             eventPropGetter={(event: CalendarEvent) => ({
                style: {
                  backgroundColor: event.appointment.status === 'cancelled' ? '#ef4444' : 
                                  event.appointment.status === 'completed' ? '#3b82f6' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                },
              })}
            />
          </div>

          {/* Appointment Details Modal */}
          {selectedEvent && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-6 max-w-md w-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Appointment Details</h3>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Patient Name</label>
                    <p className="text-gray-900">{selectedEvent.appointment.patientName}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Token Number</label>
                    <p className="text-gray-900">#{selectedEvent.appointment.token}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date & Time</label>
                    <p className="text-gray-900">
                      {format(selectedEvent.start, 'EEEE, MMMM d, yyyy')}
                    </p>
                    <p className="text-gray-900">
                      {format(selectedEvent.start, 'HH:mm')} - {format(selectedEvent.end, 'HH:mm')}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone Number</label>
                    <p className="text-gray-900">{selectedEvent.appointment.patientPhone}</p>
                  </div>
                  
                  {selectedEvent.appointment.patientEmail && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900">{selectedEvent.appointment.patientEmail}</p>
                    </div>
                  )}
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      selectedEvent.appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      selectedEvent.appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedEvent.appointment.status.charAt(0).toUpperCase() + selectedEvent.appointment.status.slice(1)}
                    </span>
                  </div>
                  
                  {selectedEvent.appointment.symptoms && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Symptoms</label>
                      <p className="text-gray-900">{selectedEvent.appointment.symptoms}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-3 mt-6">
                  {selectedEvent.appointment.status !== 'cancelled' && (
                    <button
                      onClick={() => {
                        handleCancelAppointment(selectedEvent.id);
                        setSelectedEvent(null);
                      }}
                      className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Cancel Appointment
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Component */}
          <Modal {...modal} />
        </div>
      </div>
    </DndProvider>
  );
};

export default DoctorCalendar; 