"use client";

import { useState } from "react";
import { appointments, AppointmentStatus } from "@/data/appointments";
import Image from "next/image";

const TABS: AppointmentStatus[] = ["upcoming", "completed", "cancelled"];

export default function AppointmentsScreen() {
  const [selectedTab, setSelectedTab] = useState<AppointmentStatus>("upcoming");

  const filteredAppointments = appointments.filter(
    (appt) => appt.status === selectedTab,
  );

  return (
    <div className="max-w-sm mx-auto font-sans bg-white min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 px-4 py-4 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-900">My Appointments</h1>
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
