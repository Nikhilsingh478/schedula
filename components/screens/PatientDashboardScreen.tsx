"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useBooking } from "@/context/BookingContext";
import { API_ENDPOINTS } from "@/lib/config";
import { Input } from "@/components/ui/input";
import {
  Search,
  Stethoscope,
  Calendar,
  FileText,
  User,
  LogOut,
  Heart,
  Star,
  MapPin,
  Clock,
  Users,
  AlertCircle,
} from "lucide-react";
import AppointmentsScreen from "@/components/screens/AppointmentsScreen";
import PatientRecords from "@/components/screens/PatientRecords";
import UserProfileScreen from "@/components/screens/UserProfileScreen";
import DoctorProfileView from "@/components/screens/DoctorProfileView";
import { useModal } from "@/hooks/useModal";
import Modal from "@/components/ui/Modal";

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
};

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
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setCurrentScreen } = useBooking();
  const { modal, confirm } = useModal();

  useEffect(() => {
    // Get current user from localStorage
    const userData = localStorage.getItem("currentUser");
    const userVerified = localStorage.getItem("userVerified");
    const userRole = localStorage.getItem("userRole");

    if (!userData || !userVerified || userRole !== "patient") {
      // Only redirect if we're sure the user is not authenticated
      if (authChecked) {
        // Redirect to login screen instead of home page
        setCurrentScreen("login");
      }
      return;
    }

    try {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      setAuthChecked(true);
    } catch (err) {
      console.error("Error parsing user data:", err);
      if (authChecked) {
        setCurrentScreen("login");
      }
      return;
    }

    // Load doctors data from both JSON server and localStorage
    setLoading(true);
    const fetchAllDoctors = async () => {
      try {
        // Try to fetch from JSON server first
        let jsonServerDoctors = [];
        try {
          const jsonServerResponse = await fetch(API_ENDPOINTS.doctors);
          if (jsonServerResponse.ok) {
            jsonServerDoctors = await jsonServerResponse.json();
          }
        } catch (serverError) {
          console.log("JSON server not available, using localStorage only");
        }

        // Get doctors from localStorage (newly registered doctors)
        const localStorageDoctors = JSON.parse(localStorage.getItem("doctors") || "[]");
        
        // Combine and deduplicate doctors
        const allDoctors = [...jsonServerDoctors];
        
        // Add localStorage doctors that aren't in JSON server
        localStorageDoctors.forEach((localDoctor: any) => {
          const exists = allDoctors.find((d: any) => d.id === localDoctor.id);
          if (!exists) {
            allDoctors.push(localDoctor);
          }
        });

        // Convert to the format expected by the component
        const formattedDoctors = allDoctors.map((doctor: any) => ({
          id: doctor.id,
          name: doctor.name,
          specialization: doctor.specialization,
          availability: doctor.availability || "Available Today",
          bio: doctor.bio || doctor.about || "Experienced medical professional dedicated to patient care.",
          workingHours: doctor.workingHours || "Mon-Fri: 9:00 AM - 6:00 PM",
          image: doctor.image,
          isFavorite: false, // Default to not favorite
          qualification: doctor.qualification,
          location: doctor.location,
          patients: doctor.patients,
          experience: doctor.experience,
          rating: doctor.rating,
          about: doctor.about,
        }));

        setDoctors(formattedDoctors);
      } catch (err) {
        console.error("Error loading doctors:", err);
        setError("Failed to load doctors");
      } finally {
        setLoading(false);
      }
    };

    fetchAllDoctors();
  }, [authChecked, setCurrentScreen]);

  useEffect(() => {
    // Check if returning from booking
    const returnFromBooking = localStorage.getItem("returnFromBooking");
    if (returnFromBooking === "true") {
      setActiveTab("appointments");
      localStorage.removeItem("returnFromBooking"); // Clear the flag
    }
  }, []);

  // Check URL parameters for tab navigation
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'appointments') {
      setActiveTab("appointments");
    }
  }, [searchParams]);



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
      doctor.specialization.toLowerCase().includes(term)
    );
  });

  const DoctorCard = ({ doctor }: { doctor: Doctor }) => (
    <div
      onClick={() => {
        setSelectedDoctor(doctor);
        setShowDoctorProfile(true);
      }}
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden hover:border-[#46C2DE]/20"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#46C2DE]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative p-6">
        <div className="flex gap-4">
          {/* Doctor Image */}
          <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0">
            {doctor.image ? (
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-full h-full rounded-full object-cover border-2 border-[#46C2DE]/10 shadow-lg group-hover:border-[#46C2DE]/30 transition-all duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop";
                }}
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-[#46C2DE] to-[#3bb0ca] flex items-center justify-center border-2 border-[#46C2DE]/10 shadow-lg group-hover:border-[#46C2DE]/30 transition-all duration-300">
                <span className="text-white text-xl md:text-2xl font-bold">{doctor.name?.charAt(0) || "D"}</span>
              </div>
            )}
            {/* Online status indicator */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </div>
          </div>

          {/* Doctor Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg md:text-xl mb-1">
                  {doctor.name}
                </h3>
                <p className="text-[#46C2DE] font-semibold text-sm md:text-base mb-1">
                  {doctor.specialization}
                </p>
                {doctor.qualification && (
                  <p className="text-gray-600 text-xs md:text-sm font-medium mb-1">
                    {doctor.qualification}
                  </p>
                )}
                {doctor.location && (
                  <div className="flex items-center text-gray-500 text-xs md:text-sm">
                    <MapPin className="w-3 h-3 mr-1" />
                    {doctor.location}
                  </div>
                )}
              </div>
              
              {/* Favorite Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(doctor.id);
                }}
                className="p-2 hover:bg-red-50 rounded-full transition-all duration-300 group/fav"
              >
                <Heart
                  className={`w-5 h-5 md:w-6 md:h-6 transition-all duration-300 ${
                    doctor.isFavorite
                      ? "text-red-500 fill-current scale-110"
                      : "text-gray-400 group-hover/fav:text-red-400"
                  }`}
                />
              </button>
            </div>

            {/* Stats Row */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4 text-sm">
                {doctor.experience && (
                  <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                    <span className="font-bold text-[#46C2DE]">{doctor.experience}+</span>
                    <span className="ml-1 text-gray-600">years</span>
                  </div>
                )}
                {doctor.rating && (
                  <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                    <Star className="w-3 h-3 text-yellow-500 mr-1 fill-current" />
                    <span className="font-bold text-yellow-600">{doctor.rating}</span>
                  </div>
                )}
                {doctor.patients && (
                  <div className="flex items-center bg-green-50 px-3 py-1 rounded-full">
                    <Users className="w-3 h-3 text-green-500 mr-1" />
                    <span className="font-bold text-green-600">{doctor.patients.toLocaleString()}</span>
                  </div>
                )}
              </div>
              
              {/* Availability Badge */}
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                {doctor.availability}
              </div>
            </div>

            {/* Additional Info */}
            <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  15 min slots
                </span>
                <span className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  In-person & Video
                </span>
              </div>
              <div className="text-[#46C2DE] font-semibold">
                Book Now →
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const handleLogout = () => {
    confirm(
      "Confirm Logout",
      "Are you sure you want to log out? You will need to log in again to access your dashboard.",
      () => {
        // Clear all user-related data
        localStorage.removeItem("currentUser");
        localStorage.removeItem("userVerified");
        localStorage.removeItem("userRole");
        
        window.location.href = "/";
      }
    );
  };

  // Don't render anything until authentication is checked
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#46C2DE] mx-auto mb-4"></div>
          <p className="text-[#46C2DE] font-semibold text-lg">Loading...</p>
        </div>
      </div>
    );
  }

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
            <div className="bg-white px-4 md:px-8 py-6 shadow-sm">
              <div className="max-w-7xl mx-auto">
              <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                    Hello, {currentUser?.fullName || "User"}
                  </h1>
                    <p className="text-gray-600 text-sm md:text-base">Dombivli, Mumbai</p>
                </div>
                {/* Logout button only in find-doctor tab */}
                <button
                    className="px-4 py-2 bg-[#46c2de] text-white rounded-lg font-medium hover:bg-[#3bb0ca] transition flex items-center gap-2"
                  onClick={handleLogout}
                >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden md:inline">Logout</span>
                </button>
              </div>
              {/* Search Bar */}
                <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search Doctors"
                  className="pl-10 h-12 rounded-full border-gray-200 bg-gray-50 focus:bg-white focus:border-[#46c2de] focus:ring-2 focus:ring-[#46c2de]/20"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                </div>
              </div>
            </div>

            {/* Doctor List */}
            <div className="px-4 md:px-8 py-6">
              <div className="max-w-7xl mx-auto">
                {/* Results Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                      Available Doctors
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} found
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>Sort by:</span>
                    <select className="border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#46C2DE]/20">
                      <option>Experience</option>
                      <option>Rating</option>
                      <option>Availability</option>
                    </select>
                  </div>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#46C2DE] mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading doctors...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                      </div>
                      <p className="text-red-600 font-medium mb-2">Error loading doctors</p>
                      <p className="text-gray-500 text-sm">{error}</p>
                    </div>
                  </div>
                ) : filteredDoctors.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Stethoscope className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-600 font-medium mb-2">No doctors found</p>
                      <p className="text-gray-500 text-sm">Try adjusting your search criteria</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 md:space-y-6">
                    {filteredDoctors.map((doctor) => (
                      <DoctorCard key={doctor.id} doctor={doctor} />
                    ))}
                  </div>
                )}
              </div>
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
      {/* Modal */}
      <Modal {...modal} />
      
      {/* Desktop Sidebar Navigation */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-gray-200">
        <div className="flex-1 flex flex-col min-h-0">
          {/* Logo/Brand */}
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-[#46c2de]">Schedula</h1>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
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
                className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === key
                    ? "bg-[#46c2de] text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-[#46c2de] rounded-full flex items-center justify-center text-white font-semibold mr-3">
                {currentUser?.fullName?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">
                  {currentUser?.fullName || "User"}
                </p>
                <p className="text-gray-500 text-xs">Patient</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 mr-3" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:ml-64 flex-1">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white px-4 py-4 shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-900">Schedula</h1>
            <div className="flex items-center space-x-2">
              {/* <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5" />
              </button> */}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {renderActiveScreen()}
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-t border-t border-gray-200 z-50">
          <div className="flex items-center justify-around py-2">
            {[
              { key: "find-doctor", icon: Stethoscope, label: "Doctors" },
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
    </div>
  );
}
