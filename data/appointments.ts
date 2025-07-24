// /data/appointments.ts

export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  doctorName: string;
  doctorImage: string;
  token: number;
  date: string;
  time: string;
  paymentStatus: 'paid' | 'not paid';
  consultationType: string;
  status: AppointmentStatus;
}

export const appointments: Appointment[] = [
  {
    id: 'a1',
    doctorName: 'Dr. Divya Das',
    doctorImage:
      'https://images.pexels.com/photos/8376334/pexels-photo-8376334.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    token: 12,
    date: 'Today',
    time: '12:30 PM',
    paymentStatus: 'not paid',
    consultationType: 'Consulting',
    status: 'completed',
  },
  {
    id: 'a2',
    doctorName: 'Dr. Kumar Das',
    doctorImage:
      'https://images.pexels.com/photos/8376317/pexels-photo-8376317.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    token: 18,
    date: 'Tomorrow',
    time: '10:00 AM',
    paymentStatus: 'paid',
    consultationType: 'Follow-up',
    status: 'upcoming',
  },
  // Add more as needed...
];
