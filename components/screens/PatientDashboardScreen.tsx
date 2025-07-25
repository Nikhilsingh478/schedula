"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Bell,
  Heart,
  Calendar,
  FileText,
  User,
  Stethoscope,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

import DoctorProfileView from "./DoctorProfileView";
import PatientRecords from "./PatientRecords";
import UserProfileScreen from "@/components/screens/UserProfileScreen";
import AppointmentsScreen from "@/components/screens/AppointmentsScreen";

// Type Definitions
type Doctor = {
  id: string;
  name: string;
  specialization: string;
  availability: string;
  bio: string;
  workingHours: string;
  image: string;
  isFavorite: boolean;
  qualification?: string;
  location?: string;
  patients?: number;
  experience?: number;
  rating?: number;
  about?: string;
  services?: string;
  slots?: string[];
};

const mockDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Prakash Das",
    specialization: "Senior Psychologist",
    availability: "Available today",
    bio: "As psychologist Dr. Das specializes in cognitive behavioral therapy and has over 15 years of experience helping patients...",
    workingHours: "09:30 AM – 07:00 PM",
    image:
      "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    isFavorite: false,
  },
  {
    id: "2",
    name: "Dr. Sarah Johnson",
    specialization: "Cardiologist",
    availability: "Available today",
    bio: "Dr. Johnson is a renowned cardiologist with expertise in interventional cardiology and preventive heart care...",
    workingHours: "08:00 AM – 06:00 PM",
    image:
      "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    isFavorite: true,
  },
  {
    id: "3",
    name: "Dr. Michael Chen",
    specialization: "Orthopedic Surgeon",
    availability: "Available tomorrow",
    bio: "Specialized in joint replacement and sports medicine, Dr. Chen has performed over 2000 successful surgeries...",
    workingHours: "10:00 AM – 08:00 PM",
    image:
      "https://images.pexels.com/photos/5452274/pexels-photo-5452274.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    isFavorite: false,
  },
  {
    id: "4",
    name: "Dr. Emily Rodriguez",
    specialization: "Dermatologist",
    availability: "Available today",
    bio: "Expert in cosmetic and medical dermatology with a focus on skin cancer prevention and anti-aging treatments...",
    workingHours: "09:00 AM – 05:00 PM",
    image:
      "https://images.pexels.com/photos/5452268/pexels-photo-5452268.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    isFavorite: false,
  },
];

export default function PatientDashboardScreen() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [activeTab, setActiveTab] = useState<
    "find-doctor" | "appointments" | "records" | "profile"
  >("find-doctor");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showDoctorProfile, setShowDoctorProfile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3001/doctors")
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

  const toggleFavorite = (doctorId: string) => {
    setDoctors((prev) =>
      prev.map((doctor) =>
        doctor.id === doctorId
          ? { ...doctor, isFavorite: !doctor.isFavorite }
          : doctor,
      ),
    );
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const term = searchTerm.toLowerCase();
    return (
      doctor.name.toLowerCase().includes(term) ||
      (doctor.specialization && doctor.specialization.toLowerCase().includes(term))
    );
  });

  const DoctorCard = ({ doctor }: { doctor: Doctor }) => (
    <div
      onClick={() => {
        setSelectedDoctor(doctor);
        setShowDoctorProfile(true);
      }}
      className="flex gap-4 rounded-lg shadow-sm p-4 bg-white hover:shadow-md transition-shadow cursor-pointer"
    >
      <img
        src={doctor.image}
        alt={doctor.name}
        className="w-14 h-14 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3 className="font-semibold text-gray-900 text-base">
              {doctor.name}
            </h3>
            <p className="text-gray-600 text-sm">{doctor.specialization}</p>
            {doctor.qualification && (
              <p className="text-xs text-gray-500">{doctor.qualification}</p>
            )}
            {doctor.location && (
              <p className="text-xs text-gray-500">{doctor.location}</p>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(doctor.id);
            }}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Heart
              className={`w-5 h-5 ${
                doctor.isFavorite
                  ? "text-red-500 fill-current"
                  : "text-gray-400"
              }`}
            />
          </button>
        </div>
        <div className="mb-2 flex flex-wrap gap-2 items-center">
          {doctor.rating && (
            <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
              ⭐ {doctor.rating}
            </span>
          )}
          {doctor.experience && (
            <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
              {doctor.experience} yrs exp
            </span>
          )}
          {doctor.patients && (
            <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
              {doctor.patients} patients
            </span>
          )}
        </div>
        {doctor.about && (
          <p className="text-gray-700 text-xs mb-1 line-clamp-2">{doctor.about}</p>
        )}
        {doctor.services && (
          <p className="text-gray-500 text-xs mb-1">Services: {doctor.services}</p>
        )}
        {doctor.workingHours && (
          <p className="text-gray-500 text-xs">Hours: {doctor.workingHours}</p>
        )}
      </div>
    </div>
  );

  const renderActiveScreen = () => {
    if (showDoctorProfile && selectedDoctor) {
      return (
        <DoctorProfileView
          doctor={{
            id: selectedDoctor.id,
            name: selectedDoctor.name,
            specialty: selectedDoctor.specialization,
            qualification: "MBBS, MD",
            location: "Dombivli, Mumbai",
            patients: 1234,
            experience: 5,
            rating: 4.5,
            about: selectedDoctor.bio,
            services: "Consultation, Therapy, Assessment",
            slots: ["10:00 AM", "01:30 PM", "06:00 PM"],
            image: selectedDoctor.image,
          }}
          onBack={() => setShowDoctorProfile(false)}
        />
      );
    }

    switch (activeTab) {
      case "appointments":
        return <AppointmentsScreen showNotificationIcon={true} />;
      case "records":
        return <PatientRecords />;
      case "profile":
        return <UserProfileScreen />;
      case "find-doctor":
      default:
        return (
          <>
            {/* Header */}
            <div className="bg-white px-6 py-6 shadow-sm">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Hello, Priya
                  </h1>
                  <p className="text-gray-600 text-sm">Dombivli, Mumbai</p>
                </div>
                {/* Logout button only in find-doctor tab */}
                <button
                  className="px-4 py-2 bg-[#46c2de] text-white rounded-lg font-medium hover:bg-[#3bb0ca] transition"
                  onClick={() => {
                    localStorage.removeItem("userRole");
                    localStorage.removeItem("patientPhone");
                    localStorage.removeItem("doctorPhone");
                    localStorage.removeItem("tempDoctorPhone");
                    window.location.href = "/";
                  }}
                >
                  Logout
                </button>
              </div>
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search Doctors"
                  className="pl-10 h-12 rounded-full border-gray-200 bg-gray-50 focus:bg-white focus:border-[#46c2de] focus:ring-2 focus:ring-[#46c2de]/20"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Doctor List */}
            <div className="px-6 py-4 space-y-4">
              {loading ? (
                <div className="text-center text-gray-500">Loading doctors...</div>
              ) : error ? (
                <div className="text-center text-red-500">{error}</div>
              ) : filteredDoctors.length === 0 ? (
                <div className="text-center text-gray-400">No doctors found.</div>
              ) : (
                filteredDoctors.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))
              )}
            </div>
          </>
        );
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div className="flex-1 pb-24">{renderActiveScreen()}</div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-t border-t border-gray-100">
        <div className="flex items-center justify-around py-2">
          {[
            { key: "find-doctor", icon: Stethoscope, label: "Find a Doctor" },
            { key: "appointments", icon: Calendar, label: "Appointments" },
            { key: "records", icon: FileText, label: "Records" },
            { key: "profile", icon: User, label: "Profile" },
          ].map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => {
                setShowDoctorProfile(false);
                setActiveTab(key as typeof activeTab);
              }}
              className={`flex flex-col items-center px-4 py-2 transition-colors ${
                activeTab === key ? "text-[#46c2de]" : "text-gray-400"
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
