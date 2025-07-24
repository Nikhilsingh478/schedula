'use client';

import { ArrowLeft, Calendar, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DoctorProfileViewProps {
  doctor?: {
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
    image: string;
  };
  onBack?: () => void;
}

export default function DoctorProfileView({ doctor, onBack }: DoctorProfileViewProps) {
  const router = useRouter();

  const defaultDoctor = {
    id: 'dr1',
    name: 'Dr. Aman Bumrow',
    specialty: 'Cardiologist',
    qualification: 'MBBS, MD (Cardiology)',
    location: 'California, US',
    patients: 5000,
    experience: 10,
    rating: 4.8,
    about:
      'Top Cardiologist at Christ Hospital, London. Specialized in interventional cardiology...',
    services: 'Medicare, Heart Surgery, ECG',
    slots: ['08:00 AM', '10:00 AM', '06:00 PM'],
    image:
      'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
  };

  const doctorData = doctor || defaultDoctor;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="sticky top-0 z-10 bg-[#46C2DE] px-4 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1 rounded-full hover:bg-[#ffffff22] transition">
            <ArrowLeft className="h-6 w-6 text-white" />
          </button>
          <h1 className="text-white text-lg font-medium">Book Appointment</h1>
        </div>
      </div>

      <div className="px-4 pb-6 space-y-6">
        {/* Doctor Info */}
        <div className="bg-white rounded-xl p-4 shadow-sm -mt-2">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">{doctorData.name}</h2>
              <p className="text-[#46C2DE] font-medium mb-1">{doctorData.specialty}</p>
              <p className="text-[#46C2DE] text-sm mb-2">{doctorData.qualification}</p>
              <p className="text-gray-500 text-xs">{doctorData.location}</p>
            </div>
            <div className="flex-shrink-0">
              <img
                src={doctorData.image}
                alt={doctorData.name}
                className="w-20 h-20 rounded-xl object-cover"
              />
            </div>
          </div>
        </div>

        {/* Services as Tags */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-900">Services</h3>
          <div className="flex flex-wrap gap-2">
            {doctorData.services.split(',').map((service, i) => (
              <span
                key={i}
                className="px-3 py-1.5 text-sm text-[#46C2DE] bg-white border border-[#46C2DE] rounded-full"
              >
                {service.trim()}
              </span>
            ))}
          </div>
        </div>

        {/* About Doctor */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-900">About Doctor</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{doctorData.about}</p>
        </div>

        {/* Earliest Slot → Link to ScheduleSlot */}
        <div
          onClick={() =>
            router.push(`/ScheduleSlot?id=${doctorData.id}`)
          }
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition"
        >
          <div className="flex items-center gap-4">
            <Calendar className="h-6 w-6 text-[#46C2DE]" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 mb-1">Earliest Available Slot</p>
              <p className="text-sm text-gray-600">{doctorData.slots[0]}</p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
        <button className="w-full bg-[#46C2DE] text-white font-medium py-4 rounded-full text-lg">
          Book appointment
        </button>
      </div>
    </div>
  );
}
