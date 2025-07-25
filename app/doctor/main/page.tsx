"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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
  const [editMode, setEditMode] = useState(false);

  const {
    register,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Doctor>();

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
        reset(loggedInDoctor);

        const apptRes = await fetch(
          `http://localhost:3001/appointments?doctorId=${loggedInDoctor.id}`,
        );
        const appts: Appointment[] = await apptRes.json();
        setAppointments(appts);
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, reset]);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;

    localStorage.removeItem("doctorPhone");
    router.replace("/");
  };

  const today = new Date().toISOString().split("T")[0];
  const upcomingAppointments = appointments.filter(
    (appt) => appt.date >= today && appt.patientName && appt.patientName.trim() !== ""
  );
  const uniquePatients = Array.from(
    new Set(appointments.map((appt) => appt.patientName).filter(name => name && name.trim() !== ""))
  );

  const handleProfileSave = async () => {
    if (!doctor) return;

    try {
      const res = await fetch(`http://localhost:3001/doctors/${doctor.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doctor),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      const updated = await res.json();
      setDoctor(updated);
      setEditMode(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  if (loading || !doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#46C2DE] text-lg font-medium">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-white font-poppins text-sm text-[#1A1A1A]">
      {/* Header */}
      <div className="bg-[#46C2DE] text-white px-6 py-4 flex justify-between items-center shadow">
        <h1 className="text-base font-semibold">Hi, {doctor.name}</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-1 text-sm bg-white text-[#46C2DE] rounded-md hover:bg-gray-100 transition"
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
                      <p className="text-base font-medium">
                        {appt.patientName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {appt.date} at {appt.time}
                      </p>
                    </div>
                    <span
                      className={`text-sm px-3 py-1 rounded-full font-medium ${
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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleProfileSave();
              }}
              className="space-y-4"
            >
              {[
                { label: "Name", field: "name", type: "text" },
                {
                  label: "Phone",
                  field: "phone",
                  type: "text",
                  disabled: true,
                },
                { label: "Specialization", field: "specialization" },
                { label: "Experience", field: "experience" },
              ].map(({ label, field, type = "text", disabled = false }) => (
                <div key={field}>
                  <label className="block mb-1 font-medium">{label}</label>
                  <input
                    type={type}
                    value={(doctor as any)[field] || ""}
                    disabled={disabled || !editMode}
                    onChange={(e) =>
                      setDoctor({ ...doctor, [field]: e.target.value })
                    }
                    className={`w-full px-4 py-2 rounded-xl border outline-none transition ${
                      disabled || !editMode
                        ? "bg-gray-100 border-gray-300 cursor-not-allowed"
                        : "border-[#46C2DE]"
                    }`}
                  />
                </div>
              ))}

              <div>
                <label className="block mb-1 font-medium">About</label>
                <textarea
                  rows={3}
                  value={doctor.about || ""}
                  disabled={!editMode}
                  onChange={(e) =>
                    setDoctor({ ...doctor, about: e.target.value })
                  }
                  className={`w-full px-4 py-2 rounded-xl border outline-none transition ${
                    !editMode
                      ? "bg-gray-100 border-gray-300"
                      : "border-[#46C2DE]"
                  }`}
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                {editMode ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 rounded-xl bg-[#46C2DE] text-white hover:bg-[#3bb0ca] transition"
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setEditMode(true)}
                    className="px-4 py-2 rounded-xl bg-[#46C2DE] text-white hover:bg-[#3bb0ca] transition"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </form>
          </>
        )}

        {activeTab === "schedule" && (
          <>
            <h2 className="text-xl font-semibold mb-4">All Appointments</h2>
            {appointments.length === 0 ? (
              <p className="text-gray-500">No appointments yet.</p>
            ) : (
              <div className="space-y-4">
                {appointments.filter(appt => appt.patientName && appt.patientName.trim() !== "").map((appt) => (
                  <div
                    key={appt.id}
                    className="border rounded-xl p-4 shadow-sm flex justify-between items-center"
                  >
                    <div>
                      <p className="text-base font-medium">
                        {appt.patientName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {appt.date} at {appt.time}
                      </p>
                    </div>
                    <span
                      className={`text-sm px-3 py-1 rounded-full font-medium ${
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
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {uniquePatients.filter(name => name && name.trim() !== "").map((name, i) => (
                  <li key={i}>{name}</li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      {/* Bottom Tab Bar */}
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
