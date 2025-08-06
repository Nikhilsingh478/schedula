import { Doctor } from "./doctor";

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorImage?: string;
  date: string;
  time: string;
  token: string;
  patientName?: string;
  patientPhone?: string;
  status: "confirmed" | "pending" | "cancelled";
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
