"use client";

import { useState } from "react";
import { useBooking } from "@/context/BookingContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { API_ENDPOINTS } from "@/lib/config";
import { userStorage, storageUtils } from "@/lib/storage";

export default function UserSignUpScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { setCurrentScreen } = useBooking();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("=== PATIENT SIGNUP ATTEMPT ===");
    console.log("Form values:", { fullName, mobile, email });

    // Validate required fields
    if (!fullName || !mobile || !email || !password || !confirmPassword) {
      alert("Please fill in all required fields!");
      return;
    }

    // Validate mobile number format
    if (!/^[0-9]{10}$/.test(mobile)) {
      alert("Please enter a valid 10-digit mobile number!");
      return;
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please enter a valid email address!");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // Get existing users from localStorage
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
      console.log("Existing users:", existingUsers.length);
      
      // Check if user already exists
      const userExists = existingUsers.find((user: any) => user.mobile === mobile);
      if (userExists) {
        alert("User with this mobile number already exists!");
        return;
      }

      // Create new user
      const newUser = {
        id: `user_${Date.now()}`,
        fullName: fullName,
        mobile: mobile,
        email: email,
        password: password, // In real app, this should be hashed
        role: "patient",
        createdAt: new Date().toISOString(),
      };

      console.log("New user data:", newUser);

      // Save user to localStorage using storage utility
      const saveSuccess = userStorage.addUser(newUser);
      if (!saveSuccess) {
        alert("Failed to save user data. Please try again.");
        return;
      }

      // Try to save to JSON server as well (optional) - commented out for now
      /*
      try {
        const response = await fetchWithRetry(API_ENDPOINTS.patients, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUser),
        });

        if (response.ok) {
          console.log("User also saved to JSON server successfully");
        } else {
          console.log("Failed to save to JSON server, but user is saved locally");
        }
      } catch (serverError) {
        console.log("Server error, but user is saved locally:", serverError);
      }
      */

      console.log("User saved successfully");
      
      // Show success message and redirect to login
      alert("Account created successfully! Please login.");
      setCurrentScreen("login");
    } catch (error) {
      console.error("Signup error:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      alert("Registration failed. Please try again.");
    }
  };

  const handleBackToLogin = () => {
    setCurrentScreen("login");
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 md:px-8"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {/* Mobile Layout */}
      <div className="w-full max-w-md md:hidden">
        {/* Header Section */}
        <div className="mb-8">
          <button
            onClick={handleBackToLogin}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </button>
          <h1 className="text-2xl font-normal text-gray-800 leading-relaxed">
            Create your{" "}
            <span className="text-[#46c2de] font-semibold">Shedula</span> account
          </h1>
        </div>

        {/* Sign Up Form */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Sign Up</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name Input */}
            <div className="space-y-2">
              <Label
                htmlFor="fullName"
                className="text-sm font-medium text-gray-700"
              >
                Full Name *
              </Label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="h-12 rounded-lg w-full px-3 py-2 text-sm border border-gray-300 focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20 focus:outline-none"
                required
              />
            </div>

            {/* Mobile Number Input */}
            <div className="space-y-2">
              <Label
                htmlFor="mobile"
                className="text-sm font-medium text-gray-700"
              >
                Mobile Number *
              </Label>
              <input
                id="mobile"
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="9898989898"
                className="h-12 rounded-lg w-full px-3 py-2 text-sm border border-gray-300 focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20 focus:outline-none"
                required
              />
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email Address *
              </Label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="h-12 rounded-lg w-full px-3 py-2 text-sm border border-gray-300 focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20 focus:outline-none"
                required
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password *
              </Label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password (min 6 characters)"
                  className="h-12 rounded-lg w-full px-3 py-2 text-sm border border-gray-300 focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20 focus:outline-none pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700"
              >
                Confirm Password *
              </Label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="h-12 rounded-lg w-full px-3 py-2 text-sm border border-gray-300 focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20 focus:outline-none pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Sign Up Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-[#46C2DE] hover:bg-[#3bb0ca] text-white rounded-lg transition-all duration-200"
            >
              Sign Up
            </Button>
          </form>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <button
                onClick={handleBackToLogin}
                className="text-[#46c2de] font-semibold hover:text-[#3bb5d1] transition-colors"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <Card className="hidden md:block w-full max-w-md shadow-xl border-0">
        <CardContent className="p-8">
          {/* Header Section */}
          <div className="mb-8">
            <button
              onClick={handleBackToLogin}
              className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </button>
            <h1 className="text-2xl font-normal text-gray-800 leading-relaxed">
              Create your{" "}
              <span className="text-[#46c2de] font-semibold">Shedula</span> account
            </h1>
          </div>

          {/* Sign Up Form */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Sign Up</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name Input */}
              <div className="space-y-2">
                <Label
                  htmlFor="fullName-desktop"
                  className="text-sm font-medium text-gray-700"
                >
                  Full Name *
                </Label>
                <input
                  id="fullName-desktop"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="h-12 rounded-lg w-full px-3 py-2 text-sm border border-gray-300 focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20 focus:outline-none"
                  required
                />
              </div>

              {/* Mobile Number Input */}
              <div className="space-y-2">
                <Label
                  htmlFor="mobile-desktop"
                  className="text-sm font-medium text-gray-700"
                >
                  Mobile Number *
                </Label>
                <input
                  id="mobile-desktop"
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="9898989898"
                  className="h-12 rounded-lg w-full px-3 py-2 text-sm border border-gray-300 focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20 focus:outline-none"
                  required
                />
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <Label
                  htmlFor="email-desktop"
                  className="text-sm font-medium text-gray-700"
                >
                  Email Address *
                </Label>
                <input
                  id="email-desktop"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="h-12 rounded-lg w-full px-3 py-2 text-sm border border-gray-300 focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20 focus:outline-none"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label
                  htmlFor="password-desktop"
                  className="text-sm font-medium text-gray-700"
                >
                  Password *
                </Label>
                <div className="relative">
                  <input
                    id="password-desktop"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password (min 6 characters)"
                    className="h-12 rounded-lg w-full px-3 py-2 text-sm border border-gray-300 focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20 focus:outline-none pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword-desktop"
                  className="text-sm font-medium text-gray-700"
                >
                  Confirm Password *
                </Label>
                <div className="relative">
                  <input
                    id="confirmPassword-desktop"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="h-12 rounded-lg w-full px-3 py-2 text-sm border border-gray-300 focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20 focus:outline-none pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Sign Up Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-[#46C2DE] hover:bg-[#3bb0ca] text-white rounded-lg transition-all duration-200"
              >
                Sign Up
              </Button>
            </form>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={handleBackToLogin}
                  className="text-[#46c2de] font-semibold hover:text-[#3bb5d1] transition-colors"
                >
                  Login
                </button>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 