export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  qualification: string;
  location: string;
  patients: number;
  experience: number;
  rating: number;
  about: string;
  services: string;
  slots: string[];
  image?: string;
  fee?: number;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface DaySlots {
  morning: TimeSlot[];
  evening: TimeSlot[];
}

export interface DoctorSlots {
  [date: string]: DaySlots;
}
