"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_ENDPOINTS } from "@/lib/config";
import { 
  Home, 
  User, 
  CalendarCheck, 
  Users, 
  LogOut, 
  Stethoscope, 
  Phone, 
  Clock, 
  Calendar,
  Hash,
  UserCircle,
  MapPin,
  Edit2,
  Save,
  X
} from "lucide-react";
import DoctorCalendar from "@/components/screens/DoctorCalendar";
import { DoctorSlotEditor } from "@/components/screens/DoctorSlotEditor";

type Appointment = {
  id: number;
  doctorId: number;
  patientName: string;
  patientPhone?: string;
  date: string;
  time: string;
  token?: string;
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
    "dashboard" | "profile" | "schedule" | "patients" | "calendar"
  >("dashboard");
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDoctor, setEditedDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    const phone =
      typeof window !== "undefined"
        ? localStorage.getItem("doctorPhone")
        : null;
    const userRole = localStorage.getItem("userRole");
    const doctorVerified = localStorage.getItem("doctorVerified");

    console.log("Auth check - phone:", phone, "userRole:", userRole, "doctorVerified:", doctorVerified);

    // Check for complete authentication
    if (!phone || userRole !== "doctor" || doctorVerified !== "true") {
      console.log("Incomplete authentication, redirecting to login");
      router.replace("/doctor");
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
          console.log("Doctor not found in database, clearing auth and redirecting");
          localStorage.removeItem("doctorPhone");
          localStorage.removeItem("userRole");
          localStorage.removeItem("doctorVerified");
          router.replace("/doctor");
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
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;

    console.log("Logout confirmed, clearing data...");

    try {
      // Clear all doctor-related data from localStorage
      localStorage.removeItem("doctorPhone");
      localStorage.removeItem("currentDoctor");
      localStorage.removeItem("userRole");
      localStorage.removeItem("doctorVerified");
      
      // Also clear any remembered credentials
      localStorage.removeItem("rememberedMobile");
      localStorage.removeItem("rememberedPassword");
      
      // Clear any other potential auth data
      localStorage.removeItem("userVerified");
      localStorage.removeItem("currentUser");
      
      // Clear any other items that might be related
      localStorage.removeItem("appointments");
      localStorage.removeItem("doctors");
      
      console.log("Doctor logged out successfully");
      console.log("Redirecting to home screen...");
      
      // Redirect to the main home screen where user can choose doctor or patient
      window.location.href = "/";
      
    } catch (error) {
      console.error("Error during logout:", error);
      // Fallback: redirect to home screen anyway
      window.location.href = "/";
    }
  };

  const handleEditProfile = () => {
    setEditedDoctor(doctor);
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    if (!editedDoctor) return;

    try {
      // Update doctor data in localStorage
      const doctors = JSON.parse(localStorage.getItem("doctors") || "[]");
      const updatedDoctors = doctors.map((d: any) => 
        d.id === editedDoctor.id ? editedDoctor : d
      );
      localStorage.setItem("doctors", JSON.stringify(updatedDoctors));
      
      // Update current doctor
      localStorage.setItem("currentDoctor", JSON.stringify(editedDoctor));
      
      // Update state
      setDoctor(editedDoctor);
      setIsEditing(false);
      
      console.log("✅ Doctor profile updated successfully");
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating doctor profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setEditedDoctor(null);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof Doctor, value: string) => {
    if (!editedDoctor) return;
    setEditedDoctor({ ...editedDoctor, [field]: value });
  };

  const today = new Date().toISOString().split("T")[0];
  const upcomingAppointments = appointments.filter(
    (appt) => appt.date >= today,
  );
  const uniquePatients = Array.from(
    new Set(appointments.map((appt) => appt.patientName)),
  );

  // Format date for display
  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format time for display
  const formatDisplayTime = (timeString: string) => {
    return timeString; // Assuming time is already in readable format
  };

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
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
      {/* Header with patient info and status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#46C2DE] to-[#3bb0ca] rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-sm">
            {appt.patientName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{appt.patientName}</h3>
            <p className="text-sm text-gray-500 flex items-center">
              <UserCircle className="w-4 h-4 mr-1" />
              Patient
            </p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            appt.status === "Confirmed"
              ? "bg-green-100 text-green-700 border border-green-200"
              : appt.status === "Cancelled"
                ? "bg-red-100 text-red-700 border border-red-200"
                : "bg-yellow-100 text-yellow-700 border border-yellow-200"
          }`}
        >
          {appt.status}
        </span>
      </div>

      {/* Appointment details */}
      <div className="space-y-3">
        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="w-4 h-4 text-[#46C2DE]" />
            <span className="text-sm font-medium">{formatDisplayDate(appt.date)}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="w-4 h-4 text-[#46C2DE]" />
            <span className="text-sm font-medium">{formatDisplayTime(appt.time)}</span>
          </div>
        </div>

        {/* Phone Number */}
        {appt.patientPhone && (
          <div className="flex items-center space-x-2 text-gray-600">
            <Phone className="w-4 h-4 text-[#46C2DE]" />
            <span className="text-sm font-medium">{appt.patientPhone}</span>
          </div>
        )}

        {/* Appointment Token */}
        {appt.token && (
          <div className="flex items-center space-x-2 text-gray-600">
            <Hash className="w-4 h-4 text-[#46C2DE]" />
            <span className="text-sm font-medium">Token: {appt.token}</span>
          </div>
        )}

        {/* Appointment ID */}
        <div className="flex items-center space-x-2 text-gray-500">
          <Hash className="w-4 h-4 text-gray-400" />
          <span className="text-xs">ID: {appt.id}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex space-x-2">
        <button className="flex-1 bg-[#46C2DE] text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-[#3bb0ca] transition-colors">
          View Details
        </button>
        <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
          Contact
        </button>
      </div>
    </div>
  );

  const renderActiveContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                  Upcoming Appointments
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Manage your patient appointments and schedules
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[#46C2DE]">{upcomingAppointments.length}</div>
                <div className="text-sm text-gray-500">appointments</div>
              </div>
            </div>
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                <CalendarCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">No upcoming appointments</p>
                <p className="text-gray-400 text-sm mt-2">Your schedule is clear for now.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Profile</h2>
              {!isEditing && (
                <button
                  onClick={handleEditProfile}
                  className="flex items-center gap-2 px-4 py-2 bg-[#46C2DE] text-white rounded-lg hover:bg-[#3bb0ca] transition-colors duration-200 shadow-sm"
                >
                  <Edit2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit Profile</span>
                  <span className="sm:hidden">Edit</span>
                </button>
              )}
              {isEditing && (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center gap-2 px-3 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                    <span className="hidden sm:inline">Cancel</span>
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-sm"
                  >
                    <Save className="w-4 h-4" />
                    <span className="hidden sm:inline">Save Changes</span>
                    <span className="sm:hidden">Save</span>
                  </button>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedDoctor?.name || ""}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="w-full px-3 py-2 text-lg border border-gray-300 rounded-lg focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20 focus:outline-none"
                      />
                    ) : (
                      <p className="text-lg text-gray-900 mt-1">{doctor.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedDoctor?.phone || ""}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="w-full px-3 py-2 text-lg border border-gray-300 rounded-lg focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20 focus:outline-none"
                      />
                    ) : (
                      <p className="text-lg text-gray-900 mt-1">{doctor.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Specialization</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedDoctor?.specialization || ""}
                        onChange={(e) => handleInputChange("specialization", e.target.value)}
                        className="w-full px-3 py-2 text-lg border border-gray-300 rounded-lg focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20 focus:outline-none"
                        placeholder="e.g., Cardiologist, Dermatologist"
                      />
                    ) : (
                      <p className="text-lg text-gray-900 mt-1">{doctor.specialization || "—"}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Experience</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedDoctor?.experience || ""}
                        onChange={(e) => handleInputChange("experience", e.target.value)}
                        className="w-full px-3 py-2 text-lg border border-gray-300 rounded-lg focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20 focus:outline-none"
                        placeholder="e.g., 10 years"
                      />
                    ) : (
                      <p className="text-lg text-gray-900 mt-1">{doctor.experience || "—"}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">About</label>
                    {isEditing ? (
                      <textarea
                        value={editedDoctor?.about || ""}
                        onChange={(e) => handleInputChange("about", e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 text-lg border border-gray-300 rounded-lg focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20 focus:outline-none resize-none"
                        placeholder="Tell patients about your expertise and approach..."
                      />
                    ) : (
                      <p className="text-lg text-gray-900 mt-1">{doctor.about || "—"}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "schedule":
        return (
          <div className="space-y-6">
            <DoctorSlotEditor 
              doctorId={doctor?.id?.toString()} 
              onSlotsGenerated={(slots) => {
                console.log('Slots generated for doctor:', doctor?.id, slots);
                // You can add additional logic here if needed
              }}
            />
          </div>
        );

      case "patients":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Patient List</h2>
                <p className="text-sm text-gray-500 mt-1">
                  All patients who have booked appointments with you
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[#46C2DE]">{uniquePatients.length}</div>
                <div className="text-sm text-gray-500">unique patients</div>
              </div>
            </div>
            {uniquePatients.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">No patients found</p>
                <p className="text-gray-400 text-sm mt-2">Patients will appear here once they book appointments.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {uniquePatients.map((pname, idx) => (
                    <div key={idx} className="flex items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#46C2DE] to-[#3bb0ca] rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3 shadow-sm">
                        {pname.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="text-gray-900 font-medium">{pname}</span>
                        <p className="text-xs text-gray-500">Patient</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

              case "calendar":
          return <DoctorCalendar />;
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
              { key: "calendar", icon: Calendar, label: "Calendar" },
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
            { key: "calendar", icon: Calendar, label: "Calendar" },
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
