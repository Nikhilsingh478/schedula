"use client";

import { useState } from "react";
import { useBooking } from "@/context/BookingContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

interface DoctorDetails {
  name: string;
  specialization: string;
  location: string;
  qualifications: string;
}

interface AppointmentDay {
  label: string;
  date: string;
  fullDate: string;
}

interface TimeSlot {
  id: string;
  time: string;
  period: "morning" | "evening";
}

const doctorDetails: DoctorDetails = {
  name: "Dr. Kumar Das",
  specialization: "Cardiologist",
  location: "Dombivli",
  qualifications: "MBBS, MD in Internal Medicine",
};

const appointmentDays: AppointmentDay[] = [
  { label: "Mon", date: "Jul 10", fullDate: "2023-07-10" },
  { label: "Tue", date: "Jul 11", fullDate: "2023-07-11" },
  { label: "Wed", date: "Jul 12", fullDate: "2023-07-12" },
  { label: "Thu", date: "Jul 13", fullDate: "2023-07-13" },
  { label: "Fri", date: "Jul 14", fullDate: "2023-07-14" },
  { label: "Sat", date: "Jul 15", fullDate: "2023-07-15" },
  { label: "Sun", date: "Jul 16", fullDate: "2023-07-16" },
];

const timeSlots: TimeSlot[] = [
  { id: "1", time: "09:30 AM – 09:45 AM", period: "morning" },
  { id: "2", time: "10:00 AM – 10:15 AM", period: "morning" },
  { id: "3", time: "10:30 AM – 10:45 AM", period: "morning" },
  { id: "4", time: "11:30 AM – 11:45 AM", period: "morning" },
  { id: "5", time: "12:00 PM – 12:15 PM", period: "morning" },
  { id: "6", time: "12:30 PM – 12:45 PM", period: "morning" },
  { id: "7", time: "01:00 PM – 01:15 PM", period: "evening" },
  { id: "8", time: "02:00 PM – 02:15 PM", period: "evening" },
  { id: "9", time: "03:00 PM – 03:15 PM", period: "evening" },
  { id: "10", time: "04:00 PM – 04:15 PM", period: "evening" },
];

export default function BookingTwo() {
  const { setCurrentScreen } = useBooking();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");

  const handleBack = () => {
    console.log("Navigate back");
  };

  const handleBookAppointment = () => {
    if (selectedDate && selectedSlot) {
      const selectedDay = appointmentDays.find(
        (day) => day.fullDate === selectedDate,
      );
      const selectedTimeSlot = timeSlots.find(
        (slot) => slot.id === selectedSlot,
      );

      // Navigate to patient details confirmation
      setCurrentScreen("patientDetails");
    }
  };

  const morningSlots = timeSlots.filter((slot) => slot.period === "morning");
  const eveningSlots = timeSlots.filter((slot) => slot.period === "evening");

  const isBookingEnabled = selectedDate && selectedSlot;

  return (
    <div
      className="min-h-screen bg-gray-50 pb-24"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="flex items-center px-4 py-4">
          <button
            onClick={handleBack}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="flex-1 text-center text-lg font-bold text-gray-900 -ml-9">
            Book Appointment
          </h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Doctor Info Recap */}
        <Card className="bg-white shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <img
                src="https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop"
                alt={doctorDetails.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {doctorDetails.name}
                </h2>
                <p className="text-sm text-gray-600">
                  {doctorDetails.specialization} • {doctorDetails.location}
                </p>
                <p className="text-xs text-gray-500">
                  {doctorDetails.qualifications}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date Selection Strip */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-[#46c2de]" />
            Select Date
          </h3>
          <div className="overflow-x-auto">
            <div
              className="flex space-x-3 pb-2"
              style={{ minWidth: "max-content" }}
            >
              {appointmentDays.map((day) => (
                <button
                  key={day.fullDate}
                  onClick={() => setSelectedDate(day.fullDate)}
                  className={`flex-shrink-0 px-4 py-3 rounded-lg text-center min-w-[70px] transition-all ${
                    selectedDate === day.fullDate
                      ? "bg-[#46c2de] text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <div className="text-sm font-medium">{day.label}</div>
                  <div className="text-xs mt-1">{day.date}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Time Slot Selection */}
        {selectedDate && (
          <div className="space-y-6">
            {/* Morning Slots */}
            <div>
              <h4 className="text-sm text-gray-500 uppercase tracking-wide mb-3 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                🌞 Morning
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {morningSlots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot.id)}
                    className={`text-sm px-4 py-3 rounded-lg border transition-all ${
                      selectedSlot === slot.id
                        ? "bg-[#46c2de] text-white ring-2 ring-blue-400 shadow-md"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-300"
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>

            {/* Evening Slots */}
            <div>
              <h4 className="text-sm text-gray-500 uppercase tracking-wide mb-3 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                🌙 Evening
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {eveningSlots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot.id)}
                    className={`text-sm px-4 py-3 rounded-lg border transition-all ${
                      selectedSlot === slot.id
                        ? "bg-[#46c2de] text-white ring-2 ring-blue-400 shadow-md"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-300"
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Book Appointment Button */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-11/12 max-w-md">
        <Button
          onClick={handleBookAppointment}
          disabled={!isBookingEnabled}
          className={`w-full py-3 rounded-xl font-medium shadow-md transition-all duration-200 ${
            isBookingEnabled
              ? "bg-[#46c2de] hover:bg-[#3bb5d1] text-white active:scale-[0.98]"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Book Appointment
        </Button>
      </div>
    </div>
  );
}
