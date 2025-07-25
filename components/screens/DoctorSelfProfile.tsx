"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Users,
  Award,
  Calendar,
  Clock,
  GraduationCap,
  MapPin,
} from "lucide-react";

const doctorProfileData = {
  name: "Dr. Aman Bumrow",
  specialization: "Cardiologist",
  institution: "The Wiscon Hospital, California, US",
  patients: 5000,
  experience: 10,
  rating: 4.8,
  about:
    "Dr. Aman Bumrow is the top most Cardiologist specialist at The Wiscon Hospital in California. With over 10 years of experience in interventional cardiology, he has successfully treated thousands of patients with complex heart conditions. His expertise includes cardiac catheterization, angioplasty, and preventive cardiology. Dr. Bumrow is known for his compassionate care and innovative treatment approaches.",
  qualifications: {
    degree: "MBBS",
    institution: "Sydney College and University",
  },
  service: "Medicare",
  consultingHours: [
    "08:00 AM – 10:00 AM",
    "01:00 PM – 04:00 PM",
    "06:00 PM – 08:00 PM",
  ],
  image:
    "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop",
};

export default function DoctorSelfProfile() {
  const [showFullAbout, setShowFullAbout] = useState(false);

  const handleBookAppointment = () => {
    console.log("Navigate to booking");
  };

  return (
    <div
      className="min-h-screen bg-gray-50 pb-24"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Your professional information</p>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Header / Identity Block */}
        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <img
                src={doctorProfileData.image}
                alt={doctorProfileData.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {doctorProfileData.name}
                </h2>
                <p className="text-sm text-gray-600 italic mb-2">
                  {doctorProfileData.specialization} at{" "}
                  {doctorProfileData.institution}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>California, US</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-blue-50 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="flex flex-col items-center">
                <Users className="w-6 h-6 text-[#46c2de] mb-2" />
                <p className="text-lg font-bold text-gray-900">
                  {doctorProfileData.patients.toLocaleString()}+
                </p>
                <p className="text-xs text-gray-600">Patients</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="flex flex-col items-center">
                <Award className="w-6 h-6 text-green-600 mb-2" />
                <p className="text-lg font-bold text-gray-900">
                  {doctorProfileData.experience}+ Years
                </p>
                <p className="text-xs text-gray-600">Experience</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="flex flex-col items-center">
                <Star className="w-6 h-6 text-yellow-500 mb-2" />
                <p className="text-lg font-bold text-gray-900">
                  {doctorProfileData.rating} ⭐
                </p>
                <p className="text-xs text-gray-600">Rating</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* About Me Section */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              About Me
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 leading-relaxed">
              {showFullAbout
                ? doctorProfileData.about
                : `${doctorProfileData.about.substring(0, 200)}...`}
              <button
                onClick={() => setShowFullAbout(!showFullAbout)}
                className="text-[#46c2de] font-medium ml-1 hover:underline"
              >
                {showFullAbout ? "View Less" : "View More"}
              </button>
            </p>
          </CardContent>
        </Card>

        {/* Qualification Section */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
              <GraduationCap className="w-5 h-5 mr-2 text-[#46c2de]" />
              Qualifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="border-b pb-2">
                <span className="text-gray-600">Degree</span>
                <p className="font-medium">
                  {doctorProfileData.qualifications.degree}
                </p>
              </div>
              <div className="border-b pb-2">
                <span className="text-gray-600">Institution</span>
                <p className="font-medium">
                  {doctorProfileData.qualifications.institution}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services and Specialization */}
        <div className="grid grid-cols-1 gap-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">
                Services & Specialization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm text-gray-600">Service:</span>
                <Badge className="ml-2 bg-blue-50 text-blue-700">
                  {doctorProfileData.service}
                </Badge>
              </div>
              <div>
                <span className="text-sm text-gray-600">Specialization:</span>
                <Badge className="ml-2 bg-green-50 text-green-700">
                  {doctorProfileData.specialization}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Availability Schedule */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-green-600" />
              Consulting Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm text-gray-600 mb-3">
                <strong>Monday to Friday</strong>
              </div>
              {doctorProfileData.consultingHours.map((time, index) => (
                <div
                  key={index}
                  className="bg-green-50 p-3 rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-green-600 mr-2" />
                    <span className="font-medium text-gray-900">{time}</span>
                  </div>
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

      {/* Fixed Book Appointment Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <Button
          onClick={handleBookAppointment}
          className="w-full bg-[#46c2de] hover:bg-[#3bb5d1] text-white py-3 rounded-lg font-medium shadow-lg transition-all duration-200 active:scale-[0.98]"
        >
          Book an Appointment
        </Button>
      </div>
    </div>
  );
}
