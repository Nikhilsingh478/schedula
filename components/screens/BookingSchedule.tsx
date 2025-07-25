"use client";

import { useState } from "react";
import { useBooking } from "@/context/BookingContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, Sun, Moon } from "lucide-react";
import { getNextDays, formatDate } from "@/lib/utils";
import slotsData from "@/data/slots.json";
import { DoctorSlots, TimeSlot } from "@/types/doctor";

export default function BookingSchedule() {
  const { bookingData, setBookingData, setCurrentScreen } = useBooking();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const doctor = bookingData?.doctor;
  const availableDates = getNextDays(7);
  const doctorSlots: DoctorSlots =
    (slotsData as Record<string, DoctorSlots>)[doctor?.id || ""] || {};

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-sm">
        Doctor not found.
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
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentScreen("doctorProfile")}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Book Appointment
              </h1>
              <p className="text-sm text-muted-foreground">
                with {doctor.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Date Selection */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
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
                    className={`flex-shrink-0 p-3 rounded-xl text-center min-w-[80px] transition-all ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : hasSlots
                          ? "bg-white border-2 border-gray-200 hover:border-blue-400 text-gray-900"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    } focus:outline-none focus:ring-2 focus:ring-blue-300`}
                  >
                    <div className="text-sm font-medium">
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
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-green-600" />
                <span>Select Time</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Morning */}
              {getAvailableSlots(selectedDate).morning.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Sun className="w-4 h-4 text-yellow-500" />
                    <h3 className="font-medium text-gray-900">Morning</h3>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {getAvailableSlots(selectedDate).morning.map(
                      (slot: TimeSlot, index: number) => (
                        <button
                          key={index}
                          onClick={() => setSelectedTime(slot.time)}
                          disabled={!slot.available}
                          aria-selected={selectedTime === slot.time}
                          className={`p-3 rounded-lg text-sm font-medium transition-all ${
                            selectedTime === slot.time
                              ? "bg-blue-600 text-white"
                              : slot.available
                                ? "bg-white border border-gray-200 hover:border-blue-300 text-gray-900"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          } focus:outline-none focus:ring-2 focus:ring-blue-300`}
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
                  <div className="flex items-center space-x-2 mb-3">
                    <Moon className="w-4 h-4 text-blue-500" />
                    <h3 className="font-medium text-gray-900">Evening</h3>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {getAvailableSlots(selectedDate).evening.map(
                      (slot: TimeSlot, index: number) => (
                        <button
                          key={index}
                          onClick={() => setSelectedTime(slot.time)}
                          disabled={!slot.available}
                          aria-selected={selectedTime === slot.time}
                          className={`p-3 rounded-lg text-sm font-medium transition-all ${
                            selectedTime === slot.time
                              ? "bg-blue-600 text-white"
                              : slot.available
                                ? "bg-white border border-gray-200 hover:border-blue-300 text-gray-900"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          } focus:outline-none focus:ring-2 focus:ring-blue-300`}
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
          <Card className="border-0 shadow-sm bg-blue-50">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Booking Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Doctor:</span>
                  <span className="font-medium">{doctor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">
                    {formatDate(selectedDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Consultation Fee:</span>
                  <span className="font-medium">${doctor.fee || 50}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Confirm Button */}
      {selectedDate && selectedTime && (
        <div className="fixed bottom-0 left-0 right-0 px-4 py-4 bg-white shadow-md z-10">
          <Button
            onClick={handleBooking}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-lg"
          >
            Confirm Booking
          </Button>
        </div>
      )}
    </div>
  );
}
