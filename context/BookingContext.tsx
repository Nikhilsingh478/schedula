'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BookingData } from '@/types/appointment';
import { User } from '@/types/patient'; // Correctly importing User type

interface BookingContextType {
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
  bookingData: BookingData;
  setBookingData: (data: Partial<BookingData>) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  resetBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const initialBookingData: BookingData = {
  doctor: null,
  selectedDate: '',
  selectedTime: '',
  patientInfo: {
    name: '',
    phone: '',
  },
};

export function BookingProvider({ children }: { children: ReactNode }) {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [bookingData, setBookingDataState] = useState<BookingData>(initialBookingData);
  const [user, setUser] = useState<User | null>(null);

  const setBookingData = (data: Partial<BookingData>) => {
    setBookingDataState((prev) => ({ ...prev, ...data }));
  };

  const resetBooking = () => {
    setBookingDataState(initialBookingData);
  };

  return (
    <BookingContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        bookingData,
        setBookingData,
        user,
        setUser,
        resetBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
