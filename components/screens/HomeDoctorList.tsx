"use client";

import { useBooking } from "@/context/BookingContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Users, Search, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { Doctor } from "@/types/doctor";
import { API_ENDPOINTS } from "@/lib/config";

export default function HomeDoctorList() {
  const { setCurrentScreen, setBookingData } = useBooking();
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

  const handleDoctorSelect = (doctor: Doctor) => {
    setBookingData({ doctor });
    setCurrentScreen("doctorProfile");
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600 text-sm">Loading doctors...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500 text-sm">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Find Your Doctor
              </h1>
              <p className="text-sm text-gray-600">
                Book appointments with top-rated specialists
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search doctors by name or specialty"
              className="pl-10 h-12 rounded-xl border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </header>

      {/* Doctor List */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {doctors.map((doctor) => (
          <Card
            key={doctor.id}
            className="transition-shadow hover:shadow-lg cursor-pointer border border-gray-100 bg-white"
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-5">
                {/* Doctor Image */}
                <img
                  src={
                    doctor.image ||
                    "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
                  }
                  alt={doctor.name}
                  className="w-20 h-20 rounded-xl object-cover flex-shrink-0 bg-gray-100"
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {doctor.name}
                      </h2>
                      <p className="text-blue-600 font-medium">
                        {doctor.specialty}
                      </p>
                      <p className="text-sm text-gray-500">
                        {doctor.qualification}
                      </p>
                    </div>
                    <div className="flex items-center bg-green-50 px-2 py-1 rounded-lg space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-900">
                        {doctor.rating}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{doctor.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{doctor.patients.toLocaleString()} patients</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {doctor.services
                      .split(", ")
                      .slice(0, 2)
                      .map((service, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full"
                        >
                          {service}
                        </Badge>
                      ))}
                  </div>

                  <Button
                    onClick={() => handleDoctorSelect(doctor)}
                    className="w-full mt-5 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm transition-colors"
                  >
                    View Profile & Book
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </main>
    </div>
  );
}
