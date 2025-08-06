"use client";

import { useState } from "react";
import { useBooking } from "@/context/BookingContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { storageUtils } from "@/lib/storage";

export default function UserLoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const { setCurrentScreen } = useBooking();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("=== PATIENT LOGIN ATTEMPT ===");
    console.log("Form values:", { mobile, password, rememberMe });

    // Validate required fields
    if (!mobile || !password) {
      alert("Please enter both mobile number and password!");
      return;
    }

    // Validate mobile number format
    if (!/^[0-9]{10}$/.test(mobile)) {
      alert("Please enter a valid 10-digit mobile number!");
      return;
    }

    try {
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      console.log("Users in localStorage:", users.length);

      // Find user by mobile number
      const user = users.find((u: any) => u.mobile === mobile);
      
      if (!user) {
        alert("User not found! Please sign up first.");
        return;
      }
      
      // Check password
      if (user.password !== password) {
        alert("Invalid password!");
        return;
      }
      
      console.log("Login successful, storing user data...");
      
      // Use storage utility to prevent quota issues
      storageUtils.clearAll();
      storageUtils.storeUser(user);
      storageUtils.setItem("userRole", "patient");
      storageUtils.setItem("userVerified", "true");
      
      console.log("User data stored, proceeding to OTP verification...");
      
      // Proceed to OTP verification
      setCurrentScreen("otp");
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    }
  };

  const handleSignUp = () => {
    setCurrentScreen("signup");
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
          <h1 className="text-2xl font-normal text-gray-800 leading-relaxed">
            Hi there welcome to{" "}
            <span className="text-[#46c2de] font-semibold">Shedula</span>
          </h1>
        </div>

        {/* Login Form */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Login</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mobile Number Input */}
            <div className="space-y-2">
              <Label
                htmlFor="mobile"
                className="text-sm font-medium text-gray-700"
              >
                Enter Your Mobile Number *
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

            {/* Password Input */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Enter Your Password *
              </Label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
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

            {/* Remember Me Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label
                htmlFor="rememberMe"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </Label>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-[#46C2DE] hover:bg-[#3bb0ca] text-white rounded-lg transition-all duration-200"
            >
              Login
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center">
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
      </div>

      {/* Desktop Layout */}
      <Card className="hidden md:block w-full max-w-md shadow-xl border-0">
        <CardContent className="p-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-normal text-gray-800 leading-relaxed">
              Hi there welcome to{" "}
              <span className="text-[#46c2de] font-semibold">Shedula</span>
            </h1>
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Login</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Mobile Number Input */}
              <div className="space-y-2">
                <Label
                  htmlFor="mobile-desktop"
                  className="text-sm font-medium text-gray-700"
                >
                  Enter Your Mobile Number *
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

              {/* Password Input */}
              <div className="space-y-2">
                <Label
                  htmlFor="password-desktop"
                  className="text-sm font-medium text-gray-700"
                >
                  Enter Your Password *
                </Label>
                <div className="relative">
                  <input
                    id="password-desktop"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
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

              {/* Remember Me Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe-desktop"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label
                  htmlFor="rememberMe-desktop"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </Label>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-[#46C2DE] hover:bg-[#3bb0ca] text-white rounded-lg transition-all duration-200"
              >
                Login
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center">
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
        </CardContent>
      </Card>
    </div>
  );
}
