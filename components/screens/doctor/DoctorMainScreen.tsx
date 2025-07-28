"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_ENDPOINTS } from "@/lib/config";
import { Home, User, CalendarCheck, Users, LogOut, Stethoscope } from "lucide-react";

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
          `${API_ENDPOINTS.doctors}?phone=${phone}`,
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
          `${API_ENDPOINTS.appointments}?doctorId=${loggedInDoctor.id}`,
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#46C2DE] mx-auto mb-4"></div>
          <p className="text-[#46C2DE] font-semibold text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  const AppointmentCard = ({ appt }: { appt: Appointment }) => (
    <div className="border rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <p className="text-lg md:text-xl font-medium text-[#1A1A1A] mb-1">
                        {appt.patientName}
                      </p>
          <p className="text-sm md:text-base text-gray-500">
                        {appt.date} at {appt.time}
                      </p>
                    </div>
                    <span
          className={`text-sm md:text-base px-3 py-1 md:py-2 rounded-full font-medium self-start md:self-auto ${
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
    </div>
  );

  const renderActiveContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                Upcoming Appointments
              </h2>
              <div className="text-sm text-gray-500">
                {upcomingAppointments.length} appointments
              </div>
            </div>
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-12">
                <CalendarCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No upcoming appointments.</p>
                <p className="text-gray-400 text-sm mt-2">Your schedule is clear for now.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {upcomingAppointments.map((appt) => (
                  <AppointmentCard key={appt.id} appt={appt} />
                ))}
              </div>
            )}
          </div>
        );

      case "profile":
        return (
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Profile</h2>
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-lg text-gray-900 mt-1">{doctor.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-lg text-gray-900 mt-1">{doctor.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Specialization</label>
                    <p className="text-lg text-gray-900 mt-1">{doctor.specialization || "—"}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Experience</label>
                    <p className="text-lg text-gray-900 mt-1">{doctor.experience || "—"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">About</label>
                    <p className="text-lg text-gray-900 mt-1">{doctor.about || "—"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "schedule":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">All Appointments</h2>
              <div className="text-sm text-gray-500">
                {appointments.length} total appointments
              </div>
            </div>
            {appointments.length === 0 ? (
              <div className="text-center py-12">
                <CalendarCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No appointments available.</p>
                <p className="text-gray-400 text-sm mt-2">Start accepting appointments to see them here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {appointments.map((appt) => (
                  <AppointmentCard key={appt.id} appt={appt} />
                ))}
              </div>
            )}
          </div>
        );

      case "patients":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Patient List</h2>
              <div className="text-sm text-gray-500">
                {uniquePatients.length} unique patients
              </div>
            </div>
            {uniquePatients.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No patients found.</p>
                <p className="text-gray-400 text-sm mt-2">Patients will appear here once they book appointments.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {uniquePatients.map((pname, idx) => (
                    <div key={idx} className="flex items-center p-3 rounded-lg bg-gray-50">
                      <div className="w-8 h-8 bg-[#46C2DE] rounded-full flex items-center justify-center text-white font-medium text-sm mr-3">
                        {pname.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-gray-900 font-medium">{pname}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-gray-200">
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header */}
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#46C2DE] rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Schedula</h1>
            </div>
          </div>
          
          {/* Doctor Info */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-[#46C2DE] rounded-full flex items-center justify-center text-white font-semibold">
                {doctor.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-gray-900">{doctor.name}</p>
                <p className="text-sm text-gray-500">{doctor.specialization || "Doctor"}</p>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {[
              { key: "dashboard", icon: Home, label: "Dashboard" },
              { key: "profile", icon: User, label: "Profile" },
              { key: "schedule", icon: CalendarCheck, label: "Schedule" },
              { key: "patients", icon: Users, label: "Patients" },
            ].map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as typeof activeTab)}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === key 
                    ? "bg-[#46C2DE] text-white shadow-sm" 
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </nav>
          
          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              className="w-full flex items-center px-4 py-3 text-left rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64 flex-1">
        {/* Mobile Header */}
        <div className="lg:hidden bg-[#46C2DE] text-white px-4 py-4 flex justify-between items-center shadow-md">
          <h1 className="text-lg font-semibold">Hi, {doctor.name}</h1>
          <button
            onClick={handleLogout}
            className="text-sm underline hover:text-red-100"
          >
            Logout
          </button>
        </div>

        {/* Content */}
        <div className="px-4 md:px-8 py-6 lg:py-8">
          <div className="max-w-7xl mx-auto">
            {renderActiveContent()}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-t border-t border-gray-100 z-50">
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
