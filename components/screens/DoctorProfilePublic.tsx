'use client';

import { useBooking } from '@/context/BookingContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Star, MapPin, Users, Calendar, Clock, Award, GraduationCap } from 'lucide-react';

export default function DoctorProfilePublic() {
  const { bookingData, setCurrentScreen } = useBooking();
  const doctor = bookingData.doctor;

  if (!doctor) {
    return <div>Doctor not found</div>;
  }

  const handleBookAppointment = () => {
    setCurrentScreen('booking');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentScreen('doctorList')}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Doctor Profile</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Doctor Info Card */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start space-x-6">
              <img
                src={doctor.image || `https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop`}
                alt={doctor.name}
                className="w-24 h-24 rounded-xl object-cover"
              />
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{doctor.name}</h2>
                    <p className="text-lg text-blue-600 font-medium">{doctor.specialty}</p>
                    <p className="text-gray-600">{doctor.qualification}</p>
                  </div>
                  
                  <div className="flex items-center space-x-1 bg-green-50 px-3 py-1 rounded-lg">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="font-semibold text-gray-900">{doctor.rating}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">Patients</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{doctor.patients.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-gray-600">
                      <Award className="w-4 h-4" />
                      <span className="text-sm">Experience</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{doctor.experience} years</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">Location</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{doctor.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About Section */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <span>About Dr. {doctor.name.split(' ').pop()}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{doctor.about}</p>
          </CardContent>
        </Card>

        {/* Services & Specialties */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Services & Specialties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {doctor.services.split(', ').map((service, index) => (
                <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700 px-3 py-1">
                  {service}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Available Times */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-green-600" />
              <span>Available Time Slots</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {doctor.slots.map((time, index) => (
                <div key={index} className="flex items-center justify-center py-2 px-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
                  {time}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Book Appointment Button */}
        <div className="sticky bottom-4">
          <Button
            onClick={handleBookAppointment}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-lg shadow-lg"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Book Appointment
          </Button>
        </div>
      </div>
    </div>
  );
}