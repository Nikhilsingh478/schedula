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
const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

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
}: {
  appointment: Appointment
  onCancel: (id: number) => void
  onDragStart: (e: React.DragEvent) => void
  isDragging?: boolean
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`bg-[#46C2DE] text-white p-2 rounded-md shadow-sm hover:bg-[#3bb0ca] transition-colors cursor-move relative group border border-[#46C2DE] min-h-[60px] ${
              isDragging ? "opacity-50 scale-95" : ""
            }`}
            draggable
            onDragStart={onDragStart}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{appointment.patientName}</p>
                <p className="text-xs opacity-90">{appointment.startTime}</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="h-5 w-5 p-0 text-white hover:bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity absolute top-1 right-1"
                onClick={(e) => {
                  e.stopPropagation()
                  onCancel(appointment.id)
                }}
              >
                <X className="h-3 w-3" />
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
}: {
  appointments: Appointment[]
  onCancelAppointment: (id: number) => void
  onRescheduleAppointment: (appointmentId: number, newDay: string, newTime: string) => void
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
        {daysOfWeek.map((day) => (
          <div key={day} className="p-4 bg-gray-50 border-r border-gray-200 last:border-r-0">
            <div className="text-center">
              <div className="text-sm font-medium text-gray-900">{day}</div>
              <div className="text-xs text-gray-500 mt-1">Jan {8 + daysOfWeek.indexOf(day)}</div>
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
            {daysOfWeek.map((day) => {
              const appointment = getAppointmentForSlot(day, time)
              const isDraggedOver = isSlotDraggedOver(day, time)
              const canDrop = !appointment || (draggedAppointment && appointment.id === draggedAppointment.id)

              return (
                <div
                  key={`${day}-${time}`}
                  className={`border-r border-gray-200 last:border-r-0 p-2 transition-colors ${
                    isDraggedOver && canDrop
                      ? "bg-[#46C2DE]/10 border-[#46C2DE]/20"
                      : isDraggedOver
                        ? "bg-red-50 border-red-200"
                        : "hover:bg-gray-50"
                  }`}
                  onDragOver={handleDragOver}
                  onDragEnter={() => handleDragEnter(day, time)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, day, time)}
                >
                  {appointment && (
                    <AppointmentBlock
                      appointment={appointment}
                      onCancel={onCancelAppointment}
                      onDragStart={(e) => handleDragStart(e, appointment)}
                      isDragging={draggedAppointment?.id === appointment.id}
                    />
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
  const [selectedDoctor, setSelectedDoctor] = useState<string>("all")
  const [selectedDay, setSelectedDay] = useState<string>("all")
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [appointmentToCancel, setAppointmentToCancel] = useState<number | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [currentWeek, setCurrentWeek] = useState("Jan 7 - 13, 2024")
  const [loading, setLoading] = useState(true)

  // Fetch appointments from API
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true)
        const response = await fetch(API_ENDPOINTS.appointments)
        if (response.ok) {
          const data = await response.json()
          
          // Transform the data to match our calendar format
          const transformedAppointments: Appointment[] = data.map((apt: any, index: number) => {
            const date = new Date(apt.date)
            const dayName = daysOfWeek[date.getDay()]
            
            return {
              id: apt.id || index + 1,
              patientName: apt.patientName || "Unknown Patient",
              doctorName: apt.doctorName || "Dr. Unknown",
              startTime: apt.time || "09:00",
              endTime: `${Number.parseInt((apt.time || "09:00").split(":")[0]) + 1}:00`.padStart(5, "0"),
              day: dayName,
              date: apt.date,
              type: "Consultation",
              phone: apt.patientPhone || "+1234567890",
              notes: "Appointment details",
              status: apt.status || "Confirmed"
            }
          })
          
          setAppointments(transformedAppointments)
        }
      } catch (error) {
        console.error("Error fetching appointments:", error)
        // Fallback to mock data if API fails
        setAppointments(initialAppointments)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  // Get unique doctors for filter
  const doctors = useMemo(() => {
    const doctorNames = appointments.map((apt) => apt.doctorName)
    const uniqueDoctors = doctorNames.filter((name, index) => doctorNames.indexOf(name) === index)
    return uniqueDoctors
  }, [appointments])

  // Filter appointments based on selected filters
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const doctorMatch = selectedDoctor === "all" || appointment.doctorName === selectedDoctor
      const dayMatch = selectedDay === "all" || appointment.day === selectedDay
      return doctorMatch && dayMatch
    })
  }, [appointments, selectedDoctor, selectedDay])

  // Handle reschedule
  const handleRescheduleAppointment = useCallback(async (appointmentId: number, newDay: string, newTime: string) => {
    setIsUpdating(true)
    try {
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
    } catch (error) {
      console.error("Failed to reschedule appointment:", error)
    } finally {
      setIsUpdating(false)
    }
  }, [])

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

  // Navigation handlers (mock)
  const handlePreviousWeek = () => {
    console.log("Previous week")
    setCurrentWeek("Dec 31 - Jan 6, 2024")
  }

  const handleNextWeek = () => {
    console.log("Next week")
    setCurrentWeek("Jan 14 - 20, 2024")
  }

  const handleToday = () => {
    console.log("Go to today")
    setCurrentWeek("Jan 7 - 13, 2024")
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
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">{currentWeek}</h2>
            </div>

            {/* Filters and Legend */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center lg:justify-between">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                <div className="space-y-1 flex-1 sm:flex-none">
                  <label className="text-xs text-gray-500">Doctor</label>
                  <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                    <SelectTrigger className="w-full sm:w-48 bg-white border-gray-300 hover:border-gray-400 focus:border-[#46C2DE] transition-colors">
                      <SelectValue placeholder="All Doctors" />
                    </SelectTrigger>
                    <SelectContent
                      className="bg-white border border-gray-200 shadow-lg rounded-md p-1"
                      hideWhenDetached
                    >
                      <SelectItem
                        value="all"
                        className="px-3 py-2.5 hover:bg-[#46C2DE]/10 cursor-pointer transition-colors rounded-sm data-[state=checked]:bg-[#46C2DE]/20 data-[state=checked]:text-[#46C2DE] font-medium focus:bg-[#46C2DE]/10 data-[highlighted]:bg-[#46C2DE]/10"
                      >
                        All Doctors
                      </SelectItem>
                      {doctors.map((doctor) => (
                        <SelectItem
                          key={doctor}
                          value={doctor}
                          className="px-3 py-2.5 hover:bg-[#46C2DE]/10 cursor-pointer transition-colors rounded-sm data-[state=checked]:bg-[#46C2DE]/20 data-[state=checked]:text-[#46C2DE] focus:bg-[#46C2DE]/10 data-[highlighted]:bg-[#46C2DE]/10"
                        >
                          {doctor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

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
                      {daysOfWeek.map((day) => (
                        <SelectItem
                          key={day}
                          value={day}
                          className="px-3 py-2.5 hover:bg-[#46C2DE]/10 cursor-pointer transition-colors rounded-sm data-[state=checked]:bg-[#46C2DE]/20 data-[state=checked]:text-[#46C2DE] focus:bg-[#46C2DE]/10 data-[highlighted]:bg-[#46C2DE]/10"
                        >
                          {day}
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
