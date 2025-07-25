"use client";

import { useBooking } from "@/context/BookingContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Calendar,
  Clock,
  User,
  Phone,
  Home,
  Share,
} from "lucide-react";
import { formatDateFull, generateToken } from "@/lib/utils";

export default function BookingConfirmation() {
  const { bookingData, resetBooking, setCurrentScreen } = useBooking();
  const { doctor, selectedDate, selectedTime } = bookingData;

  if (!doctor || !selectedDate || !selectedTime) {
    return <div>Booking information not found</div>;
  }

  const token = generateToken();

  const handleNewBooking = () => {
    resetBooking();
    setCurrentScreen("doctorList");
  };

  const handleShare = () => {
    // In a real app, this would open a share dialog
    alert("Sharing appointment details...");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Appointment Booked Successfully!
          </h1>
          <p className="text-gray-600">
            Your appointment has been confirmed with {doctor.name}
          </p>
        </div>

        {/* Token Card */}
        <Card className="border-0 shadow-lg mb-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardContent className="p-6 text-center">
            <p className="text-blue-100 mb-2">Your Token Number</p>
            <h2 className="text-4xl font-bold mb-2">{token}</h2>
            <p className="text-blue-100 text-sm">
              Keep this number for your visit
            </p>
          </CardContent>
        </Card>

        {/* Appointment Details */}
        <Card className="border-0 shadow-sm mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Appointment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Doctor Info */}
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <img
                src={
                  doctor.image ||
                  `https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop`
                }
                alt={doctor.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                <p className="text-sm text-blue-600">{doctor.specialty}</p>
                <p className="text-xs text-gray-500">{doctor.location}</p>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-600">Date</p>
                  <p className="font-medium text-gray-900 text-sm">
                    {formatDateFull(selectedDate).split(",")[0]}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDateFull(selectedDate).split(",")[1]}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-xs text-gray-600">Time</p>
                  <p className="font-medium text-gray-900">{selectedTime}</p>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm text-gray-600">Status</span>
              <Badge className="bg-green-100 text-green-700">Confirmed</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Patient Info Placeholder */}
        <Card className="border-0 shadow-sm mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Patient Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Patient Name</p>
                <div className="w-32 h-4 bg-gray-200 rounded mt-1"></div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Phone Number</p>
                <div className="w-24 h-4 bg-gray-200 rounded mt-1"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleShare}
            variant="outline"
            className="w-full h-12 rounded-xl border-2 border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <Share className="w-5 h-5 mr-2" />
            Share Appointment Details
          </Button>

          <Button
            onClick={handleNewBooking}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
          >
            <Home className="w-5 h-5 mr-2" />
            Book Another Appointment
          </Button>
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 text-center">
            💡 Please arrive 15 minutes before your scheduled time and bring a
            valid ID.
          </p>
        </div>
      </div>
    </div>
  );
}
