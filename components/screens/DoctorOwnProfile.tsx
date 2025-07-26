"use client";

import { useBooking } from "@/context/BookingContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Star,
  Users,
  Award,
  MapPin,
  Calendar,
  Clock,
  Settings,
  Bell,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Doctor } from "@/types/doctor";
import { API_ENDPOINTS } from "@/lib/config";

export default function DoctorOwnProfile() {
  const { user, setCurrentScreen } = useBooking();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(API_ENDPOINTS.doctors)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch doctors");
        return res.json();
      })
      .then((data) => {
        setDoctors(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Find doctor data based on user's doctorId
  const doctor = doctors.find((d) => d.id === user?.doctorId) as Doctor;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600 text-sm">Loading doctor profile...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500 text-sm">{error}</div>;
  }
  if (!doctor) {
    return <div>Doctor profile not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600">
                Manage your professional information
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Doctor Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {doctor.patients.toLocaleString()}
              </h3>
              <p className="text-gray-600">Total Patients</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {doctor.experience}
              </h3>
              <p className="text-gray-600">Years Experience</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {doctor.rating}
              </h3>
              <p className="text-gray-600">Average Rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Personal Information */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start space-x-6">
              <img
                src={
                  doctor.image ||
                  `https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop`
                }
                alt={doctor.name}
                className="w-24 h-24 rounded-xl object-cover"
              />

              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {doctor.name}
                  </h2>
                  <p className="text-lg text-blue-600 font-medium">
                    {doctor.specialty}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Qualification:</span>
                    <p className="font-medium">{doctor.qualification}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Location:</span>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{doctor.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About Me */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>About Me</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{doctor.about}</p>
          </CardContent>
        </Card>

        {/* Qualifications & Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Specializations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {doctor.services.split(", ").map((service, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-blue-50 text-blue-700 px-3 py-1"
                  >
                    {service}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-green-600" />
                <span>Available Hours</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {doctor.slots.map((time, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-3 bg-green-50 rounded-lg"
                  >
                    <span className="font-medium text-green-700">{time}</span>
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-200"
                    >
                      Available
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Schedule */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>Todays Appointments</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">John Doe</p>
                  <p className="text-sm text-gray-600">Routine Checkup</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-blue-600">09:30 AM</p>
                  <Badge className="bg-green-100 text-green-700">
                    Confirmed
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Jane Smith</p>
                  <p className="text-sm text-gray-600">Follow-up Visit</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-600">02:00 PM</p>
                  <Badge variant="outline">Pending</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
