"use client";

import { useEffect, useState } from "react";

type BookingStatus = "confirmed" | "pending" | "cancelled";

interface Booking {
  id: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  token: string;
  patientName: string;
  patientPhone: string;
  status: BookingStatus;
}

const mockBookings: Booking[] = [
  {
    id: "b001",
    doctorId: "dr1",
    doctorName: "Dr. Aman Bumrow",
    date: "2025-07-20",
    time: "08:30 AM",
    token: "1234",
    patientName: "John Doe",
    patientPhone: "+1234567890",
    status: "confirmed",
  },
  {
    id: "b002",
    doctorId: "dr2",
    doctorName: "Dr. Kavita Rao",
    date: "2025-05-12",
    time: "11:00 AM",
    token: "5678",
    patientName: "John Doe",
    patientPhone: "+1234567890",
    status: "cancelled",
  },
  {
    id: "b003",
    doctorId: "dr3",
    doctorName: "Dr. Raj Malhotra",
    date: "2025-08-05",
    time: "04:15 PM",
    token: "8822",
    patientName: "John Doe",
    patientPhone: "+1234567890",
    status: "pending",
  },
];

export default function PatientAppointments() {
  const [upcoming, setUpcoming] = useState<Booking[]>([]);
  const [past, setPast] = useState<Booking[]>([]);

  useEffect(() => {
    const now = new Date();
    const [up, past] = mockBookings.reduce<[Booking[], Booking[]]>(
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
  );

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
