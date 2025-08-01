export interface Patient {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

export interface User {
  id: string;
  fullName: string;
  mobile: string;
  email?: string;
  age?: string;
  gender?: string;
  role?: "doctor" | "patient";
  doctorId?: string;
}
