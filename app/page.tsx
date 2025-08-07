"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserIcon, Stethoscope } from "lucide-react";

function RoleSelectionScreen({
  onSelect,
}: {
  onSelect: (role: "patient" | "doctor") => void;
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl sm:text-3xl font-semibold text-[#1A1A1A] mb-2">
        Welcome to Schedula
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

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  console.log("🏠 Home page component loaded");

  useEffect(() => {
    // Check if user is already authenticated
    if (typeof window !== 'undefined') {
      // Force clear any existing authentication data to start fresh
      localStorage.removeItem("currentUser");
      localStorage.removeItem("userVerified");
      localStorage.removeItem("userRole");
      localStorage.removeItem("currentDoctor");
      localStorage.removeItem("doctorVerified");
      
      console.log("🧹 Cleared all authentication data");
      
      // Show role selection
      console.log("👤 Showing role selection");
      setLoading(false);
    }
  }, [router]);

  const handleRoleSelect = (selectedRole: "patient" | "doctor") => {
    if (selectedRole === "doctor") {
      // Clear any existing authentication data when switching to doctor
      localStorage.removeItem("currentUser");
      localStorage.removeItem("userVerified");
      localStorage.removeItem("userRole");
      localStorage.setItem("userRole", "doctor");
      router.replace("/doctor");
    } else {
      // Clear any existing authentication data when switching to patient
      localStorage.removeItem("currentDoctor");
      localStorage.removeItem("doctorVerified");
      localStorage.removeItem("userRole");
      localStorage.setItem("userRole", "patient");
      router.replace("/patient");
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

  // Show role selection screen
  console.log("🎯 Rendering role selection screen");
  return <RoleSelectionScreen onSelect={handleRoleSelect} />;
}
