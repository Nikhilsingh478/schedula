"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BookingProvider, useBooking } from "@/context/BookingContext";

import UserLoginScreen from "@/components/screens/UserLoginScreen";
import UserSignUpScreen from "@/components/screens/UserSignUpScreen";
import OTPVerificationScreen from "@/components/screens/OTPVerificationScreen";
import PatientDashboardScreen from "@/components/screens/PatientDashboardScreen";
import DoctorProfilePublic from "@/components/screens/DoctorProfilePublic";
import BookingSchedule from "@/components/screens/BookingSchedule";
import BookingConfirmation from "@/components/screens/BookingConfirmation";
import PatientDetailsUnfilled from "@/components/screens/PatientDetailsUnfilled";
import AppointmentsScreen from "@/components/screens/AppointmentsScreen";
import { UserIcon, Stethoscope } from "lucide-react";

function RoleSelectionScreen({
  onSelect,
}: {
  onSelect: (role: "patient" | "doctor") => void;
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl sm:text-3xl font-semibold text-[#1A1A1A] mb-2">
        Select Your Role
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Choose how you want to continue
      </p>

      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
        <div
          onClick={() => onSelect("patient")}
          className="flex-1 border border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center hover:border-[#46C2DE] hover:shadow-md transition cursor-pointer"
        >
          <UserIcon className="w-8 h-8 text-[#46C2DE] mb-3" />
          <span className="text-lg font-medium text-[#1A1A1A]">Patient</span>
        </div>

        <div
          onClick={() => onSelect("doctor")}
          className="flex-1 border border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center hover:border-[#46C2DE] hover:shadow-md transition cursor-pointer"
        >
          <Stethoscope className="w-8 h-8 text-[#46C2DE] mb-3" />
          <span className="text-lg font-medium text-[#1A1A1A]">Doctor</span>
        </div>
      </div>
    </div>
  );
}

function PatientAppContent() {
  const { currentScreen } = useBooking();

  switch (currentScreen) {
    case "login":
      return <UserLoginScreen />;
    case "signup":
      return <UserSignUpScreen />;
    case "otp":
      return <OTPVerificationScreen />;
    case "doctorList":
      return <PatientDashboardScreen />;
    case "doctorProfile":
      return <DoctorProfilePublic />;
    case "booking":
      return <BookingSchedule />;
    case "confirmation":
      return <BookingConfirmation />;
    case "patientDetails":
      return <PatientDetailsUnfilled />;
    case "appointments":
      return <PatientDashboardScreen />; // Show dashboard with appointments tab
    default:
      return <UserLoginScreen />;
  }
}

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState<"patient" | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialScreen, setInitialScreen] = useState<string>("login");

  useEffect(() => {
    // Only check for patient authentication
    if (typeof window !== 'undefined') {
      const userRole = localStorage.getItem("userRole");
      const currentUser = localStorage.getItem("currentUser");
      const userVerified = localStorage.getItem("userVerified");

      if (userRole === "patient" && currentUser && userVerified) {
        // Patient is logged in, show patient dashboard
        setRole("patient");
        
        // Check URL parameters for tab navigation
        const tabParam = searchParams.get('tab');
        if (tabParam === 'appointments') {
          setInitialScreen("appointments");
        } else {
          // Check if user is returning from booking (show appointments)
          const returnFromBooking = localStorage.getItem("returnFromBooking");
          if (returnFromBooking === "true") {
            setInitialScreen("appointments");
            localStorage.removeItem("returnFromBooking"); // Clear the flag
          }
        }
      } else {
        // No valid patient authentication, show role selection
        setRole(null);
      }
    } else {
      // Server-side rendering, show role selection
      setRole(null);
    }
    
    setLoading(false);
  }, [searchParams]);

  const handleRoleSelect = (selectedRole: "patient" | "doctor") => {
    if (typeof window !== 'undefined') {
      if (selectedRole === "doctor") {
        localStorage.setItem("userRole", "doctor");
        router.replace("/doctor/login");
      } else {
        localStorage.setItem("userRole", "patient");
        setRole("patient");
      }
    }
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#46C2DE] mx-auto mb-4"></div>
          <p className="text-[#46C2DE] font-semibold text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!role) {
    return <RoleSelectionScreen onSelect={handleRoleSelect} />;
  }

  return (
    <BookingProvider initialScreen={initialScreen}>
      <PatientAppContent />
    </BookingProvider>
  );
}
