"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function OtpVerificationScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    document.body.classList.add("font-poppins");

    if (typeof window !== "undefined") {
      const phone = localStorage.getItem("doctorPhone");
      const role = localStorage.getItem("userRole");

      if (phone && role === "doctor") {
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

    // Mock: Save verified login info
    localStorage.setItem("doctorPhone", "9999999999");
    localStorage.setItem("userRole", "doctor");

    router.push("/doctor/main");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white">
      <h1 className="text-2xl sm:text-3xl font-semibold text-[#1A1A1A] mb-2">
        Verify OTP
      </h1>
      <p className="text-sm text-gray-500 mb-8 text-center">
        Enter the OTP sent to your phone number
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
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
          {["1","2","3","4","5","6","7","8","9","0"].map((num, i) => (
            <button
              key={num + i}
              type="button"
              onClick={() => handleKeypadInput(num)}
              className="bg-gray-100 hover:bg-gray-200 text-xl font-semibold rounded-xl py-3 shadow text-gray-800 focus:outline-none"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={handleKeypadBackspace}
            className="col-span-3 bg-gray-200 hover:bg-gray-300 text-lg rounded-xl py-3 shadow text-gray-800 focus:outline-none"
          >
            ⌫ Backspace
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-[#46C2DE] text-white py-2 px-4 rounded-xl hover:bg-[#3bb0ca] transition disabled:opacity-50"
        >
          Verify OTP
        </button>
      </form>
    </div>
  );
}
