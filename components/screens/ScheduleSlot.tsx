"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Calendar } from "lucide-react";
import BookingSuccessModal from "@/components/ScheduleSlot/BookingSuccessModal";
import { API_ENDPOINTS } from "@/lib/config";
import { Doctor } from "@/types/doctor";
import { storageUtils } from "@/lib/storage";
import { convertDisplayDateToISO } from "@/lib/utils";

export default function ScheduleSlot() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorId = searchParams.get('id');

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to handle back navigation
  const handleBackNavigation = () => {
    // Navigate to patient dashboard with appointments tab active
    router.push('/?tab=appointments');
  };

  // Default doctor data (fallback)
  const defaultDoctor: Doctor = {
    id: "default-doctor",
    name: "Dr. Kumar Das",
    specialization: "Cardiologist - Dombivali",
    qualification: "MBBS ,MD (Internal Medicine)",
    image:
      "https://images.pexels.com/photos/8376317/pexels-photo-8376317.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
    slots: [],
  };

  useEffect(() => {
    const fetchDoctorData = async () => {
      if (!doctorId) {
        setDoctor(defaultDoctor);
        setLoading(false);
        return;
      }

      try {
        // First, check localStorage for manually created doctors
        const localStorageDoctors = JSON.parse(localStorage.getItem("doctors") || "[]");
        const localDoctor = localStorageDoctors.find((d: any) => d.id === doctorId);
        
        if (localDoctor) {
          // Found the doctor in localStorage (manually created)
          setDoctor({
            id: localDoctor.id,
            name: localDoctor.name,
            specialization: localDoctor.specialization,
            qualification: localDoctor.qualification,
            location: localDoctor.location,
            experience: localDoctor.experience,
            rating: localDoctor.rating,
            about: localDoctor.about,
            services: localDoctor.services,
            image: localDoctor.image,
            slots: localDoctor.slots || [],
            patients: localDoctor.patients,
            fee: localDoctor.fee,
          });
          setLoading(false);
          return;
        }

        // If not found in localStorage, fetch from API
        const response = await fetch(API_ENDPOINTS.doctors);
        if (!response.ok) {
          throw new Error("Failed to fetch doctor data");
        }
        
        const doctors = await response.json();
        const foundDoctor = doctors.find((d: any) => d.id === doctorId);
        
        if (foundDoctor) {
          setDoctor({
            id: foundDoctor.id,
            name: foundDoctor.name,
            specialization: foundDoctor.specialization,
            qualification: foundDoctor.qualification,
            location: foundDoctor.location,
            experience: foundDoctor.experience,
            rating: foundDoctor.rating,
            about: foundDoctor.about,
            services: foundDoctor.services,
            image: foundDoctor.image,
            slots: foundDoctor.slots || [],
            patients: foundDoctor.patients,
            fee: foundDoctor.fee,
          });
        } else {
          setDoctor(defaultDoctor);
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error);
        setDoctor(defaultDoctor);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [doctorId]);

  const dates = ["13 MON", "14 TUE", "16 WED", "17 THU", "18 FRI"];
  const [selectedDate, setSelectedDate] = useState("14 TUE");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [token, setToken] = useState("");

  // Load doctor's generated slots
  const [doctorSlots, setDoctorSlots] = useState<string[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [fullSlotData, setFullSlotData] = useState<any[]>([]);

  // Load doctor's slots when doctor data is available
  useEffect(() => {
    if (doctor?.id) {
      const savedSlots = localStorage.getItem(`doctor_slots_${doctor.id}`);
      const savedFullSlots = localStorage.getItem(`doctor_full_slots_${doctor.id}`);
      
      if (savedSlots && savedFullSlots) {
        try {
          const parsedSlots = JSON.parse(savedSlots);
          const parsedFullSlots = JSON.parse(savedFullSlots);
          
          setDoctorSlots(parsedSlots);
          setFullSlotData(parsedFullSlots);
          
          // Filter out full slots
          const availableSlotTimes = parsedFullSlots
            .filter((slot: any) => slot.bookedCount < slot.capacity)
            .map((slot: any) => slot.startTime);
          
          setAvailableSlots(availableSlotTimes);
        } catch (error) {
          console.error('Error loading doctor slots:', error);
          // Fallback to default slots
          setAvailableSlots([...morningSlots, ...eveningSlots]);
        }
      } else {
        // Fallback to default slots if no custom slots are set
        setAvailableSlots([...morningSlots, ...eveningSlots]);
      }
    }
  }, [doctor?.id]);

  // Default time slots (fallback)
  const morningSlots = [
    "09:00",
    "10:00", 
    "11:00",
    "12:00",
    "13:00",
    "14:00"
  ];

  const eveningSlots = [
    "15:00",
    "16:00",
    "17:00"
  ];

  const handleBooking = async () => {
    if (!selectedSlot) {
      alert("Please select a slot before booking.");
      return;
    }

    // Get current user from localStorage
        const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

    if (!currentUser.name && !currentUser.fullName) {
      alert("Please login to book an appointment.");
      return;
    }

    // Generate token
    const generatedToken = "A" + Math.floor(Math.random() * 1000 + 1).toString().padStart(3, '0');

    // Create new appointment with enhanced patient data and doctor image
    const newAppointment = {
      id: `appt_${Date.now()}`,
      doctorId: doctor?.id || "dr1",
      doctorName: doctor?.name || "Doctor",
      doctorImage: doctor?.image || "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      date: convertDisplayDateToISO(selectedDate), // Convert to ISO format
      time: selectedSlot, // Now in "HH:MM" format
      startTime: selectedSlot, // Add startTime for calendar compatibility
      endTime: `${Number.parseInt(selectedSlot.split(":")[0]) + 1}:00`.padStart(5, "0"), // Calculate end time
      patientName: currentUser.name || currentUser.fullName,
      patientPhone: currentUser.mobile || "+1234567890",
      patientEmail: currentUser.email || "",
      patientAge: currentUser.age || "Not specified",
      patientGender: currentUser.gender || "Not specified",
      symptoms: "General consultation", // Can be enhanced later
      token: generatedToken,
      status: "Confirmed",
      createdAt: new Date().toISOString(),
    };

    try {
      // Update slot booking count
      if (doctor?.id && fullSlotData.length > 0) {
        const slotToUpdate = fullSlotData.find((slot: any) => slot.startTime === selectedSlot);
        if (slotToUpdate) {
          const updatedFullSlots = fullSlotData.map((slot: any) => {
            if (slot.slotId === slotToUpdate.slotId) {
              return {
                ...slot,
                bookedCount: slot.bookedCount + 1,
                patients: [...slot.patients, currentUser.name || currentUser.fullName]
              };
            }
            return slot;
          });
          
          // Save updated slot data
          localStorage.setItem(`doctor_full_slots_${doctor.id}`, JSON.stringify(updatedFullSlots));
          setFullSlotData(updatedFullSlots);
          
          // Update available slots
          const newAvailableSlots = updatedFullSlots
            .filter((slot: any) => slot.bookedCount < slot.capacity)
            .map((slot: any) => slot.startTime);
          setAvailableSlots(newAvailableSlots);
        }
      }

      // Save to JSON server first
      const response = await fetch(API_ENDPOINTS.appointments, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAppointment),
      });

      if (!response.ok) {
        throw new Error('Failed to save to server');
      }

      // Also save to localStorage as backup using storage utility
      const existingAppointments = JSON.parse(storageUtils.getItem("appointments") || "[]");
      const updatedAppointments = [...existingAppointments, newAppointment];
      storageUtils.storeAppointments(updatedAppointments);
      
      // Debug logging
      console.log("New appointment created:", newAppointment);
      console.log("Updated appointments in localStorage:", updatedAppointments);

      setToken(generatedToken);
      setShowModal(true);
    } catch (error) {
      console.error("Error saving appointment:", error);
      // Fallback to localStorage only using storage utility
      const existingAppointments = JSON.parse(storageUtils.getItem("appointments") || "[]");
      const updatedAppointments = [...existingAppointments, newAppointment];
      storageUtils.storeAppointments(updatedAppointments);
      
      // Debug logging
      console.log("New appointment created (fallback):", newAppointment);
      console.log("Updated appointments in localStorage (fallback):", updatedAppointments);
      
      setToken(generatedToken);
      setShowModal(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white max-w-sm mx-auto font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#46C2DE] mx-auto mb-4"></div>
          <p className="text-[#46C2DE] font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white max-w-sm mx-auto font-sans relative">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#46C2DE] text-white py-4 px-4 flex items-center gap-3">
        <button
          onClick={handleBackNavigation}
          className="p-1 rounded-full hover:bg-[#ffffff33]"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-medium">Book Appointment</h1>
      </div>

      {/* Doctor Info */}
      <div className="bg-white rounded-xl shadow-sm mx-4 mt-6 p-4 flex items-center gap-4 border border-gray-200">
        <img
          src={doctor?.image || defaultDoctor.image}
          alt={doctor?.name || defaultDoctor.name}
          className="w-14 h-14 rounded-full object-cover"
        />
        <div>
          <h2 className="text-[16px] font-bold">{doctor?.name || defaultDoctor.name}</h2>
          <p className="text-[13px] text-gray-600">{doctor?.specialization || defaultDoctor.specialization}</p>
          <p className="text-[13px] text-gray-500">{doctor?.qualification || defaultDoctor.qualification}</p>
        </div>
      </div>

      {/* Date Section */}
      <div className="mt-6 px-4">
        <h3 className="text-[14px] font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <Calendar className="w-4 h-4" /> Book Appointment
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {dates.map((date) => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`min-w-[60px] h-[60px] flex items-center justify-center rounded-lg text-[13px] font-medium px-3 py-1 border ${
                selectedDate === date
                  ? "bg-[#46C2DE] text-white border-[#46C2DE]"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              {date}
            </button>
          ))}
        </div>
      </div>

      {/* Available Time Slots */}
      <div className="mt-6 px-4">
        <h3 className="text-[14px] font-semibold mb-2">Select slot</h3>
        {fullSlotData.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {fullSlotData.map((slot: any) => {
              const isAvailable = slot.bookedCount < slot.capacity;
              const isSelected = selectedSlot === slot.startTime;
              
              return (
                <button
                  key={slot.slotId}
                  onClick={() => isAvailable && setSelectedSlot(slot.startTime)}
                  disabled={!isAvailable}
                  className={`py-2 px-3 text-[13px] rounded-lg border text-center transition-all ${
                    !isAvailable
                      ? "bg-red-50 border-red-200 text-red-400 cursor-not-allowed opacity-60"
                      : isSelected
                        ? "bg-[#46C2DE] text-white border-[#46C2DE]"
                        : "bg-white border-gray-300 text-gray-700 hover:border-[#46C2DE]"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <span>{slot.startTime}</span>
                    {!isAvailable && (
                      <span className="text-xs mt-1">Booked</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ) : availableSlots.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {availableSlots.map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={`py-2 px-3 text-[13px] rounded-lg border text-center ${
                  selectedSlot === slot
                    ? "bg-[#46C2DE] text-white border-[#46C2DE]"
                    : "bg-white border-gray-300 text-gray-700"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">No available slots set by doctor</p>
            <p className="text-gray-400 text-xs mt-1">Please contact the doctor to set their availability</p>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="px-4 mt-6 pb-6">
        <button
          onClick={handleBooking}
          className="w-full bg-[#46C2DE] text-white text-[14px] font-bold py-3 rounded-xl"
        >
          Book appointment
        </button>
      </div>

      {/* Success Modal */}
      {showModal && (
        <BookingSuccessModal
          token={token}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
