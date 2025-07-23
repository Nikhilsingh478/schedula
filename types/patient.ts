export interface Patient {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

export interface User {
  id: string;
  phone: string;
  role: 'doctor' | 'patient';
  doctorId?: string;
}