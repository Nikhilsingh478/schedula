"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useBooking } from "@/context/BookingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

interface SignUpFormData {
  fullName: string;
  mobile: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function UserSignUpScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { setCurrentScreen } = useBooking();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>();

  const password = watch("password");

  const onSubmit = (data: SignUpFormData) => {
    // Validate passwords match
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Get existing users from localStorage
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    
    // Check if user already exists
    const userExists = existingUsers.find((user: any) => user.mobile === data.mobile);
    if (userExists) {
      alert("User with this mobile number already exists!");
      return;
    }

    // Create new user
    const newUser = {
      id: `user_${Date.now()}`,
      fullName: data.fullName,
      mobile: data.mobile,
      email: data.email,
      password: data.password, // In real app, this should be hashed
      role: "patient",
      createdAt: new Date().toISOString(),
    };

    // Save user to localStorage
    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // Show success message and redirect to login
    alert("Account created successfully! Please login.");
    setCurrentScreen("login");
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name Input */}
            <div className="space-y-2">
              <Label
                htmlFor="fullName"
                className="text-sm font-medium text-gray-700"
              >
                Full Name *
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                {...register("fullName", {
                  required: "Full name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                className="h-12 rounded-lg border-gray-300 focus:border-[#46c2de] focus:ring-2 focus:ring-[#46c2de]/20"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm">{errors.fullName.message}</p>
              )}
            </div>

            {/* Mobile Number Input */}
            <div className="space-y-2">
              <Label
                htmlFor="mobile"
                className="text-sm font-medium text-gray-700"
              >
                Mobile Number *
              </Label>
              <Input
                id="mobile"
                type="tel"
                placeholder="9898989898"
                {...register("mobile", {
                  required: "Mobile number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Please enter a valid 10-digit mobile number",
                  },
                })}
                className="h-12 rounded-lg border-gray-300 focus:border-[#46c2de] focus:ring-2 focus:ring-[#46c2de]/20"
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm">{errors.mobile.message}</p>
              )}
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Please enter a valid email address",
                  },
                })}
                className="h-12 rounded-lg border-gray-300 focus:border-[#46c2de] focus:ring-2 focus:ring-[#46c2de]/20"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
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
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="h-12 rounded-lg border-gray-300 focus:border-[#46c2de] focus:ring-2 focus:ring-[#46c2de]/20 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
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
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  className="h-12 rounded-lg border-gray-300 focus:border-[#46c2de] focus:ring-2 focus:ring-[#46c2de]/20 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Sign Up Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-[#46c2de] hover:bg-[#3bb5d1] text-white font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98]"
            >
              Create Account
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Already have an account?{" "}
              <button 
                onClick={handleBackToLogin}
                className="text-[#46c2de] font-semibold hover:text-[#3bb5d1] transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Card Centered */}
      <Card className="hidden md:block w-full max-w-md shadow-xl border-0">
        <CardContent className="p-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <button
              onClick={handleBackToLogin}
              className="flex items-center text-gray-600 hover:text-gray-800 mb-4 mx-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </button>
            <h1 className="text-2xl font-normal text-gray-800 leading-relaxed mb-2">
              Create your{" "}
              <span className="text-[#46c2de] font-semibold">Shedula</span> account
            </h1>
            <h2 className="text-3xl font-bold text-gray-900">Sign Up</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name Input */}
            <div className="space-y-2">
              <Label
                htmlFor="fullName-desktop"
                className="text-sm font-medium text-gray-700"
              >
                Full Name *
              </Label>
              <Input
                id="fullName-desktop"
                type="text"
                placeholder="Enter your full name"
                {...register("fullName", {
                  required: "Full name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                className="h-12 rounded-lg border-gray-300 focus:border-[#46c2de] focus:ring-2 focus:ring-[#46c2de]/20"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm">{errors.fullName.message}</p>
              )}
            </div>

            {/* Mobile Number Input */}
            <div className="space-y-2">
              <Label
                htmlFor="mobile-desktop"
                className="text-sm font-medium text-gray-700"
              >
                Mobile Number *
              </Label>
              <Input
                id="mobile-desktop"
                type="tel"
                placeholder="9898989898"
                {...register("mobile", {
                  required: "Mobile number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Please enter a valid 10-digit mobile number",
                  },
                })}
                className="h-12 rounded-lg border-gray-300 focus:border-[#46c2de] focus:ring-2 focus:ring-[#46c2de]/20"
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm">{errors.mobile.message}</p>
              )}
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Label
                htmlFor="email-desktop"
                className="text-sm font-medium text-gray-700"
              >
                Email Address *
              </Label>
              <Input
                id="email-desktop"
                type="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Please enter a valid email address",
                  },
                })}
                className="h-12 rounded-lg border-gray-300 focus:border-[#46c2de] focus:ring-2 focus:ring-[#46c2de]/20"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
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
                <Input
                  id="password-desktop"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="h-12 rounded-lg border-gray-300 focus:border-[#46c2de] focus:ring-2 focus:ring-[#46c2de]/20 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
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
                <Input
                  id="confirmPassword-desktop"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  className="h-12 rounded-lg border-gray-300 focus:border-[#46c2de] focus:ring-2 focus:ring-[#46c2de]/20 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Sign Up Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-[#46c2de] hover:bg-[#3bb5d1] text-white font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98]"
            >
              Create Account
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Already have an account?{" "}
              <button 
                onClick={handleBackToLogin}
                className="text-[#46c2de] font-semibold hover:text-[#3bb5d1] transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 