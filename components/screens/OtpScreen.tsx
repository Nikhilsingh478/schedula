'use client';

import { useState } from 'react';
import { useBooking } from '@/context/BookingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { ArrowLeft, Shield } from 'lucide-react';

export default function OtpScreen() {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const { setCurrentScreen, setUser } = useBooking();

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
        nextInput?.focus();
      }
    }
  };

  const handleVerify = () => {
    const otpCode = otp.join('');
    if (otpCode.length === 6) {
      const isDoctor = otpCode === '123456'; // Mock logic

      setUser({
        id: 'user1',
        phone: '+1234567890',
        role: isDoctor ? 'doctor' : 'patient',
        doctorId: isDoctor ? 'dr1' : undefined,
      });

      setCurrentScreen(isDoctor ? 'doctorProfile' : 'doctorList');
    }
  };

  const otpComplete = otp.every((digit) => digit !== '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center pb-8">
          <Button
            variant="ghost"
            className="absolute top-4 left-4 p-2"
            onClick={() => setCurrentScreen('login')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="mx-auto mb-4 w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>

          <CardTitle className="text-2xl font-bold text-gray-900">
            Verify Your Number
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            Weve sent a 6-digit code to your phone number
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex justify-center space-x-3">
            {otp.map((digit, index) => (
              <Input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                className="w-12 h-12 text-center text-lg font-semibold rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            ))}
          </div>

          <Button
            onClick={handleVerify}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
            disabled={!otpComplete}
          >
            Verify & Continue
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Didnt receive the code?{' '}
              <button className="text-blue-600 font-medium hover:underline">
                Resend OTP
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
