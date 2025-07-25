"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useBooking } from "@/context/BookingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Wifi, Battery, Signal } from "lucide-react";

interface LoginFormData {
  mobile: string;
  password: string;
  rememberMe: boolean;
}

export default function UserLoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const { setCurrentScreen } = useBooking();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      rememberMe: true,
    },
  });

  const onSubmit = (data: LoginFormData) => {
    // Allow any 10-digit mobile number and any password
    if (data.mobile.length === 10 && data.password.trim()) {
      setCurrentScreen("otp");
    }
  };

  return (
    <div
      className="min-h-screen bg-white flex flex-col"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-2xl font-normal text-gray-800 leading-relaxed">
            Hi there welcome to{" "}
            <span className="text-[#46c2de] font-semibold">Shedula</span>
          </h1>
        </div>

        {/* Login Form */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Login</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Mobile Number Input */}
            <div className="space-y-2">
              <Label
                htmlFor="mobile"
                className="text-sm font-medium text-gray-700"
              >
                Enter Your Mobile Number *
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

            {/* Password Input */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Enter password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  {...register("rememberMe")}
                  className="data-[state=checked]:bg-[#46c2de] data-[state=checked]:border-[#46c2de]"
                />
                <Label htmlFor="rememberMe" className="text-sm text-gray-700">
                  Remember Me
                </Label>
              </div>
              <button
                type="button"
                className="text-sm text-red-500 hover:text-red-600 font-medium"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-[#46c2de] hover:bg-[#3bb5d1] text-white font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98]"
            >
              Login
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or login with</span>
            </div>
          </div>

          {/* Google Login Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <button className="text-[#46c2de] font-semibold hover:text-[#3bb5d1] transition-colors">
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
