"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  mobile: z
    .string()
    .min(10, "Phone number must be 10 digits")
    .max(10, "Phone number must be 10 digits")
    .regex(/^[6-9]\d{9}$/, "Enter a valid Indian phone number"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export default function DoctorLoginScreen() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    document.body.classList.add("font-poppins");

    // Check if doctor is already logged in and verified
    const currentDoctor = localStorage.getItem("currentDoctor");
    const doctorVerified = localStorage.getItem("doctorVerified");
    const userRole = localStorage.getItem("userRole");

    if (currentDoctor && doctorVerified && userRole === "doctor") {
      router.replace("/doctor/main");
    }
  }, [router]);

  const onSubmit = (data: FormData) => {
    // Get doctors from localStorage
    const doctors = JSON.parse(localStorage.getItem("doctors") || "[]");
    
    // Find doctor by phone number
    const doctor = doctors.find((d: any) => d.phone === data.mobile);
    
    if (!doctor) {
      alert("Doctor not found! Please sign up first.");
      return;
    }
    
    // Check password
    if (doctor.password !== data.password) {
      alert("Invalid password!");
      return;
    }
    
    // Store logged in doctor info
    localStorage.setItem("currentDoctor", JSON.stringify(doctor));
    localStorage.setItem("doctorPhone", data.mobile);
    localStorage.setItem("userRole", "doctor");
    
    // Proceed to OTP verification
    router.push("/doctor/verify-otp");
  };

  const handleSignUp = () => {
    router.push("/doctor/signup");
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

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <div>
            <Label
              htmlFor="mobile"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Phone Number
            </Label>
            <Input
              type="tel"
              id="mobile"
              placeholder="Enter 10-digit phone number"
              {...register("mobile")}
              className={`h-12 rounded-lg ${
                errors.mobile ? "border-red-500" : "border-gray-300"
              } focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20`}
            />
            {errors.mobile && (
              <p className="text-red-500 text-sm mt-1">{errors.mobile.message}</p>
            )}
          </div>

          <div>
            <Label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <Input
              type="password"
              id="password"
              placeholder="Enter your password"
              {...register("password")}
              className={`h-12 rounded-lg ${
                errors.password ? "border-red-500" : "border-gray-300"
              } focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-[#46C2DE] hover:bg-[#3bb0ca] text-white rounded-lg transition-all duration-200 disabled:opacity-50"
          >
            {isSubmitting ? "Logging in..." : "Login"}
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

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <div>
              <Label
                htmlFor="mobile-desktop"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Phone Number
              </Label>
              <Input
                type="tel"
                id="mobile-desktop"
                placeholder="Enter 10-digit phone number"
                {...register("mobile")}
                className={`h-12 rounded-lg ${
                  errors.mobile ? "border-red-500" : "border-gray-300"
                } focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20`}
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm mt-1">{errors.mobile.message}</p>
              )}
            </div>

            <div>
              <Label
                htmlFor="password-desktop"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Password
              </Label>
              <Input
                type="password"
                id="password-desktop"
                placeholder="Enter your password"
                {...register("password")}
                className={`h-12 rounded-lg ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-[#46C2DE] hover:bg-[#3bb0ca] text-white rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              {isSubmitting ? "Logging in..." : "Login"}
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
