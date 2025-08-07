"use client"

import type React from "react"

import { useState, useCallback, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CalendarIcon, ChevronLeft, ChevronRight, X, User, Clock, Phone, FileText } from "lucide-react"
import { API_ENDPOINTS } from "@/lib/config"
import { notificationUtils } from "@/lib/storage"

// Types
interface Appointment {
  id: number
  patientName: string
  doctorName: string
  startTime: string
  endTime: string
  day: string
  date: string
  type: string
  phone: string
  notes: string
  status: "Confirmed" | "Cancelled" | "Pending"
}

// Mock appointment data
const initialAppointments: Appointment[] = [
  {
    id: 1,
    patientName: "John Smith",
    doctorName: "Dr. Sarah Johnson",
    startTime: "09:00",
    endTime: "10:00",
    day: "Monday",
    date: "2024-01-08",
    type: "Consultation",
    phone: "+1 (555) 123-4567",
    notes: "Regular checkup and blood pressure monitoring",
    status: "Confirmed",
  },
  {
    id: 2,
    patientName: "Emma Davis",
    doctorName: "Dr. Michael Chen",
    startTime: "10:00",
    endTime: "11:00",
    day: "Monday",
    date: "2024-01-08",
    type: "Follow-up",
    phone: "+1 (555) 234-5678",
    notes: "Post-surgery follow-up appointment",
    status: "Confirmed",
  },
  {
    id: 3,
    patientName: "Robert Wilson",
    doctorName: "Dr. Sarah Johnson",
    startTime: "14:00",
    endTime: "15:00",
    day: "Tuesday",
    date: "2024-01-09",
    type: "Consultation",
    phone: "+1 (555) 345-6789",
    notes: "Initial consultation for back pain",
    status: "Pending",
  },
  {
    id: 4,
    patientName: "Lisa Anderson",
    doctorName: "Dr. Michael Chen",
    startTime: "11:00",
    endTime: "12:00",
    day: "Wednesday",
    date: "2024-01-10",
    type: "Treatment",
    phone: "+1 (555) 456-7890",
    notes: "Physical therapy session",
    status: "Confirmed",
  },
  {
    id: 5,
    patientName: "David Brown",
    doctorName: "Dr. Sarah Johnson",
    startTime: "16:00",
    endTime: "17:00",
    day: "Thursday",
    date: "2024-01-11",
    type: "Emergency",
    phone: "+1 (555) 567-8901",
    notes: "Urgent care appointment",
    status: "Confirmed",
  },
]

// Time slots from 8 AM to 5 PM
  // Time slots matching the booking system
  const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

// Helper functions for date navigation
const getWeekDates = (startDate: Date): Date[] => {
  const dates: Date[] = []
  const start = new Date(startDate)
  start.setDate(start.getDate() - start.getDay()) // Start from Sunday
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    dates.push(date)
  }
  return dates
}

const formatWeekRange = (startDate: Date): string => {
  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + 6)
  
  const startFormatted = startDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })
  const endFormatted = endDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })
  
  return `${startFormatted} - ${endFormatted}`
}

const getDayName = (date: Date): string => {
  return daysOfWeek[date.getDay()]
}

const formatDateForAPI = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

// Mock API functions
const mockUpdateAppointment = async (appointmentId: number, newDay: string, newTime: string) => {
  console.log(`Updating appointment ${appointmentId} to ${newDay} at ${newTime}`)
  await new Promise((resolve) => setTimeout(resolve, 500))
  return { success: true }
}

const mockCancelAppointment = async (appointmentId: number) => {
  console.log(`Cancelling appointment ${appointmentId}`)
  await new Promise((resolve) => setTimeout(resolve, 300))
  return { success: true }
}

const mockRescheduleAppointment = async (appointmentId: number, newDateTime: { day: string; time: string }) => {
  console.log(`Rescheduling appointment ${appointmentId} to ${newDateTime.day} at ${newDateTime.time}`)
  await new Promise((resolve) => setTimeout(resolve, 500))
  return { success: true }
}

// Appointment Block Component
const AppointmentBlock = ({
  appointment,
  onCancel,
  onDragStart,
  isDragging = false,
  isCompact = false,
}: {
  appointment: Appointment
  onCancel: (id: number) => void
  onDragStart: (e: React.DragEvent) => void
  isDragging?: boolean
  isCompact?: boolean
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`bg-[#46C2DE] text-white rounded-md shadow-sm hover:bg-[#3bb0ca] transition-colors cursor-move relative group border border-[#46C2DE] ${
              isCompact 
                ? "p-1 min-h-[30px]" 
                : "p-2 min-h-[60px]"
            } ${
              isDragging ? "opacity-50 scale-95" : ""
            }`}
            draggable
            onDragStart={onDragStart}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className={`font-medium truncate ${
                  isCompact ? "text-xs" : "text-sm"
                }`}>
                  {appointment.patientName}
                </p>
                {!isCompact && (
                  <p className="text-xs opacity-90">{appointment.startTime}</p>
                )}
              </div>
              <Button
                size="sm"
                variant="ghost"
                className={`text-white hover:bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity absolute top-1 right-1 ${
                  isCompact ? "h-4 w-4 p-0" : "h-5 w-5 p-0"
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  onCancel(appointment.id)
                }}
              >
                <X className={isCompact ? "h-2 w-2" : "h-3 w-3"} />
              </Button>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs bg-gray-900 text-white border-gray-700">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="font-medium">{appointment.patientName}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>{appointment.doctorName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>
                {appointment.startTime} - {appointment.endTime}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>{appointment.phone}</span>
            </div>
            <div>
              <Badge variant="secondary" className="bg-gray-700 text-gray-200">
                {appointment.type}
              </Badge>
            </div>
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 mt-0.5" />
              <span className="text-sm">{appointment.notes}</span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Calendar Grid Component
const CalendarGrid = ({
  appointments,
  onCancelAppointment,
  onRescheduleAppointment,
  weekDates,
  timeSlots,
}: {
  appointments: Appointment[]
  onCancelAppointment: (id: number) => void
  onRescheduleAppointment: (appointmentId: number, newDay: string, newTime: string) => void
  weekDates: Date[]
  timeSlots: string[]
}) => {
  const [draggedAppointment, setDraggedAppointment] = useState<Appointment | null>(null)
  const [dragOverSlot, setDragOverSlot] = useState<{ day: string; time: string } | null>(null)

  const handleDragStart = (e: React.DragEvent, appointment: Appointment) => {
    setDraggedAppointment(appointment)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", appointment.id.toString())
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDragEnter = (day: string, time: string) => {
    setDragOverSlot({ day, time })
  }

  const handleDragLeave = () => {
    setDragOverSlot(null)
  }

  const handleDrop = (e: React.DragEvent, day: string, time: string) => {
    e.preventDefault()
    setDragOverSlot(null)

    if (draggedAppointment) {
      // Don't allow dropping on occupied slots (except the original slot)
      const existingAppointment = getAppointmentForSlot(day, time)
      if (existingAppointment && existingAppointment.id !== draggedAppointment.id) {
        setDraggedAppointment(null)
        return
      }

      // Don't reschedule if dropped on the same slot
      if (draggedAppointment.day === day && draggedAppointment.startTime === time) {
        setDraggedAppointment(null)
        return
      }

      onRescheduleAppointment(draggedAppointment.id, day, time)
      setDraggedAppointment(null)
    }
  }

  const getAppointmentForSlot = (day: string, time: string) => {
    return appointments.find((apt) => apt.day === day && apt.startTime === time)
  }

  const isSlotDraggedOver = (day: string, time: string) => {
    return dragOverSlot?.day === day && dragOverSlot?.time === time
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header with days */}
      <div className="grid grid-cols-8 border-b border-gray-200">
        <div className="p-4 bg-gray-50 border-r border-gray-200">
          <span className="text-sm font-medium text-gray-500">Time</span>
        </div>
        {weekDates.map((date) => (
          <div key={date.toISOString()} className="p-4 bg-gray-50 border-r border-gray-200 last:border-r-0">
            <div className="text-center">
              <div className="text-sm font-medium text-gray-900">{getDayName(date)}</div>
              <div className="text-xs text-gray-500 mt-1">{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Time slots and appointments */}
      <div className="divide-y divide-gray-200">
        {timeSlots.map((time) => (
          <div key={time} className="grid grid-cols-8 min-h-[80px]">
            {/* Time column */}
            <div className="p-4 bg-gray-50 border-r border-gray-200 flex items-start">
              <span className="text-sm text-gray-600">{time}</span>
            </div>

                                {/* Day columns */}
                    {weekDates.map((date) => {
                      const dateStr = formatDateForAPI(date)
                      const dayName = getDayName(date)
                      const slotAppointments = appointments.filter((apt) => {
                        const aptDate = apt.date
                        const aptTime = apt.startTime
                        
                        return aptDate === dateStr && aptTime === time
                      })
                      const isDraggedOver = isSlotDraggedOver(dayName, time)
                      const canDrop = slotAppointments.length === 0 || (draggedAppointment && slotAppointments.some(apt => apt.id === draggedAppointment.id))

              return (
                <div
                  key={`${dateStr}-${time}`}
                  className={`border-r border-gray-200 last:border-r-0 p-2 transition-colors ${
                    isDraggedOver && canDrop
                      ? "bg-[#46C2DE]/10 border-[#46C2DE]/20"
                      : isDraggedOver
                        ? "bg-red-50 border-red-200"
                        : "hover:bg-gray-50"
                  }`}
                  onDragOver={handleDragOver}
                  onDragEnter={() => handleDragEnter(dayName, time)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, dayName, time)}
                >
                  {slotAppointments.length > 0 && (
                    <div className="space-y-1">
                      {slotAppointments.slice(0, 4).map((appointment, index) => (
                        <AppointmentBlock
                          key={appointment.id}
                          appointment={appointment}
                          onCancel={onCancelAppointment}
                          onDragStart={(e) => handleDragStart(e, appointment)}
                          isDragging={draggedAppointment?.id === appointment.id}
                          isCompact={slotAppointments.length > 1}
                        />
                      ))}
                      {slotAppointments.length > 4 && (
                        <div className="text-xs text-gray-500 text-center py-1">
                          +{slotAppointments.length - 4} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DoctorCalendar() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [selectedDay, setSelectedDay] = useState<string>("all")
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [appointmentToCancel, setAppointmentToCancel] = useState<number | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(new Date())
  const [loading, setLoading] = useState(true)
  const [doctorSessions, setDoctorSessions] = useState<any[]>([])
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([])

  // Fetch appointments from API
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true)
        console.log("🔍 Fetching appointments from:", API_ENDPOINTS.appointments)
        
        const response = await fetch(API_ENDPOINTS.appointments)
        console.log("📡 Response status:", response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log("📊 Raw appointments data:", data)
          console.log("📊 Number of appointments:", data.length)
          
          // Transform the data to match our calendar format
          const transformedAppointments: Appointment[] = data.map((apt: any, index: number) => {
            console.log("🔄 Transforming appointment:", apt)
            
            const date = new Date(apt.date)
            const dayName = getDayName(date)
            
            // Handle different time formats
            let startTime = apt.startTime || apt.time || "09:00"
            let endTime = apt.endTime || `${Number.parseInt((apt.startTime || apt.time || "09:00").split(":")[0]) + 1}:00`.padStart(5, "0")
            
            // If time is in "HH:MM AM/PM" format, convert to 24-hour
            if (startTime.includes("AM") || startTime.includes("PM")) {
              const timeMatch = startTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/)
              if (timeMatch) {
                let hour = parseInt(timeMatch[1])
                const minute = timeMatch[2]
                const period = timeMatch[3]
                
                if (period === "PM" && hour !== 12) hour += 12
                if (period === "AM" && hour === 12) hour = 0
                
                startTime = `${hour.toString().padStart(2, "0")}:${minute}`
                endTime = `${(hour + 1).toString().padStart(2, "0")}:${minute}`
              }
            }
            
            const transformed = {
              id: apt.id || index + 1,
              patientName: apt.patientName || "Unknown Patient",
              doctorName: apt.doctorName || "Dr. Unknown",
              startTime: startTime,
              endTime: endTime,
              day: dayName,
              date: apt.date,
              type: "Consultation",
              phone: apt.patientPhone || "+1234567890",
              notes: "Appointment details",
              status: apt.status || "Confirmed"
            }
            
            console.log("✅ Transformed appointment:", transformed)
            return transformed
          })
          
          console.log("🎯 Final transformed appointments:", transformedAppointments)
          setAppointments(transformedAppointments)
        } else {
          console.error("❌ API response not ok:", response.status, response.statusText)
          // Fallback to mock data if API fails
          setAppointments(initialAppointments)
        }
      } catch (error) {
        console.error("❌ Error fetching appointments:", error)
        // Fallback to mock data if API fails
        setAppointments(initialAppointments)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  // Load doctor sessions and generate time slots
  useEffect(() => {
    const loadDoctorSessions = () => {
      try {
        // Get current doctor ID from localStorage
        const currentDoctor = JSON.parse(localStorage.getItem("currentDoctor") || "{}")
        const doctorId = currentDoctor.id
        
        if (doctorId) {
          const savedSessions = localStorage.getItem(`doctor_sessions_${doctorId}`)
          if (savedSessions) {
            const sessions = JSON.parse(savedSessions)
            setDoctorSessions(sessions)
            
            // Generate time slots from sessions
            const timeSlots: string[] = []
            sessions.forEach((session: any) => {
              if (session.startTime && session.endTime) {
                const startMinutes = timeToMinutes(session.startTime)
                const endMinutes = timeToMinutes(session.endTime)
                const durationMinutes = parseInt(session.duration || "15")
                
                for (let current = startMinutes; current + durationMinutes <= endMinutes; current += durationMinutes) {
                  const timeStr = minutesToTime(current)
                  timeSlots.push(timeStr)
                }
              }
            })
            
            setAvailableTimeSlots(timeSlots)
            console.log("✅ Loaded doctor sessions:", sessions)
            console.log("✅ Generated time slots:", timeSlots)
          }
        }
      } catch (error) {
        console.error("Error loading doctor sessions:", error)
      }
    }
    
    loadDoctorSessions()
  }, [])

  // Helper functions for time conversion
  const timeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number)
    return hours * 60 + minutes
  }

  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
  }

  // Filter appointments based on selected day
  const filteredAppointments = useMemo(() => {
    console.log("🔍 Filtering appointments...", appointments.length, "total")
    
    const filtered = appointments.filter((appointment) => {
      if (selectedDay === "all") {
        return true
      }
      
      // Check if the appointment is in the current week
      const appointmentDate = new Date(appointment.date)
      const weekDates = getWeekDates(currentWeekStart)
      const isInCurrentWeek = weekDates.some(date => 
        date.toDateString() === appointmentDate.toDateString()
      )
      
      if (!isInCurrentWeek) {
        return false
      }
      
      // If a specific day is selected, filter by that day
      const dayMatch = appointment.day === selectedDay
      return dayMatch
    })
    
    console.log("🎯 Filtered appointments:", filtered.length)
    return filtered
  }, [appointments, selectedDay, currentWeekStart])

  // Handle reschedule
  const handleRescheduleAppointment = useCallback(async (appointmentId: number, newDay: string, newTime: string) => {
    setIsUpdating(true)
    try {
      // Find the appointment to get patient details
      const appointment = appointments.find(apt => apt.id === appointmentId)
      if (!appointment) {
        throw new Error("Appointment not found")
      }

      await mockRescheduleAppointment(appointmentId, { day: newDay, time: newTime })

      // Update the appointment in state
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId
            ? {
                ...apt,
                day: newDay,
                startTime: newTime,
                endTime: `${Number.parseInt(newTime.split(":")[0]) + 1}:00`.padStart(5, "0"),
              }
            : apt,
        ),
      )

      // Send notification to patient
      const notification = {
        type: "appointment_rescheduled",
        title: "Appointment Rescheduled",
        message: `Your appointment with ${appointment.doctorName} has been rescheduled to ${newDay} at ${newTime}`,
        appointmentId: appointmentId,
        oldDateTime: `${appointment.day} at ${appointment.startTime}`,
        newDateTime: `${newDay} at ${newTime}`,
        doctorName: appointment.doctorName
      }

      const notificationSent = notificationUtils.addNotification(appointment.patientName, notification)
      if (notificationSent) {
        console.log(`✅ Notification sent to ${appointment.patientName} about rescheduled appointment`)
      } else {
        console.warn(`⚠️ Failed to send notification to ${appointment.patientName}`)
      }

    } catch (error) {
      console.error("Failed to reschedule appointment:", error)
    } finally {
      setIsUpdating(false)
    }
  }, [appointments])

  // Handle appointment cancellation
  const handleCancelClick = useCallback((appointmentId: number) => {
    setAppointmentToCancel(appointmentId)
    setCancelModalOpen(true)
  }, [])

  const confirmCancel = useCallback(async () => {
    if (appointmentToCancel) {
      try {
        await mockCancelAppointment(appointmentToCancel)
        setAppointments((prev) => prev.filter((apt) => apt.id !== appointmentToCancel))
      } catch (error) {
        console.error("Failed to cancel appointment:", error)
      }
    }
    setCancelModalOpen(false)
    setAppointmentToCancel(null)
  }, [appointmentToCancel])

  // Navigation handlers
  const handlePreviousWeek = () => {
    const newDate = new Date(currentWeekStart)
    newDate.setDate(newDate.getDate() - 7)
    
    // Don't go back more than 3 weeks from today
    const threeWeeksAgo = new Date()
    threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21)
    
    if (newDate >= threeWeeksAgo) {
      setCurrentWeekStart(newDate)
    }
  }

  const handleNextWeek = () => {
    const newDate = new Date(currentWeekStart)
    newDate.setDate(newDate.getDate() + 7)
    
    // Don't go forward more than 3 weeks from today
    const threeWeeksFromNow = new Date()
    threeWeeksFromNow.setDate(threeWeeksFromNow.getDate() + 21)
    
    if (newDate <= threeWeeksFromNow) {
      setCurrentWeekStart(newDate)
    }
  }

  const handleToday = () => {
    setCurrentWeekStart(new Date())
  }

  // Test function to create a sample appointment (for debugging)
  const createTestAppointment = async () => {
    const testAppointment = {
      id: `test_${Date.now()}`,
      doctorId: "dr1",
      doctorName: "Dr. Smith",
      doctorImage: "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      date: formatDateForAPI(new Date()), // Today's date
      time: "10:00",
      startTime: "10:00",
      endTime: "11:00",
      patientName: "Test Patient",
      patientPhone: "+1234567890",
      patientEmail: "test@example.com",
      patientAge: "25",
      patientGender: "Male",
      symptoms: "Test consultation",
      token: "T001",
      status: "Confirmed",
      createdAt: new Date().toISOString(),
    }

    try {
      const response = await fetch(API_ENDPOINTS.appointments, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testAppointment),
      })

      if (response.ok) {
        console.log("✅ Test appointment created successfully")
        // Refresh appointments
        window.location.reload()
      } else {
        console.error("❌ Failed to create test appointment")
      }
    } catch (error) {
      console.error("❌ Error creating test appointment:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#46C2DE] mx-auto mb-4"></div>
          <p className="text-[#46C2DE] font-semibold text-lg">Loading Calendar...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-full mx-auto p-2 sm:p-4">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          Doctor Appointment Calendar
        </h1>

        {/* Navigation and Filters - Sticky */}
        <div className="sticky top-0 z-10 bg-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm mb-4">
          <div className="flex flex-col gap-4">
            {/* Navigation */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleToday} className="text-xs sm:text-sm bg-transparent">
                  Today
                </Button>
                <Button variant="outline" size="sm" onClick={handlePreviousWeek}>
                  <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleNextWeek}>
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">{formatWeekRange(currentWeekStart)}</h2>
              <Button
                onClick={createTestAppointment}
                variant="outline"
                size="sm"
                className="text-xs bg-blue-50 hover:bg-blue-100"
              >
                Test Appointment
              </Button>
            </div>

            {/* Filters and Legend */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center lg:justify-between">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                <div className="space-y-1 flex-1 sm:flex-none">
                  <label className="text-xs text-gray-500">Day</label>
                  <Select value={selectedDay} onValueChange={setSelectedDay}>
                    <SelectTrigger className="w-full sm:w-48 bg-white border-gray-300 hover:border-gray-400 focus:border-[#46C2DE] transition-colors">
                      <SelectValue placeholder="All Days" />
                    </SelectTrigger>
                    <SelectContent
                      className="bg-white border border-gray-200 shadow-lg rounded-md p-1"
                      hideWhenDetached
                    >
                      <SelectItem
                        value="all"
                        className="px-3 py-2.5 hover:bg-[#46C2DE]/10 cursor-pointer transition-colors rounded-sm data-[state=checked]:bg-[#46C2DE]/20 data-[state=checked]:text-[#46C2DE] font-medium focus:bg-[#46C2DE]/10 data-[highlighted]:bg-[#46C2DE]/10"
                      >
                        All Days
                      </SelectItem>
                      {getWeekDates(currentWeekStart).map((date) => (
                        <SelectItem
                          key={date.toISOString()}
                          value={getDayName(date)}
                          className="px-3 py-2.5 hover:bg-[#46C2DE]/10 cursor-pointer transition-colors rounded-sm data-[state=checked]:bg-[#46C2DE]/20 data-[state=checked]:text-[#46C2DE] focus:bg-[#46C2DE]/10 data-[highlighted]:bg-[#46C2DE]/10"
                        >
                          {getDayName(date)} ({date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-col xl:flex-row items-start xl:items-center gap-3 text-sm w-full lg:w-auto">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-[#46C2DE]" />
                    <span className="font-medium text-gray-700">Appointments</span>
                  </div>
                </div>
                <div className="hidden xl:block w-px h-4 bg-gray-300"></div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <span className="font-medium">Drag to reschedule</span>
                  </span>
                  <span className="hidden sm:inline text-gray-400">•</span>
                  <span className="flex items-center gap-1">
                    <span className="font-medium">Hover for details</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Grid - Horizontal scroll on mobile */}
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <CalendarGrid
              appointments={filteredAppointments}
              onCancelAppointment={handleCancelClick}
              onRescheduleAppointment={handleRescheduleAppointment}
              weekDates={getWeekDates(currentWeekStart)}
              timeSlots={availableTimeSlots.length > 0 ? availableTimeSlots : ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]}
            />
          </div>
        </div>

        {/* Loading overlay */}
        {isUpdating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#46C2DE]"></div>
                <span>Updating appointment...</span>
              </div>
            </Card>
          </div>
        )}

        {/* Cancel confirmation modal */}
        <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Appointment</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel this appointment? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCancelModalOpen(false)}>
                Keep Appointment
              </Button>
              <Button variant="destructive" onClick={confirmCancel}>
                Cancel Appointment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
