"use client";

import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/lib/config";

type BookingStatus = "confirmed" | "pending" | "cancelled";

interface Booking {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorImage?: string;
  date: string;
  time: string;
  token: string;
  patientName: string;
  patientPhone: string;
  status: BookingStatus;
}

export default function PatientAppointments() {
  const [upcoming, setUpcoming] = useState<Booking[]>([]);
  const [past, setPast] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Get current user
        const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
        
        // Fetch from JSON server
        const jsonServerResponse = await fetch(API_ENDPOINTS.appointments);
        let allAppointments: any[] = [];
        
        if (jsonServerResponse.ok) {
          const jsonServerAppointments = await jsonServerResponse.json();
          allAppointments = [...jsonServerAppointments];
        }

        // Get appointments from localStorage
        const localStorageAppointments = JSON.parse(localStorage.getItem("appointments") || "[]");
        
        // Add localStorage appointments that aren't in JSON server
        localStorageAppointments.forEach((localAppt: any) => {
          const exists = allAppointments.find((a: any) => a.id === localAppt.id);
          if (!exists) {
            allAppointments.push(localAppt);
          }
        });

        // Filter appointments for current user
        const userAppointments = allAppointments.filter(
          (appt) => appt.patientName === (currentUser.name || currentUser.fullName)
        );

        // Fetch doctors data to get images
        try {
          const doctorsResponse = await fetch(API_ENDPOINTS.doctors);
          if (doctorsResponse.ok) {
            const doctors = await doctorsResponse.json();
            
            // Enhance appointments with doctor images
            const enhancedAppointments = userAppointments.map(appt => {
              if (!appt.doctorImage) {
                const doctor = doctors.find((d: any) => d.id === appt.doctorId);
                if (doctor) {
                  return {
                    ...appt,
                    doctorImage: doctor.image || "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop"
                  };
                }
              }
              return appt;
            });
            
            // Separate upcoming and past appointments
            const now = new Date();
            const [up, past] = enhancedAppointments.reduce<[Booking[], Booking[]]>(
              ([up, past], booking) => {
                const bookingDate = new Date(booking.date);
                if (bookingDate >= now) up.push(booking);
                else past.push(booking);
                return [up, past];
              },
              [[], []],
            );

            setUpcoming(up);
            setPast(past);
          } else {
            // Fallback without doctor images
            const now = new Date();
            const [up, past] = userAppointments.reduce<[Booking[], Booking[]]>(
              ([up, past], booking) => {
                const bookingDate = new Date(booking.date);
                if (bookingDate >= now) up.push(booking);
                else past.push(booking);
                return [up, past];
              },
              [[], []],
            );

            setUpcoming(up);
            setPast(past);
          }
        } catch (doctorsError) {
          console.log("Could not fetch doctors, using appointments as is");
          const now = new Date();
          const [up, past] = userAppointments.reduce<[Booking[], Booking[]]>(
            ([up, past], booking) => {
              const bookingDate = new Date(booking.date);
              if (bookingDate >= now) up.push(booking);
              else past.push(booking);
              return [up, past];
            },
            [[], []],
          );

          setUpcoming(up);
          setPast(past);
        }
      } catch (err) {
        console.error("Error loading appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const statusClass = (status: BookingStatus) => {
    switch (status) {
      case "confirmed":
        return "text-green-700 bg-green-100";
      case "pending":
        return "text-yellow-700 bg-yellow-100";
      case "cancelled":
        return "text-red-700 bg-red-100";
    }
  };

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-start gap-3">
        <img
          src={booking.doctorImage || "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"}
          alt={booking.doctorName}
          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
        />
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-base font-medium text-gray-900">
              {booking.doctorName}
            </h3>
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${statusClass(booking.status)}`}
            >
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>
          <p className="text-sm text-gray-700">
            📅 {booking.date} | 🕒 {booking.time}
          </p>
          <p className="text-sm text-gray-500">Token: #{booking.token}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#46C2DE] mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-6 pt-6 pb-24 bg-gray-50 space-y-6"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {/* Upcoming Appointments */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Upcoming Appointments
        </h2>
        {upcoming.length > 0 ? (
          <div className="space-y-3">
            {upcoming.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No upcoming appointments found.
          </p>
        )}
      </div>

      {/* Past Appointments */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Past Appointments
        </h2>
        {past.length > 0 ? (
          <div className="space-y-3">
            {past.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No past appointments found.</p>
        )}
      </div>
    </div>
  );
}
