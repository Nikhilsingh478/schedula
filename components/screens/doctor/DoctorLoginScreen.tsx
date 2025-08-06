"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { storageUtils } from "@/lib/storage";
import { API_ENDPOINTS } from "@/lib/config";

export default function DoctorLoginScreen() {
  const router = useRouter();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    document.body.classList.add("font-poppins");

    // Check if doctor is already logged in and verified
    const currentDoctor = localStorage.getItem("currentDoctor");
    const doctorVerified = localStorage.getItem("doctorVerified");
    const userRole = localStorage.getItem("userRole");

    console.log("DoctorLoginScreen useEffect:", { currentDoctor: !!currentDoctor, doctorVerified, userRole });

    if (currentDoctor && doctorVerified && userRole === "doctor") {
      console.log("Doctor already logged in, redirecting to main");
      router.replace("/doctor");
    }
  }, [router]);

  const handleSimpleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("=== DOCTOR LOGIN ATTEMPT ===");
    console.log("Form values:", { mobile, password });
    
    if (!mobile || !password) {
      alert("Please enter both mobile and password!");
      return;
    }
    
    try {
      // Step 1: Get doctors from localStorage first
      let doctors = JSON.parse(localStorage.getItem("doctors") || "[]");
      console.log("Step 1 - Doctors in localStorage:", doctors.length);
      
      // Step 2: If no doctors in localStorage, fetch from server
      if (doctors.length === 0) {
        console.log("Step 2 - No doctors in localStorage, fetching from server...");
        try {
          const response = await fetch(API_ENDPOINTS.doctors);
          console.log("Server response status:", response.status);
          
          if (response.ok) {
            const serverDoctors = await response.json();
            console.log("Step 2 - Doctors from server:", serverDoctors.length);
            
            // Add default passwords to server doctors
            const doctorsWithPasswords = serverDoctors.map((d: any) => ({
              ...d,
              password: "123456"
            }));
            
            // Store in localStorage
            localStorage.setItem("doctors", JSON.stringify(doctorsWithPasswords));
            doctors = doctorsWithPasswords;
            console.log("Step 2 - Doctors stored in localStorage");
          } else {
            console.error("Server response not ok:", response.status, response.statusText);
            alert("Failed to fetch doctors from server. Please try again.");
            return;
          }
        } catch (serverError) {
          console.error("Step 2 - Server fetch error:", serverError);
          alert("Network error. Please check your connection and try again.");
          return;
        }
      }
      
      // Step 3: Find doctor by phone number
      console.log("Step 3 - Looking for doctor with phone:", mobile);
      const doctor = doctors.find((d: any) => d.phone === mobile);
      console.log("Step 3 - Found doctor:", doctor ? "YES" : "NO");
      
      if (!doctor) {
        const availablePhones = doctors.map((d: any) => d.phone).join(", ");
        alert(`Doctor not found! Available phone numbers: ${availablePhones}`);
        return;
      }
      
      // Step 4: Check password
      console.log("Step 4 - Checking password...");
      console.log("Expected password:", doctor.password);
      console.log("Provided password:", password);
      
      if (doctor.password !== password) {
        alert(`Invalid password! Please use: ${doctor.password}`);
        return;
      }
      
      // Step 5: Store authentication data
      console.log("Step 5 - Authentication successful, storing data...");
      
      try {
        // Store essential doctor data without clearing everything
        storageUtils.storeDoctor(doctor);
        storageUtils.setItem("doctorPhone", mobile);
        storageUtils.setItem("userRole", "doctor");
        storageUtils.setItem("doctorVerified", "true");
        
        console.log("Step 5 - Data stored successfully");
        console.log("Step 5 - Navigating to dashboard...");
        
        // Navigate to dashboard using window.location for more reliable navigation
        console.log("Navigating to /doctor using window.location");
        window.location.href = "/doctor";
      } catch (storageError) {
        console.error("Step 5 - Storage error:", storageError);
        alert("Failed to save login data. Please try again.");
        return;
      }
      
    } catch (error) {
      console.error("=== LOGIN ERROR ===", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const handleSignUp = () => {
    // Navigate to signup screen
    window.location.href = "/doctor?screen=signup";
  };





  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 md:px-8">
      {/* Mobile Layout */}
      <div className="w-full max-w-md md:hidden bg-white rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#1A1A1A] mb-2 text-center">
          Doctor Login
        </h1>
        <p className="text-sm text-gray-500 mb-8 text-center">
          Enter your credentials to login
        </p>

        <form onSubmit={handleSimpleSubmit} className="w-full space-y-6">
          <div>
            <Label
              htmlFor="mobile"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Phone Number
            </Label>
            <input
              type="tel"
              id="mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter 10-digit phone number"
              className="h-12 rounded-lg w-full px-3 py-2 text-sm border border-gray-300 focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20 focus:outline-none"
            />
          </div>

          <div>
            <Label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="h-12 rounded-lg w-full px-3 py-2 text-sm border border-gray-300 focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20 focus:outline-none"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-[#46C2DE] hover:bg-[#3bb0ca] text-white rounded-lg transition-all duration-200"
          >
            Login
          </Button>


        </form>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <button 
              onClick={handleSignUp}
              className="text-[#46c2de] font-semibold hover:text-[#3bb5d1] transition-colors"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>

      {/* Desktop Layout - Card Centered */}
      <Card className="hidden md:block w-full max-w-md shadow-xl border-0">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-[#1A1A1A] mb-2">
              Doctor Login
            </h1>
            <p className="text-gray-500">
              Enter your credentials to login
            </p>
          </div>

          <form onSubmit={handleSimpleSubmit} className="w-full space-y-6">
            <div>
              <Label
                htmlFor="mobile-desktop"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Phone Number
              </Label>
              <input
                type="tel"
                id="mobile-desktop"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter 10-digit phone number"
                className="h-12 rounded-lg w-full px-3 py-2 text-sm border border-gray-300 focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20 focus:outline-none"
              />
            </div>

            <div>
              <Label
                htmlFor="password-desktop"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Password
              </Label>
              <input
                type="password"
                id="password-desktop"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="h-12 rounded-lg w-full px-3 py-2 text-sm border border-gray-300 focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20 focus:outline-none"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#46C2DE] hover:bg-[#3bb0ca] text-white rounded-lg transition-all duration-200"
            >
              Login
            </Button>


          </form>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <button 
                onClick={handleSignUp}
                className="text-[#46c2de] font-semibold hover:text-[#3bb5d1] transition-colors"
              >
                Sign Up
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
