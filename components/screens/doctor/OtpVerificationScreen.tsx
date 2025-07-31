"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Delete } from "lucide-react";

export default function OtpVerificationScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    document.body.classList.add("font-poppins");

    // Check if doctor is already logged in and verified
    if (typeof window !== 'undefined') {
      const currentDoctor = localStorage.getItem("currentDoctor");
      const doctorVerified = localStorage.getItem("doctorVerified");
      const userRole = localStorage.getItem("userRole");

      if (currentDoctor && doctorVerified && userRole === "doctor") {
        router.replace("/doctor/main");
      }
    }
  }, [router]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // Only allow 1 digit

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleKeypadInput = (digit: string) => {
    const nextIndex = otp.findIndex((d) => d === "");
    if (nextIndex !== -1) {
      const updatedOtp = [...otp];
      updatedOtp[nextIndex] = digit;
      setOtp(updatedOtp);
      if (nextIndex < 3) {
        inputsRef.current[nextIndex + 1]?.focus();
      }
    }
  };

  const handleKeypadBackspace = () => {
    const lastFilled = [...otp].reverse().findIndex((d) => d !== "");
    if (lastFilled !== -1) {
      const idx = 3 - lastFilled;
      const updatedOtp = [...otp];
      updatedOtp[idx] = "";
      setOtp(updatedOtp);
      inputsRef.current[idx]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 4)
      return alert("Please enter a valid 4-digit OTP.");

    // Dummy OTP verification - any 4 digits work
    if (typeof window !== 'undefined') {
      const currentDoctor = JSON.parse(localStorage.getItem("currentDoctor") || "{}");
      
      // Set doctor as verified
      localStorage.setItem("doctorVerified", "true");
    }
    
    // Proceed to doctor main screen
    router.push("/doctor/main");
  };

  const keypadNumbers = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["*", "0", "backspace"],
  ];

  // Get current doctor's mobile number for display
  const currentDoctor = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("currentDoctor") || "{}") : {};
  const maskedMobile = currentDoctor.phone ? 
    `+91 ${currentDoctor.phone.slice(0, 3)} ******${currentDoctor.phone.slice(-2)}` : 
    "+91 111 ******99";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 md:px-8">
      {/* Mobile Layout */}
      <div className="w-full max-w-md md:hidden bg-white rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#1A1A1A] mb-2 text-center">
          Verify OTP
        </h1>
        <p className="text-sm text-gray-500 mb-8 text-center">
          Enter the OTP sent to {maskedMobile}
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="flex justify-center gap-4">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                ref={(el) => (inputsRef.current[idx] = el)}
                className="w-14 h-14 text-center border border-gray-300 rounded-xl text-xl font-medium outline-none focus:border-[#46C2DE] shadow-sm"
              />
            ))}
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto mt-6">
            {keypadNumbers.flat().map((key, index) => (
              <button
                key={index}
                type="button"
                onClick={() => key === "backspace" ? handleKeypadBackspace() : handleKeypadInput(key)}
                className="bg-gray-100 hover:bg-gray-200 text-xl font-semibold rounded-xl py-3 shadow text-gray-800 focus:outline-none transition-all duration-150 active:scale-95"
              >
                {key === "backspace" ? <Delete className="w-6 h-6 mx-auto" /> : key}
              </button>
            ))}
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-[#46C2DE] hover:bg-[#3bb0ca] text-white rounded-lg transition-all duration-200"
          >
            Verify OTP
          </Button>
        </form>
      </div>

      {/* Desktop Layout - Card Centered */}
      <Card className="hidden md:block w-full max-w-md shadow-xl border-0">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-[#1A1A1A] mb-2">
              Verify OTP
            </h1>
            <p className="text-gray-500">
              Enter the OTP sent to {maskedMobile}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="flex justify-center gap-4">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  ref={(el) => (inputsRef.current[idx] = el)}
                  className="w-16 h-16 text-center border border-gray-300 rounded-xl text-2xl font-medium outline-none focus:border-[#46C2DE] shadow-sm transition-all"
                />
              ))}
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
              {keypadNumbers.flat().map((key, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => key === "backspace" ? handleKeypadBackspace() : handleKeypadInput(key)}
                  className="h-14 flex items-center justify-center text-xl font-semibold text-gray-800 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-all duration-150 active:scale-95"
                >
                  {key === "backspace" ? <Delete className="w-6 h-6" /> : key}
                </button>
              ))}
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#46C2DE] hover:bg-[#3bb0ca] text-white rounded-lg transition-all duration-200"
            >
              Verify OTP
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
