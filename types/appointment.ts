import { Doctor } from "./doctor";

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  token?: string;
  patientName: string;
  patientPhone: string;
  status: string;
  patientEmail?: string;
  patientAge?: string;
  patientGender?: string;
  symptoms?: string;
  createdAt?: string;
}

export interface BookingData {
  doctor: Doctor | null;
  selectedDate: string;
  selectedTime: string;
  patientInfo: {
    name: string;
    phone: string;
  };
}
