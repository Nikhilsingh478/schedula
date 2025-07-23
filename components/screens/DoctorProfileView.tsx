'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';

const doctorData = {
  name: 'Dr. Kumar Das',
  qualification: 'MBBS, MS (Surgeon)',
  fellowship: 'Fellow of Sanskara Netralaya, Chennai',
  description: 'Dr. Kumar Das has 15+ years of experience in ophthalmology and eye surgery. He specializes in advanced cataract procedures, diabetic eye care, and comprehensive eye examinations. His expertise in modern surgical techniques has helped thousands of patients regain their vision.',
  specializations: [
    'Cataract Specialist',
    'Eye Diabetes',
    'Conjunctivitis',
    'Pre-Cataract',
    'Foreign Body',
    'Eye Check-up',
    'Refraction'
  ],
  consultingHours: [
    { days: 'Mon–Fri', time: '10:00 AM – 1:00 PM' },
    { days: 'Saturday', time: '2:00 PM – 5:00 PM' }
  ],
  nextAvailable: '10 Oct, 2023 at 11:30 AM',
  image: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop'
};

export default function DoctorProfileView() {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleBookAppointment = () => {
    // Navigate to booking screen
    console.log('Navigate to booking');
  };

  const handleBack = () => {
    // Navigate back
    console.log('Navigate back');
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="flex items-center px-4 py-4">
          <button
            onClick={handleBack}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="flex-1 text-center text-lg font-bold text-gray-900 -ml-9">
            Doctor Profile
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 pb-24">
        {/* Doctor Info Section */}
        <Card className="mb-6 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4 mb-4">
              <img
                src={doctorData.image}
                alt={doctorData.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900 mb-1">
                  {doctorData.name}
                </h1>
                <p className="text-sm text-gray-500 mb-1">
                  {doctorData.qualification}
                </p>
                <p className="text-sm text-gray-500 italic">
                  {doctorData.fellowship}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                {showFullDescription 
                  ? doctorData.description
                  : `${doctorData.description.substring(0, 150)}...`
                }
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-[#46c2de] font-medium ml-1 hover:underline"
                >
                  {showFullDescription ? 'View Less' : 'View More'}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Specialization Tags */}
        <Card className="mb-6 shadow-md">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Specializations
            </h2>
            <div className="flex flex-wrap gap-2">
              {doctorData.specializations.map((specialty, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {specialty}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Availability Section */}
        <Card className="mb-6 shadow-md">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Consulting Hours
            </h2>
            <div className="space-y-3">
              {doctorData.consultingHours.map((schedule, index) => (
                <div key={index} className="bg-blue-50 p-3 rounded-md flex items-center">
                  <Calendar className="w-4 h-4 text-[#46c2de] mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {schedule.days}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {schedule.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-green-50 rounded-md">
              <p className="text-green-600 font-medium text-sm">
                Next available: {doctorData.nextAvailable}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fixed Book Appointment Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <Button
          onClick={handleBookAppointment}
          className="w-full bg-[#46c2de] hover:bg-[#3bb5d1] text-white py-3 rounded-lg font-medium shadow-lg transition-all duration-200 active:scale-[0.98]"
        >
          Book Appointment
        </Button>
      </div>
    </div>
  );
}