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
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredDoctors = doctors.filter((doctor) => {
    const term = searchTerm.toLowerCase();
    return (
      doctor.name.toLowerCase().includes(term) ||
      (doctor.specialization && doctor.specialization.toLowerCase().includes(term)) ||
      (doctor.location && doctor.location.toLowerCase().includes(term))
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#46c2de] mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading doctors...</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 lg:py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center justify-between lg:justify-start">
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Find Your Doctor
              </h1>
                <p className="text-sm lg:text-base text-gray-600 mt-1">
                Book appointments with top-rated specialists
              </p>
            </div>
              <div className="lg:hidden w-12 h-12 bg-[#46c2de] rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
          </div>
            <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
                placeholder="Search doctors by name, specialty, or location"
                className="pl-10 h-12 rounded-xl border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#46c2de] focus:border-[#46c2de]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            </div>
          </div>
        </div>
      </header>

      {/* Doctor List */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 lg:py-8">
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredDoctors.map((doctor) => (
          <Card
            key={doctor.id}
                className="transition-all duration-200 hover:shadow-lg cursor-pointer border border-gray-100 bg-white hover:border-[#46c2de]/20 group"
          >
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col space-y-4">
                    {/* Doctor Image and Basic Info */}
                    <div className="flex items-start space-x-4">
                <img
                  src={
                    doctor.image ||
                    "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
                  }
                  alt={doctor.name}
                        className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover flex-shrink-0 bg-gray-100"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h2 className="text-lg md:text-xl font-semibold text-gray-900 line-clamp-1">
                        {doctor.name}
                      </h2>
                            <p className="text-[#46c2de] font-medium text-sm md:text-base">
                        {doctor.specialization}
                      </p>
                            <p className="text-sm text-gray-500 line-clamp-1">
                        {doctor.qualification}
                      </p>
                    </div>
                          <div className="flex items-center bg-green-50 px-2 py-1 rounded-lg space-x-1 ml-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-900">
                        {doctor.rating}
                      </span>
                    </div>
                  </div>
                      </div>
                    </div>

                    {/* Location and Patients */}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                        <span className="line-clamp-1">{doctor.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{doctor.patients?.toLocaleString() || "0"} patients</span>
                    </div>
                  </div>

                    {/* Services */}
                    <div className="flex flex-wrap gap-2">
                    {doctor.services
                      ?.split(", ")
                        .slice(0, 3)
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

                    {/* Action Button */}
                  <Button
                    onClick={() => handleDoctorSelect(doctor)}
                      className="w-full h-11 rounded-xl bg-[#46c2de] hover:bg-[#3bb0ca] text-white text-sm font-medium shadow-sm transition-all duration-200 group-hover:shadow-md"
                  >
                    View Profile & Book
                  </Button>
              </div>
            </CardContent>
          </Card>
        ))}
          </div>
        )}
      </main>
    </div>
  );
}
