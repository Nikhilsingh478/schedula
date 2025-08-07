"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserLoginScreen from "@/components/screens/UserLoginScreen";
import UserSignUpScreen from "@/components/screens/UserSignUpScreen";
import OTPVerificationScreen from "@/components/screens/OTPVerificationScreen";
import PatientDashboardScreen from "@/components/screens/PatientDashboardScreen";
import DoctorProfilePublic from "@/components/screens/DoctorProfilePublic";
import BookingSchedule from "@/components/screens/BookingSchedule";
import BookingConfirmation from "@/components/screens/BookingConfirmation";
import PatientDetailsUnfilled from "@/components/screens/PatientDetailsUnfilled";
import { BookingProvider, useBooking } from "@/context/BookingContext";

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
      return <PatientDashboardScreen />;
    default:
      return <UserLoginScreen />;
  }
}

export default function PatientPage() {
  const router = useRouter();
  const [initialScreen, setInitialScreen] = useState<string>("login");

  useEffect(() => {
    // Check if patient is already authenticated
    if (typeof window !== 'undefined') {
      const userRole = localStorage.getItem("userRole");
      const currentUser = localStorage.getItem("currentUser");
      const userVerified = localStorage.getItem("userVerified");

      if (userRole === "patient" && currentUser && userVerified) {
        // Patient is logged in, show dashboard
        setInitialScreen("doctorList");
      } else {
        // Patient not logged in, show login
        setInitialScreen("login");
      }
    }
  }, []);

  return (
    <BookingProvider initialScreen={initialScreen}>
      <PatientAppContent />
    </BookingProvider>
  );
} 