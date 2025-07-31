"use client";

import { useEffect, useState } from "react";
import { useBooking } from "@/context/BookingContext";
import { API_ENDPOINTS } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, Sun, Moon } from "lucide-react";
import { getNextDays, formatDate } from "@/lib/utils";
import { DoctorSlots, TimeSlot } from "@/types/doctor";
import { useRouter } from "next/navigation";

export default function BookingSchedule() {
  const { bookingData, setBookingData, setCurrentScreen } = useBooking();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [slotsData, setSlotsData] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    fetch(API_ENDPOINTS.slots)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch slots");
        return res.json();
      })
      .then((data) => {
        setSlotsData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const doctor = bookingData?.doctor;
  const availableDates = getNextDays(7);
  const doctorSlots: DoctorSlots =
    (slotsData && doctor?.id ? slotsData[doctor.id] : {}) || {};

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Doctor not found.</p>
          <Button onClick={() => setCurrentScreen("doctorList")} className="bg-[#46c2de] hover:bg-[#3bb0ca]">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#46c2de] mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading slots...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-[#46c2de] hover:bg-[#3bb0ca]">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const handleBooking = () => {
    if (selectedDate && selectedTime) {
      setBookingData({
        selectedDate,
        selectedTime,
      });
      setCurrentScreen("confirmation");
    }
  };

  const getAvailableSlots = (date: string) => {
    return doctorSlots[date] || { morning: [], evening: [] };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-4 lg:py-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentScreen("doctorList")}
              className="p-2 hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl lg:text-2xl font-semibold text-gray-900">
                Book Appointment
              </h1>
              <p className="text-sm lg:text-base text-muted-foreground">
                with {doctor.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 lg:py-8 space-y-6 lg:space-y-8">
        {/* Date Selection */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg lg:text-xl">
              <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-[#46c2de]" />
              <span>Select Date</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-3 overflow-x-auto scroll-smooth pb-2 no-scrollbar">
              {availableDates.map((date) => {
                const isSelected = selectedDate === date;
                const hasSlots = !!doctorSlots[date];

                return (
                  <button
                    key={date}
                    onClick={() => {
                      setSelectedDate(date);
                      setSelectedTime("");
                    }}
                    disabled={!hasSlots}
                    aria-selected={isSelected}
                    className={`flex-shrink-0 p-3 lg:p-4 rounded-xl text-center min-w-[80px] lg:min-w-[100px] transition-all ${
                      isSelected
                        ? "bg-[#46c2de] text-white shadow-md"
                        : hasSlots
                          ? "bg-white border-2 border-gray-200 hover:border-[#46c2de] text-gray-900 hover:shadow-sm"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    } focus:outline-none focus:ring-2 focus:ring-[#46c2de]/20`}
                  >
                    <div className="text-sm lg:text-base font-medium">
                      {formatDate(date)}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Time Slots */}
        {selectedDate && (
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg lg:text-xl">
                <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
                <span>Select Time</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 lg:space-y-8">
              {/* Morning */}
              {getAvailableSlots(selectedDate).morning.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-4 lg:mb-6">
                    <Sun className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-500" />
                    <h3 className="font-medium text-gray-900 text-base lg:text-lg">Morning</h3>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 lg:gap-4">
                    {getAvailableSlots(selectedDate).morning.map(
                      (slot: TimeSlot, index: number) => (
                        <button
                          key={index}
                          onClick={() => setSelectedTime(slot.time)}
                          disabled={!slot.available}
                          aria-selected={selectedTime === slot.time}
                          className={`p-3 lg:p-4 rounded-lg text-sm lg:text-base font-medium transition-all ${
                            selectedTime === slot.time
                              ? "bg-[#46c2de] text-white shadow-md"
                              : slot.available
                                ? "bg-white border border-gray-200 hover:border-[#46c2de] text-gray-900 hover:shadow-sm"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          } focus:outline-none focus:ring-2 focus:ring-[#46c2de]/20`}
                        >
                          {slot.time}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* Evening */}
              {getAvailableSlots(selectedDate).evening.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-4 lg:mb-6">
                    <Moon className="w-4 h-4 lg:w-5 lg:h-5 text-blue-500" />
                    <h3 className="font-medium text-gray-900 text-base lg:text-lg">Evening</h3>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 lg:gap-4">
                    {getAvailableSlots(selectedDate).evening.map(
                      (slot: TimeSlot, index: number) => (
                        <button
                          key={index}
                          onClick={() => setSelectedTime(slot.time)}
                          disabled={!slot.available}
                          aria-selected={selectedTime === slot.time}
                          className={`p-3 lg:p-4 rounded-lg text-sm lg:text-base font-medium transition-all ${
                            selectedTime === slot.time
                              ? "bg-[#46c2de] text-white shadow-md"
                              : slot.available
                                ? "bg-white border border-gray-200 hover:border-[#46c2de] text-gray-900 hover:shadow-sm"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          } focus:outline-none focus:ring-2 focus:ring-[#46c2de]/20`}
                        >
                          {slot.time}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Booking Summary */}
        {selectedDate && selectedTime && (
          <Card className="border-0 shadow-sm bg-[#46c2de]/5 border border-[#46c2de]/20">
            <CardContent className="p-6 lg:p-8">
              <h3 className="font-semibold text-gray-900 mb-4 lg:mb-6 text-lg lg:text-xl">
                Booking Summary
              </h3>
              <div className="space-y-3 lg:space-y-4 text-sm lg:text-base">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Doctor:</span>
                  <span className="font-medium text-gray-900">{doctor.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Specialty:</span>
                  <span className="font-medium text-gray-900">{doctor.specialization}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium text-gray-900">
                    {formatDate(selectedDate)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium text-gray-900">{selectedTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Consultation Fee:</span>
                  <span className="font-medium text-gray-900">${doctor.fee || 50}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Confirm Button */}
      {selectedDate && selectedTime && (
        <div className="fixed bottom-0 left-0 right-0 px-4 py-4 bg-white shadow-lg z-10 lg:relative lg:px-0 lg:py-0 lg:shadow-none lg:bg-transparent">
          <div className="max-w-4xl mx-auto">
          <Button
            onClick={handleBooking}
              className="w-full h-12 lg:h-14 bg-[#46c2de] hover:bg-[#3bb0ca] text-white rounded-xl font-medium text-lg lg:text-xl shadow-md hover:shadow-lg transition-all duration-200"
          >
            Confirm Booking
          </Button>
          </div>
        </div>
      )}
    </div>
  );
}
