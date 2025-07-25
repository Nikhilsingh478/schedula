"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Home, User, CalendarCheck, Users } from "lucide-react";

type Appointment = {
  id: number;
  doctorId: number;
  patientName: string;
  date: string;
  time: string;
  status: "Confirmed" | "Cancelled" | "Pending";
};

type Doctor = {
  id: number;
  name: string;
  phone: string;
  specialization?: string;
  experience?: string;
  about?: string;
};

export default function DoctorMainScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "profile" | "schedule" | "patients"
  >("dashboard");
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const phone =
      typeof window !== "undefined"
        ? localStorage.getItem("doctorPhone")
        : null;

    if (!phone) {
      router.replace("/doctor/login");
      return;
    }

    const fetchData = async () => {
      try {
        const doctorRes = await fetch(
          `http://localhost:3001/doctors?phone=${phone}`,
        );
        const doctorList: Doctor[] = await doctorRes.json();

        const loggedInDoctor = doctorList[0];
        if (!loggedInDoctor) {
          localStorage.removeItem("doctorPhone");
          router.replace("/doctor/login");
          return;
        }

        setDoctor(loggedInDoctor);

        const apptRes = await fetch(
          `http://localhost:3001/appointments?doctorId=${loggedInDoctor.id}`,
        );
        const appointments: Appointment[] = await apptRes.json();
        setAppointments(appointments);
      } catch (err) {
        console.error("Error loading doctor dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("doctorPhone");
    router.replace("/doctor/login");
  };

  const today = new Date().toISOString().split("T")[0];
  const upcomingAppointments = appointments.filter(
    (appt) => appt.date >= today,
  );
  const uniquePatients = Array.from(
    new Set(appointments.map((appt) => appt.patientName)),
  );

  if (loading || !doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#46C2DE] font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-white font-poppins">
      {/* Header */}
      <div className="bg-[#46C2DE] text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-lg font-semibold">Hi, {doctor.name}</h1>
        <button
          onClick={handleLogout}
          className="text-sm underline hover:text-red-100"
        >
          Logout
        </button>
      </div>

      <div className="px-4 py-6">
        {activeTab === "dashboard" && (
          <>
            <h2 className="text-xl font-semibold mb-4">
              Upcoming Appointments
            </h2>
            {upcomingAppointments.length === 0 ? (
              <p className="text-gray-500">No upcoming appointments.</p>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="border rounded-xl p-4 shadow-sm flex justify-between items-center"
                  >
                    <div>
                      <p className="text-lg font-medium text-[#1A1A1A]">
                        {appt.patientName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {appt.date} at {appt.time}
                      </p>
                    </div>
                    <span
                      className={`text-sm px-3 py-1 rounded-full ${
                        appt.status === "Confirmed"
                          ? "bg-green-100 text-green-600"
                          : appt.status === "Cancelled"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {appt.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "profile" && (
          <>
            <h2 className="text-xl font-semibold mb-4">Profile</h2>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Name:</strong> {doctor.name}
              </p>
              <p>
                <strong>Phone:</strong> {doctor.phone}
              </p>
              <p>
                <strong>Specialization:</strong> {doctor.specialization || "—"}
              </p>
              <p>
                <strong>Experience:</strong> {doctor.experience || "—"}
              </p>
              <p>
                <strong>About:</strong> {doctor.about || "—"}
              </p>
            </div>
          </>
        )}

        {activeTab === "schedule" && (
          <>
            <h2 className="text-xl font-semibold mb-4">All Appointments</h2>
            {appointments.length === 0 ? (
              <p className="text-gray-500">No appointments available.</p>
            ) : (
              <div className="space-y-4">
                {appointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="border rounded-xl p-4 shadow-sm flex justify-between items-center"
                  >
                    <div>
                      <p className="text-lg font-medium text-[#1A1A1A]">
                        {appt.patientName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {appt.date} at {appt.time}
                      </p>
                    </div>
                    <span
                      className={`text-sm px-3 py-1 rounded-full ${
                        appt.status === "Confirmed"
                          ? "bg-green-100 text-green-600"
                          : appt.status === "Cancelled"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {appt.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "patients" && (
          <>
            <h2 className="text-xl font-semibold mb-4">Patient List</h2>
            {uniquePatients.length === 0 ? (
              <p className="text-gray-500">No patients found.</p>
            ) : (
              <ul className="list-disc ml-6 space-y-2 text-gray-700">
                {uniquePatients.map((pname, idx) => (
                  <li key={idx}>{pname}</li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-t border-t border-gray-100 z-50">
        <div className="flex items-center justify-around py-2">
          {[
            { key: "dashboard", icon: Home, label: "Dashboard" },
            { key: "profile", icon: User, label: "Profile" },
            { key: "schedule", icon: CalendarCheck, label: "Schedule" },
            { key: "patients", icon: Users, label: "Patients" },
          ].map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as typeof activeTab)}
              className={`flex flex-col items-center px-4 py-2 transition-colors ${
                activeTab === key ? "text-[#46C2DE]" : "text-gray-400"
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
