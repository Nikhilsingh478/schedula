"use client";

import { useState } from "react";
import { useBooking } from "@/context/BookingContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  Calendar,
  Clock,
  User,
  Phone,
  MapPin,
  Home,
} from "lucide-react";

export default function PatientDetailsUnfilled() {
  const { setCurrentScreen } = useBooking();
  const [tokenNumber] = useState("1234");

  const handleGoHome = () => {
    // Navigate back to patient dashboard
    setCurrentScreen("doctorList");
  };

  return (
    <div
      className="min-h-screen bg-gray-50 p-4"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div className="max-w-md mx-auto">
        {/* Success Confirmation Box */}
        <Card className="bg-white shadow-lg rounded-xl mt-8">
          <CardContent className="p-6 text-center space-y-4">
            {/* Success Icon */}
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            {/* Success Message */}
            <h1 className="text-xl font-bold text-green-700">
              Appointment Booked Successfully!
            </h1>

            {/* Token Number */}
            <div className="bg-[#46c2de] text-white rounded-lg p-4">
              <p className="text-sm opacity-90">Token No:</p>
              <p className="text-2xl font-bold">{tokenNumber}</p>
            </div>

            {/* Reminder Text */}
            <p className="text-sm text-gray-600">
              You will receive a reminder 30 minutes before your appointment.
            </p>
          </CardContent>
        </Card>

        {/* Illustration Placeholder */}
        <div className="flex justify-center my-6">
          <div className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-2" />
              <p className="text-xs text-green-600 font-medium">Success!</p>
            </div>
          </div>
        </div>

        {/* Patient Details Preview (Unfilled State) */}
        <Card className="bg-gray-50 shadow-inner">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-[#46c2de]" />
              Patient Details
            </h2>

            <div className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  disabled
                  placeholder="Name not filled"
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* Age Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="text"
                  disabled
                  placeholder="Age not filled"
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* Gender Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <input
                  type="text"
                  disabled
                  placeholder="Gender not filled"
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* Contact Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    disabled
                    placeholder="Phone not filled"
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                  <textarea
                    disabled
                    placeholder="Address not filled"
                    rows={2}
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm text-gray-500 cursor-not-allowed resize-none"
                  />
                </div>
              </div>

              {/* Appointment Details */}
              <div className="border-t pt-4 mt-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Appointment Details
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center text-[#46c2de] mb-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span className="text-xs font-medium">Date</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">
                      Jul 15, 2024
                    </p>
                  </div>

                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center text-green-600 mb-1">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="text-xs font-medium">Time</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">
                      10:30 AM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <Button
            onClick={handleGoHome}
            className="w-full bg-[#46c2de] hover:bg-[#3bb5d1] text-white py-3 rounded-lg font-medium transition-all duration-200 active:scale-[0.98]"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Button>

          <p className="text-center text-xs text-gray-500">
            💡 Please arrive 15 minutes before your scheduled appointment time
          </p>
        </div>
      </div>
    </div>
  );
}
