"use client";

import { ArrowLeft, Calendar, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface DoctorProfileViewProps {
  doctor?: {
    id: string;
    name: string;
    specialty: string;
    qualification: string;
    location: string;
    patients: number;
    experience: number;
    rating: number;
    about: string;
    services: string;
    slots: string[];
    image: string;
  };
  onBack?: () => void;
}

export default function DoctorProfileView({
  doctor,
  onBack,
}: DoctorProfileViewProps) {
  const router = useRouter();

  const defaultDoctor = {
    id: "dr1",
    name: "Dr. Aman Bumrow",
    specialty: "Cardiologist",
    qualification: "MBBS, MD (Cardiology)",
    location: "California, US",
    patients: 5000,
    experience: 10,
    rating: 4.8,
    about:
      "Top Cardiologist at Christ Hospital, London. Specialized in interventional cardiology...",
    services: "Medicare, Heart Surgery, ECG",
    slots: ["08:00 AM", "10:00 AM", "06:00 PM"],
    image:
      "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
  };

  const doctorData = doctor || defaultDoctor;

  const handleBookAppointment = () => {
    // Navigate to the original ScheduleSlot page with doctor ID
    router.push(`/schedule-slot?id=${doctorData.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Top Navigation */}
      <div className="sticky top-0 z-40 bg-[#46C2DE] px-4 pt-12 pb-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-[#ffffff22] active:bg-[#ffffff33] transition-all duration-200"
          >
            <ArrowLeft className="h-6 w-6 text-white" />
          </button>
          <h1 className="text-white text-lg font-medium">Book Appointment</h1>
        </div>
      </div>

      <div className="px-4 pb-6 space-y-6">
        {/* Doctor Info */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm -mt-2 border border-gray-100">
          <div className="flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-1 truncate">
                {doctorData.name}
              </h2>
              <p className="text-[#46C2DE] font-medium mb-1 text-sm md:text-base">
                {doctorData.specialty}
              </p>
              <p className="text-[#46C2DE] text-sm mb-2">
                {doctorData.qualification}
              </p>
              <p className="text-gray-500 text-xs md:text-sm">{doctorData.location}</p>
            </div>
            <div className="flex-shrink-0">
              <img
                src={doctorData.image}
                alt={doctorData.name}
                className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Doctor Stats */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Doctor Information</h3>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="text-center p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-xl md:text-2xl font-bold text-[#46C2DE]">{doctorData.experience}+</p>
              <p className="text-xs md:text-sm text-gray-600">Years Experience</p>
            </div>
            <div className="text-center p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-xl md:text-2xl font-bold text-[#46C2DE]">{doctorData.patients?.toLocaleString() || "500+"}</p>
              <p className="text-xs md:text-sm text-gray-600">Patients Treated</p>
            </div>
            <div className="text-center p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-xl md:text-2xl font-bold text-[#46C2DE]">{doctorData.rating || "4.5"}</p>
              <p className="text-xs md:text-sm text-gray-600">⭐ Rating</p>
            </div>
            <div className="text-center p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-xl md:text-2xl font-bold text-[#46C2DE]">24/7</p>
              <p className="text-xs md:text-sm text-gray-600">Support</p>
            </div>
          </div>
        </div>

        {/* Services as Tags */}
        <div className="space-y-3">
          <h3 className="text-lg md:text-xl font-bold text-gray-900">Specializations & Services</h3>
          <div className="flex flex-wrap gap-2">
            {doctorData.services.split(",").map((service, i) => (
              <span
                key={i}
                className="px-3 py-2 text-sm md:text-base text-[#46C2DE] bg-white border border-[#46C2DE] rounded-full font-medium hover:bg-[#46C2DE] hover:text-white transition-colors duration-200"
              >
                {service.trim()}
              </span>
            ))}
          </div>
        </div>

        {/* About Doctor */}
        <div className="space-y-3">
          <h3 className="text-lg md:text-xl font-bold text-gray-900">About Doctor</h3>
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              {doctorData.about}
            </p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm md:text-base">
                <span className="text-gray-500">Consultation Fee:</span>
                <span className="font-semibold text-[#46C2DE]">₹500 - ₹1000</span>
              </div>
              <div className="flex items-center justify-between text-sm md:text-base mt-2">
                <span className="text-gray-500">Languages:</span>
                <span className="font-semibold text-gray-700">English, Hindi, Marathi</span>
              </div>
              <div className="flex items-center justify-between text-sm md:text-base mt-2">
                <span className="text-gray-500">Consultation Type:</span>
                <span className="font-semibold text-gray-700">In-person & Video</span>
              </div>
            </div>
          </div>
        </div>

        {/* Available Slots */}
        <div className="space-y-3">
          <h3 className="text-lg md:text-xl font-bold text-gray-900">Available Time Slots</h3>
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
              {doctorData.slots.map((slot, index) => (
                <div
                  key={index}
                  className="text-center p-3 md:p-4 bg-gray-50 rounded-lg text-sm md:text-base font-medium text-gray-700 border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
                >
                  {slot}
                </div>
              ))}
            </div>
            <p className="text-xs md:text-sm text-gray-500 mt-4 text-center">
              Slots are 15 minutes each • Book your preferred time
            </p>
          </div>
        </div>

        {/* Earliest Slot */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-4">
            <Calendar className="h-6 w-6 text-[#46C2DE] flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm md:text-base font-medium text-gray-900 mb-1">
                Next Available Slot
              </p>
              <p className="text-sm md:text-base text-gray-600">{doctorData.slots[0]} • Today</p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
          </div>
        </div>

        {/* Book Appointment Button - Part of scrollable content */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
          <div className="text-center mb-4">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Ready to Book?</h3>
            <p className="text-sm md:text-base text-gray-600">Click below to schedule your appointment with {doctorData.name}</p>
          </div>
          <button 
            onClick={handleBookAppointment}
            className="w-full bg-[#46C2DE] text-white font-semibold py-4 px-6 rounded-xl text-lg hover:bg-[#3bb0ca] active:bg-[#3bb0ca] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Book Appointment
          </button>
        </div>
        
        {/* Bottom spacing */}
        <div className="h-6"></div>
      </div>
    </div>
  );
}
