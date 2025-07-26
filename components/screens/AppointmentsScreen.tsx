"use client";

import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/lib/config";
import Image from "next/image";
import { Bell } from "lucide-react";

const TABS = ["upcoming", "completed", "cancelled"] as const;
type AppointmentStatus = typeof TABS[number];

export default function AppointmentsScreen({ showNotificationIcon = false }: { showNotificationIcon?: boolean }) {
  const [selectedTab, setSelectedTab] = useState<AppointmentStatus>("upcoming");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(API_ENDPOINTS.appointments)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch appointments");
        return res.json();
      })
      .then((data) => {
        setAppointments(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredAppointments = appointments.filter(
    (appt) => appt.status === selectedTab,
  );

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600 text-sm">Loading appointments...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500 text-sm">{error}</div>;
  }

  return (
    <div className="max-w-sm mx-auto font-sans bg-white min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 px-4 py-4 shadow-sm flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">My Appointments</h1>
        {showNotificationIcon && (
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
            <Bell className="w-6 h-6 text-gray-600" />
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">5</div>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex justify-around border-b border-gray-200 px-4">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`text-sm py-2 font-medium ${
              selectedTab === tab
                ? "border-b-2 border-[#46C2DE] text-[#46C2DE]"
                : "text-gray-500"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Appointment Cards */}
      <div className="px-4 py-4 space-y-4">
        {filteredAppointments.map((appt) => (
          <div
            key={appt.id}
            className="border border-gray-300 rounded-xl p-4 flex flex-col gap-3 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <Image
                src={appt.doctorImage}
                alt={appt.doctorName}
                width={60}
                height={60}
                className="rounded-xl object-cover"
              />
              <div className="flex-1">
                <h2 className="font-semibold text-[15px]">{appt.doctorName}</h2>
                <p className="text-xs text-gray-500">Token no - {appt.token}</p>
                <p className="text-xs">
                  {appt.date} |{" "}
                  <span className="text-[#46C2DE]">{appt.time}</span>
                </p>
                <p className="text-xs">
                  Payment{" "}
                  <span className="text-gray-500 font-medium">
                    | {appt.paymentStatus}
                  </span>
                </p>
              </div>
              <div className="text-[#46C2DE] bg-[#e7f8fb] px-2 py-1 rounded text-[11px] font-semibold">
                🏥
              </div>
            </div>

            <div className="flex justify-between text-[12px] text-gray-600 underline">
              <span>{appt.consultationType}</span>
              <span className="text-[#46C2DE] capitalize">{appt.status}</span>
            </div>

            {appt.status !== "cancelled" && (
              <button className="w-full text-center border border-[#46C2DE] text-[#46C2DE] rounded-lg py-2 text-sm font-medium">
                Book Again
              </button>
            )}
          </div>
        ))}

        {filteredAppointments.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-10">
            No appointments found.
          </p>
        )}
      </div>
    </div>
  );
}
