"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookingProvider, useBooking } from "@/context/BookingContext";

import UserLoginScreen from "@/components/screens/UserLoginScreen";
import OTPVerificationScreen from "@/components/screens/OTPVerificationScreen";
import PatientDashboardScreen from "@/components/screens/PatientDashboardScreen";
import DoctorProfilePublic from "@/components/screens/DoctorProfilePublic";
import BookingSchedule from "@/components/screens/BookingSchedule";
import BookingConfirmation from "@/components/screens/BookingConfirmation";
import PatientDetailsUnfilled from "@/components/screens/PatientDetailsUnfilled";
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
    default:
      return <UserLoginScreen />;
  }
}

export default function Home() {
  const router = useRouter();
  const [role, setRole] = useState<"patient" | null>(null); // default: no role selected

  const handleRoleSelect = (selectedRole: "patient" | "doctor") => {
    if (selectedRole === "doctor") {
      localStorage.setItem("userRole", "doctor");
      router.replace("/doctor/login");
    } else {
      localStorage.setItem("userRole", "patient");
      setRole("patient");
    }
  };

  if (!role) {
    return <RoleSelectionScreen onSelect={handleRoleSelect} />;
  }

  return (
    <BookingProvider>
      <PatientAppContent />
    </BookingProvider>
  );
}
