"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DoctorLoginScreen from "@/components/screens/doctor/DoctorLoginScreen";
import DoctorSignUpScreen from "@/components/screens/DoctorSignUpScreen";
import DoctorMainScreen from "@/components/screens/doctor/DoctorMainScreen";

export default function DoctorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentScreen, setCurrentScreen] = useState<string>("login");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for doctor authentication
    if (typeof window !== 'undefined') {
      const userRole = localStorage.getItem("userRole");
      const currentDoctor = localStorage.getItem("currentDoctor");
      const doctorVerified = localStorage.getItem("doctorVerified");
      const screenParam = searchParams.get('screen');

      console.log("Doctor auth check - userRole:", userRole);
      console.log("Doctor auth check - currentDoctor exists:", !!currentDoctor);
      console.log("Doctor auth check - doctorVerified:", doctorVerified);
      console.log("Doctor auth check - screenParam:", screenParam);

      if (userRole === "doctor" && currentDoctor && doctorVerified) {
        // Doctor is logged in, show main dashboard
        console.log("Setting screen to main - doctor is authenticated");
        setCurrentScreen("main");
      } else if (screenParam === "signup") {
        // Show signup screen if requested
        console.log("Setting screen to signup - requested via URL");
        setCurrentScreen("signup");
      } else {
        // No valid doctor authentication, show login
        console.log("Setting screen to login - no valid authentication");
        setCurrentScreen("login");
      }
    } else {
      // Server-side rendering, show login
      setCurrentScreen("login");
    }
    
    // Set loading to false with a small delay to ensure state updates
    setTimeout(() => {
      console.log("Setting loading to false after timeout");
      setLoading(false);
    }, 100);
  }, [searchParams]);

  // Force loading to false after 5 seconds to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.log("Forcing loading to false after timeout");
        setLoading(false);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [loading]);

  const handleScreenChange = (screen: string) => {
    setCurrentScreen(screen);
  };

  // Show loading while checking authentication with timeout
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#46C2DE] mx-auto mb-4"></div>
          <p className="text-[#46C2DE] font-semibold text-lg">Loading...</p>
          <p className="text-gray-500 text-sm mt-2">If this takes too long, please refresh the page</p>
        </div>
      </div>
    );
  }

  switch (currentScreen) {
    case "login":
      return <DoctorLoginScreen />;
    case "signup":
      return <DoctorSignUpScreen />;
    case "main":
      return <DoctorMainScreen />;
    default:
      return <DoctorLoginScreen />;
  }
} 