'use client';

import { BookingProvider, useBooking } from '@/context/BookingContext';
import LoginScreen from '@/components/screens/LoginScreen';
import UserLoginScreen from '@/components/screens/UserLoginScreen';
import OtpScreen from '@/components/screens/OtpScreen';
import OTPVerificationScreen from '@/components/screens/OTPVerificationScreen';
import HomeDoctorList from '@/components/screens/HomeDoctorList';
import PatientDashboardScreen from '@/components/screens/PatientDashboardScreen';
import DoctorProfilePublic from '@/components/screens/DoctorProfilePublic';
import BookingSchedule from '@/components/screens/BookingSchedule';
import DoctorOwnProfile from '@/components/screens/DoctorOwnProfile';
import BookingConfirmation from '@/components/screens/BookingConfirmation';
import PatientDetailsUnfilled from '@/components/screens/PatientDetailsUnfilled';

function AppContent() {
  const { currentScreen } = useBooking();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <UserLoginScreen />;
      case 'otp':
        return <OTPVerificationScreen />;
      case 'doctorList':
        return <PatientDashboardScreen />;
      case 'doctorProfile':
        return <DoctorProfilePublic />;
      case 'booking':
        return <BookingSchedule />;
      case 'doctorProfile':
        return <DoctorOwnProfile />;
      case 'confirmation':
        return <BookingConfirmation />;
      case 'patientDetails':
        return <PatientDetailsUnfilled />;
      default:
        return <UserLoginScreen />;
    }
  };

  return renderScreen();
}

export default function Home() {
  return (
    <BookingProvider>
      <AppContent />
    </BookingProvider>
  );
}