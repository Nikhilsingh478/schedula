"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Home, User, CalendarCheck, Users, LogOut, Upload, X } from "lucide-react";
import { API_ENDPOINTS } from "@/lib/config";

type Appointment = {
  id: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  patientName: string;
  patientPhone: string;
  status: string;
  token?: string;
  patientEmail?: string;
  patientAge?: string;
  patientGender?: string;
  symptoms?: string;
};

type Doctor = {
  id: string;
  name: string;
  phone: string;
  email: string;
  specialization: string;
  qualification: string;
  experience: string;
  about?: string;
  image?: string;
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
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<Doctor>({
    defaultValues: {
      name: doctor?.name || "",
      phone: doctor?.phone || "",
      email: doctor?.email || "",
      specialization: doctor?.specialization || "",
      qualification: doctor?.qualification || "",
      experience: doctor?.experience || "",
      about: doctor?.about || "",
    },
  });

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert("Please select an image file");
        return;
      }

      // Read file as Data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
        setImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove image
  const removeImage = () => {
    setProfileImage(null);
    setImageFile(null);
  };

  // Clear all existing doctors (for fresh start)
  const clearAllDoctors = async () => {
    const deletionType = window.confirm(
      "Choose deletion scope:\n\n" +
      "Click OK to delete ALL doctors (including original ones from server)\n" +
      "Click Cancel to delete only user-created doctors (dr7 onwards)"
    );

    try {
      // Clear doctors from localStorage
      localStorage.removeItem("doctors");
      
      // Clear current doctor session
      localStorage.removeItem("currentDoctor");
      localStorage.removeItem("doctorPhone");
      localStorage.removeItem("doctorVerified");
      localStorage.removeItem("userRole");
      
      // Clear doctors from JSON server
      try {
        // Get all doctors from server
        const response = await fetch(API_ENDPOINTS.doctors);
        if (response.ok) {
          const doctors = await response.json();
          
          if (deletionType) {
            // Delete ALL doctors (including original ones)
            for (const doctor of doctors) {
              if (doctor.id) {
                await fetch(`${API_ENDPOINTS.doctors}/${doctor.id}`, {
                  method: 'DELETE',
                });
              }
            }
            alert("ALL doctors have been deleted from both local storage and server. The patient dashboard will be completely empty. You can now register new doctors.");
          } else {
            // Delete only user-created doctors (dr7 onwards)
            for (const doctor of doctors) {
              if (doctor.id && doctor.id.startsWith('dr') && parseInt(doctor.id.substring(2)) >= 7) {
                await fetch(`${API_ENDPOINTS.doctors}/${doctor.id}`, {
                  method: 'DELETE',
                });
              }
            }
            alert("User-created doctors have been deleted. Original doctors (dr1-dr6) remain in the patient dashboard. You can now register new doctors.");
          }
        }
      } catch (serverError) {
        console.log("Could not clear server doctors, but cleared locally");
        alert("Doctors cleared from local storage only. Server deletion failed.");
      }
      
      router.replace("/");
    } catch (err) {
      console.error("Failed to clear doctors:", err);
      alert("Failed to clear doctors. Please try again.");
    }
  };

  useEffect(() => {
    // Check if doctor is logged in and verified
    const currentDoctor = localStorage.getItem("currentDoctor");
    const doctorVerified = localStorage.getItem("doctorVerified");
    const userRole = localStorage.getItem("userRole");

    if (!currentDoctor || !doctorVerified || userRole !== "doctor") {
      router.replace("/doctor/login");
      return;
    }

    const fetchData = async () => {
      try {
        const doctorData = JSON.parse(currentDoctor);
        setDoctor(doctorData);
        reset(doctorData);

        // Fetch appointments from JSON server and localStorage
        const appointmentsResponse = await fetch(API_ENDPOINTS.appointments);
        let allAppointments: Appointment[] = [];
        
        if (appointmentsResponse.ok) {
          const jsonServerAppointments = await appointmentsResponse.json();
          allAppointments = [...jsonServerAppointments];
        }

        // Get appointments from localStorage (newly booked appointments)
        const localStorageAppointments = JSON.parse(localStorage.getItem("appointments") || "[]");
        
        // Add localStorage appointments that aren't in JSON server
        localStorageAppointments.forEach((localAppt: any) => {
          const exists = allAppointments.find((a: any) => a.id === localAppt.id);
          if (!exists) {
            allAppointments.push(localAppt);
          }
        });
        
        // Filter appointments for this specific doctor
        const doctorAppointments = allAppointments.filter(
          (appt) => appt.doctorId === doctorData.id
        );
        
        setAppointments(doctorAppointments);
      } catch (err) {
        console.error("Error loading data:", err);
        // Fallback to mock data if API fails
        const mockAppointments: Appointment[] = [
          {
            id: "a101",
            doctorId: doctor?.id || "dr1",
            doctorName: doctor?.name || "Doctor",
            date: "2025-01-20",
            time: "09:00 AM",
            patientName: "John Doe",
            patientPhone: "+1234567890",
            status: "Confirmed",
            token: "T001",
            patientEmail: "john.doe@example.com",
            patientAge: "30",
            patientGender: "Male",
            symptoms: "Headache, fatigue"
          },
          {
            id: "a102",
            doctorId: doctor?.id || "dr1",
            doctorName: doctor?.name || "Doctor",
            date: "2025-01-21",
            time: "10:00 AM",
            patientName: "Jane Smith",
            patientPhone: "+1234567891",
            status: "Pending",
            token: "T002",
            patientEmail: "jane.smith@example.com",
            patientAge: "28",
            patientGender: "Female",
            symptoms: "Cough, sore throat"
          },
          {
            id: "a103",
            doctorId: doctor?.id || "dr1",
            doctorName: doctor?.name || "Doctor",
            date: "2025-01-22",
            time: "02:00 PM",
            patientName: "Mike Johnson",
            patientPhone: "+1234567892",
            status: "Confirmed",
            token: "T003",
            patientEmail: "mike.johnson@example.com",
            patientAge: "45",
            patientGender: "Male",
            symptoms: "Chest pain, shortness of breath"
          }
        ];
        setAppointments(mockAppointments);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, reset]);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;

    // Clear all doctor-related data
    localStorage.removeItem("currentDoctor");
    localStorage.removeItem("doctorPhone");
    localStorage.removeItem("doctorVerified");
    localStorage.removeItem("userRole");
    
    router.replace("/");
  };

  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmDelete) return;

    try {
      // Remove doctor from localStorage doctors array
      const doctors = JSON.parse(localStorage.getItem("doctors") || "[]");
      const updatedDoctors = doctors.filter((d: any) => d.id !== doctor?.id);
      localStorage.setItem("doctors", JSON.stringify(updatedDoctors));

      // Clear all doctor-related data
      localStorage.removeItem("currentDoctor");
      localStorage.removeItem("doctorPhone");
      localStorage.removeItem("doctorVerified");
      localStorage.removeItem("userRole");
      
      alert("Account deleted successfully.");
      router.replace("/");
    } catch (err) {
      console.error("Failed to delete account:", err);
      alert("Failed to delete account. Please try again.");
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const upcomingAppointments = appointments.filter(
    (appt) => appt.date >= today && appt.patientName && appt.patientName.trim() !== ""
  );
  const uniquePatients = Array.from(
    new Set(appointments.map((appt) => appt.patientName).filter(name => name && name.trim() !== ""))
  );

  const handleProfileSave = async (data: Doctor) => {
    if (!doctor) return;

    try {
      // Update doctor data with image
      const updatedDoctor = { 
        ...doctor, 
        ...data,
        image: profileImage || doctor.image || "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop"
      };
      
      // Update current doctor in localStorage
      localStorage.setItem("currentDoctor", JSON.stringify(updatedDoctor));
      
      // Update in doctors array
      const doctors = JSON.parse(localStorage.getItem("doctors") || "[]");
      const updatedDoctors = doctors.map((d: any) => 
        d.id === doctor.id ? updatedDoctor : d
      );
      localStorage.setItem("doctors", JSON.stringify(updatedDoctors));
      
      // Try to update JSON server
      try {
        await fetch(`${API_ENDPOINTS.doctors}/${doctor.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedDoctor),
        });
      } catch (serverError) {
        console.log("Could not update server, but updated locally");
      }
      
      setDoctor(updatedDoctor);
      setEditMode(false);
      setProfileImage(null);
      setImageFile(null);
      
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to update profile. Please try again.");
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
              <div className="text-center py-12">
                <CalendarCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No upcoming appointments</p>
                <p className="text-gray-400 text-sm mt-2">Appointments will appear here once patients book them.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="border rounded-xl p-4 shadow-sm bg-white"
                  >
                    <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{appt.patientName}</h3>
                        <p className="text-sm text-gray-600">Token: <span className="font-bold text-[#46C2DE]">{appt.token || "N/A"}</span></p>
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600"><span className="font-medium">Date:</span> {appt.date}</p>
                        <p className="text-gray-600"><span className="font-medium">Time:</span> {appt.time}</p>
                        <p className="text-gray-600"><span className="font-medium">Phone:</span> {appt.patientPhone}</p>
                      </div>
                      <div>
                        <p className="text-gray-600"><span className="font-medium">Email:</span> {appt.patientEmail || "Not provided"}</p>
                        <p className="text-gray-600"><span className="font-medium">Age:</span> {appt.patientAge || "Not specified"}</p>
                        <p className="text-gray-600"><span className="font-medium">Gender:</span> {appt.patientGender || "Not specified"}</p>
                      </div>
                    </div>
                    
                    {appt.symptoms && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Symptoms/Reason:</span> {appt.symptoms}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "profile" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Profile</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="px-4 py-2 bg-[#46C2DE] text-white rounded-lg hover:bg-[#3bb0ca] transition"
                >
                  {editMode ? "Cancel" : "Edit Profile"}
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Delete Account
                </button>
                <button
                  onClick={clearAllDoctors}
                  className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition"
                >
                  Clear All Doctors
                </button>
              </div>
            </div>

            {editMode ? (
              <form onSubmit={handleSubmit(handleProfileSave)} className="space-y-6">
                {/* Profile Image Upload */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-4">
                    <label htmlFor="profileImage" className="cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-full p-3 transition-colors">
                      <Upload className="w-6 h-6 text-gray-500" />
                    </label>
                    <input
                      type="file"
                      id="profileImage"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    {profileImage ? (
                      <div className="flex items-center gap-2">
                        <img src={profileImage} alt="Profile Preview" className="w-16 h-16 rounded-full object-cover border-2 border-[#46C2DE]" />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : doctor?.image ? (
                      <div className="flex items-center gap-2">
                        <img src={doctor.image} alt="Current Profile" className="w-16 h-16 rounded-full object-cover border-2 border-gray-300" />
                        <span className="text-sm text-gray-500">Current image</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Click to upload profile picture</span>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Max size: 5MB. Supported formats: JPG, PNG, GIF</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      {...register("name")}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      {...register("phone")}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      {...register("email")}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                    <input
                      type="text"
                      {...register("specialization")}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Qualification</label>
                    <input
                      type="text"
                      {...register("qualification")}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years)</label>
                  <input
                      type="text"
                      {...register("experience")}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20"
                    />
                  </div>
                </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">About</label>
                <textarea
                    {...register("about")}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20"
                />
              </div>
                <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                    className="px-6 py-2 bg-[#46C2DE] text-white rounded-lg hover:bg-[#3bb0ca] transition disabled:opacity-50"
                    >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                {/* Profile Image Display */}
                <div className="flex items-center gap-4 mb-6">
                  <img 
                    src={doctor.image || "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop"} 
                    alt={doctor.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-[#46C2DE]"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
                    <p className="text-sm text-gray-500">{doctor.specialization}</p>
                  </div>
                </div>

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
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-lg text-gray-900 mt-1">{doctor.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Specialization</label>
                      <p className="text-lg text-gray-900 mt-1">{doctor.specialization || "—"}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Qualification</label>
                      <p className="text-lg text-gray-900 mt-1">{doctor.qualification || "—"}</p>
                    </div>
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
            )}
          </>
        )}

        {activeTab === "schedule" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">All Appointments</h2>
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
              <div className="space-y-4">
                {appointments.map((appt) => (
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Patient List</h2>
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
              <div className="space-y-4">
                {uniquePatients.map((patientName, idx) => {
                  // Get all appointments for this patient
                  const patientAppointments = appointments.filter(appt => appt.patientName === patientName);
                  const latestAppointment = patientAppointments[0]; // Most recent appointment
                  
                  return (
                    <div key={idx} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-[#46C2DE] rounded-full flex items-center justify-center text-white font-medium text-lg">
                            {patientName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{patientName}</h3>
                            <p className="text-sm text-gray-500">
                              {patientAppointments.length} appointment{patientAppointments.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          Last visit: {latestAppointment?.date || "N/A"}
                        </span>
                      </div>
                      
                      {latestAppointment && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600"><span className="font-medium">Phone:</span> {latestAppointment.patientPhone}</p>
                            <p className="text-gray-600"><span className="font-medium">Email:</span> {latestAppointment.patientEmail || "Not provided"}</p>
                          </div>
                          <div>
                            <p className="text-gray-600"><span className="font-medium">Age:</span> {latestAppointment.patientAge || "Not specified"}</p>
                            <p className="text-gray-600"><span className="font-medium">Gender:</span> {latestAppointment.patientGender || "Not specified"}</p>
                          </div>
                        </div>
                      )}
                      
                      {latestAppointment?.symptoms && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Recent Symptoms:</span> {latestAppointment.symptoms}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
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
