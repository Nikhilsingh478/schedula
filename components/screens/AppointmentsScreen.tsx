"use client";

import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/lib/config";
import Image from "next/image";
import { Bell, Calendar, Clock, User, CreditCard, X } from "lucide-react";
import { useNotification } from "@/context/NotificationContext";
import { useModal } from "@/hooks/useModal";
import Modal from "@/components/ui/Modal";

const TABS = ["upcoming", "completed", "cancelled"] as const;
type AppointmentStatus = typeof TABS[number];

export default function AppointmentsScreen({ showNotificationIcon = false }: { showNotificationIcon?: boolean }) {
  const [selectedTab, setSelectedTab] = useState<AppointmentStatus>("upcoming");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { success, error: showError } = useNotification();
  const { modal, confirm } = useModal();

  // Get current user
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

  useEffect(() => {
    const fetchAllAppointments = async () => {
      setLoading(true);
      try {
        // Fetch doctors data to get their images
        let allDoctors: any[] = [];
        try {
          const doctorsResponse = await fetch(API_ENDPOINTS.doctors);
          if (doctorsResponse.ok) {
            allDoctors = await doctorsResponse.json();
          }
        } catch (err) {
          console.log("Could not fetch doctors from server");
        }

        // Get doctors from localStorage (newly registered doctors)
        const localStorageDoctors = JSON.parse(localStorage.getItem("doctors") || "[]");
        allDoctors = [...allDoctors, ...localStorageDoctors];

        // Create a map of doctor IDs to their images
        const doctorImageMap = new Map();
        allDoctors.forEach((doctor: any) => {
          doctorImageMap.set(doctor.id, doctor.image);
        });

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

        // Add doctor images to appointments that don't have them
        const enhancedAppointments = allAppointments.map((appt: any) => {
          if (!appt.doctorImage && appt.doctorId) {
            const doctorImage = doctorImageMap.get(appt.doctorId);
            if (doctorImage) {
              console.log(`Adding doctor image for appointment ${appt.id}: ${doctorImage}`);
              return { ...appt, doctorImage };
            }
          }
          return appt;
        });

        console.log('Doctor image map:', Object.fromEntries(doctorImageMap));
        console.log('Enhanced appointments sample:', enhancedAppointments.slice(0, 3));
        console.log('Appointments with doctor images:', enhancedAppointments.filter(appt => appt.doctorImage).length);
        console.log('Appointments without doctor images:', enhancedAppointments.filter(appt => !appt.doctorImage).length);

        // Filter appointments for current user
        const userAppointments = enhancedAppointments.filter(
          (appt) => appt.patientName === currentUser.fullName || appt.patientName === "Test Patient"
        );

        console.log('Current user:', currentUser.fullName);
        console.log('User appointments count:', userAppointments.length);
        console.log('Sample user appointments:', userAppointments.slice(0, 2));

        setAppointments(userAppointments);
              } catch (err) {
          console.error("Error loading appointments:", err);
          setError("Failed to load appointments");
          showError("Loading Failed", "Failed to load appointments. Please refresh the page.");
        } finally {
        setLoading(false);
      }
    };

    fetchAllAppointments();
  }, [currentUser.fullName, showError]);

  const handleCancelAppointment = async (appointmentId: string) => {
    confirm(
      "Cancel Appointment",
      "Are you sure you want to cancel this appointment? This action cannot be undone.",
      async () => {
        try {
          // Update appointment status to cancelled
          const updatedAppointments = appointments.map(appt => 
            appt.id === appointmentId ? { ...appt, status: "cancelled" } : appt
          );

          // Update localStorage
          const allLocalAppointments = JSON.parse(localStorage.getItem("appointments") || "[]");
          const updatedLocalAppointments = allLocalAppointments.map((appt: any) => 
            appt.id === appointmentId ? { ...appt, status: "cancelled" } : appt
          );
          localStorage.setItem("appointments", JSON.stringify(updatedLocalAppointments));

          // Try to update JSON server (if appointment exists there)
          try {
            await fetch(`${API_ENDPOINTS.appointments}/${appointmentId}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ status: "cancelled" }),
            });
          } catch (serverError) {
            console.log("Could not update server, but updated locally");
          }

          setAppointments(updatedAppointments);
          success("Appointment Cancelled", "Your appointment has been cancelled successfully.");
        } catch (error) {
          console.error("Error cancelling appointment:", error);
          showError("Cancellation Failed", "Failed to cancel appointment. Please try again.");
        }
      }
    );
  };

  const filteredAppointments = appointments.filter((appt) => {
    if (selectedTab === "upcoming") {
      return appt.status === "Confirmed" || appt.status === "confirmed";
    } else if (selectedTab === "completed") {
      return appt.status === "Completed" || appt.status === "completed";
    } else if (selectedTab === "cancelled") {
      return appt.status === "Cancelled" || appt.status === "cancelled";
    }
    return false;
  });

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
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-[#46C2DE] text-white rounded-lg hover:bg-[#3bb0ca] transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const AppointmentCard = ({ appt }: { appt: any }) => (
    <div className="border border-gray-200 rounded-xl p-4 md:p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all duration-200 bg-white">
      <div className="flex items-start gap-4">
        <div className="relative w-[70px] h-[70px] flex-shrink-0">
          {appt.doctorImage ? (
            <Image
              src={appt.doctorImage}
              alt={appt.doctorName}
              width={70}
              height={70}
              className="w-full h-full rounded-full object-cover border-2 border-[#46C2DE]/20"
              onError={(e) => {
                // Fallback to default image if the doctor image fails to load
                const target = e.target as HTMLImageElement;
                target.src = "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop";
                console.log(`Image failed to load for ${appt.doctorName}, using fallback`);
              }}
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-[#46C2DE] to-[#3bb0ca] flex items-center justify-center border-2 border-[#46C2DE]/20 shadow-sm">
              <span className="text-white text-lg font-bold">{appt.doctorName?.charAt(0) || "D"}</span>
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#46C2DE] rounded-full flex items-center justify-center shadow-sm">
            <span className="text-white text-xs font-bold">👨‍⚕️</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h2 className="font-bold text-lg md:text-xl text-gray-900 mb-1">{appt.doctorName}</h2>
              {/* Token Display */}
              <div className="bg-gradient-to-r from-[#46C2DE] to-[#3bb0ca] text-white px-4 py-2 rounded-lg inline-block mb-3 shadow-sm">
                <span className="text-sm font-bold">Token: {appt.token || "N/A"}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                  <Calendar className="w-4 h-4 text-[#46C2DE]" />
                  <span className="font-medium">{appt.date}</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                  <Clock className="w-4 h-4 text-[#46C2DE]" />
                  <span className="font-medium text-[#46C2DE]">{appt.time}</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                  <User className="w-4 h-4 text-[#46C2DE]" />
                  <span className="font-medium text-gray-700">{appt.patientName}</span>
                </div>
              </div>
            </div>
            <div className="text-[#46C2DE] bg-gradient-to-br from-[#e7f8fb] to-[#d1f2f8] px-4 py-3 rounded-xl text-sm font-semibold ml-4 shadow-sm">
              🏥
            </div>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-600 bg-gray-50 px-4 py-3 rounded-lg">
            <span className="font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-[#46C2DE] rounded-full"></span>
              In-person Consultation
            </span>
            <span className={`px-4 py-2 rounded-full text-xs font-bold capitalize shadow-sm ${
              appt.status === 'Confirmed' || appt.status === 'confirmed' ? 'bg-green-100 text-green-700 border border-green-200' :
              appt.status === 'Cancelled' || appt.status === 'cancelled' ? 'bg-red-100 text-red-700 border border-red-200' :
              'bg-yellow-100 text-yellow-700 border border-yellow-200'
            }`}>
              {appt.status}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2 border-t border-gray-100">
        {(appt.status === "Confirmed" || appt.status === "confirmed") && (
          <button 
            onClick={() => handleCancelAppointment(appt.id)}
            className="flex-1 md:flex-none border-2 border-red-500 text-red-500 rounded-lg py-3 px-6 text-sm font-semibold hover:bg-red-500 hover:text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
          >
            <X className="w-4 h-4" />
            Cancel Appointment
          </button>
        )}
        {appt.status === "cancelled" || appt.status === "Cancelled" ? (
          <button className="flex-1 md:flex-none border-2 border-[#46C2DE] text-[#46C2DE] rounded-lg py-3 px-6 text-sm font-semibold hover:bg-[#46C2DE] hover:text-white transition-all duration-200 shadow-sm">
            Book Again
          </button>
        ) : (
          <button className="flex-1 md:flex-none border-2 border-[#46C2DE] text-[#46C2DE] rounded-lg py-3 px-6 text-sm font-semibold hover:bg-[#46C2DE] hover:text-white transition-all duration-200 shadow-sm">
            View Details
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modal */}
      <Modal {...modal} />
      
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 lg:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-gray-900">My Appointments</h1>
              <p className="text-sm md:text-base text-gray-600 mt-1">Manage your healthcare appointments</p>
            </div>
            {showNotificationIcon && (
              <button className="p-3 hover:bg-gray-100 rounded-full transition-colors relative">
                <Bell className="w-6 h-6 text-gray-600" />
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">5</div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex justify-around md:justify-start md:space-x-8">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`text-sm md:text-base py-4 md:py-6 px-2 md:px-6 font-semibold border-b-2 transition-all duration-200 ${
                  selectedTab === tab
                    ? "border-[#46C2DE] text-[#46C2DE] bg-[#46C2DE]/5"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} Appointments
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Appointment Cards */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 lg:py-8">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-300 mb-6">
              <Calendar className="w-20 h-20 mx-auto" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">No {selectedTab} appointments</h3>
                            <p className="text-gray-500 text-lg max-w-md mx-auto">You don&apos;t have any {selectedTab} appointments at the moment. Book an appointment with a doctor to get started.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:gap-8">
            {filteredAppointments.map((appt) => (
              <AppointmentCard key={appt.id} appt={appt} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
