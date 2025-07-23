'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Delete } from 'lucide-react';
import { useBooking } from '@/context/BookingContext';

export default function OTPVerificationScreen() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(55);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { setCurrentScreen, setBookingData } = useBooking();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeypadPress = (value: string) => {
    if (value === 'backspace') {
      for (let i = 3; i >= 0; i--) {
        if (otp[i] !== '') {
          const newOtp = [...otp];
          newOtp[i] = '';
          setOtp(newOtp);
          inputRefs.current[i]?.focus();
          break;
        }
      }
    } else {
      for (let i = 0; i < 4; i++) {
        if (otp[i] === '') {
          const newOtp = [...otp];
          newOtp[i] = value;
          setOtp(newOtp);
          if (i < 3) {
            inputRefs.current[i + 1]?.focus();
          }
          break;
        }
      }
    }
  };

  const handleVerify = () => {
    const otpCode = otp.join('');
    if (otpCode.length === 4 && otp.every(digit => digit !== '')) {
      setBookingData({}); // Clear previous state (optional)
      setCurrentScreen('doctorList'); // Go to doctor list
    }
  };

  const isVerifyEnabled = otp.every(digit => digit !== '');

  const keypadNumbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', 'backspace']
  ];

  return (
    <div className="min-h-screen bg-white font-['Poppins'] flex flex-col">
      {/* Header */}
      <div className="flex items-center px-6 py-4 border-b border-gray-100">
        <button className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-gray-900 -ml-9">
          OTP Code Verification
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8 flex flex-col">
        {/* Instruction */}
        <div className="text-center mb-12">
          <p className="text-gray-500 text-sm">
            Code has been sent to +91 111 ******99
          </p>
        </div>

        {/* OTP Fields */}
        <div className="flex justify-center space-x-4 mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              className="w-14 h-14 text-center text-2xl font-bold border border-gray-300 rounded-lg focus:border-[#46c2de] focus:ring-2 focus:ring-[#46c2de]/20 focus:outline-none transition-all"
            />
          ))}
        </div>

        {/* Timer */}
        <div className="text-center mb-8">
          <p className="text-gray-600 text-sm">
            Resend code in{' '}
            <span className="text-[#46c2de] font-semibold">{timer} s</span>
          </p>
        </div>

        {/* Verify Button */}
        <Button
          onClick={handleVerify}
          disabled={!isVerifyEnabled}
          className={`w-full h-12 font-medium rounded-lg transition-all duration-200 mb-12 ${
            isVerifyEnabled
              ? 'bg-[#46c2de] hover:bg-[#3bb5d1] text-white shadow-sm hover:shadow-md active:scale-[0.98]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Verify
        </Button>

        {/* Keypad */}
        <div className="mt-auto">
          <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
            {keypadNumbers.flat().map((key, index) => (
              <button
                key={index}
                onClick={() => handleKeypadPress(key)}
                className="h-14 flex items-center justify-center text-xl font-semibold text-gray-800 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-all duration-150 active:scale-95"
              >
                {key === 'backspace' ? (
                  <Delete className="w-6 h-6" />
                ) : (
                  key
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
