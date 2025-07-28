"use client";

import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/lib/config";
import Image from "next/image";
import { Bell, Calendar, Clock, User, CreditCard, X } from "lucide-react";

const TABS = ["upcoming", "completed", "cancelled"] as const;
type AppointmentStatus = typeof TABS[number];

export default function AppointmentsScreen({ showNotificationIcon = false }: { showNotificationIcon?: boolean }) {
  const [selectedTab, setSelectedTab] = useState<AppointmentStatus>("upcoming");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get current user
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

  useEffect(() => {
    const fetchAllAppointments = async () => {
    setLoading(true);
      try {
        // Fetch from JSON server
        const jsonServerResponse = await fetch(API_ENDPOINTS.appointments);
        let allAppointments = [];
        
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
          (appt) => appt.patientName === currentUser.fullName
        );

        setAppointments(userAppointments);
      } catch (err) {
        console.error("Error loading appointments:", err);
        setError("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAllAppointments();
  }, [currentUser.fullName]);

  const handleCancelAppointment = async (appointmentId: string) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this appointment?");
    if (!confirmCancel) return;

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
      alert("Appointment cancelled successfully!");
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      alert("Failed to cancel appointment. Please try again.");
    }
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
    <div className="border border-gray-200 rounded-xl p-4 md:p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="flex items-start gap-4">
        <Image
          src={appt.doctorImage || "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"}
          alt={appt.doctorName}
          width={60}
          height={60}
          className="rounded-xl object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h2 className="font-semibold text-lg md:text-xl text-gray-900 mb-1">{appt.doctorName}</h2>
              {/* Token Display */}
              <div className="bg-[#46C2DE] text-white px-3 py-1 rounded-lg inline-block mb-2">
                <span className="text-sm font-bold">Token: {appt.token || "N/A"}</span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{appt.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-[#46C2DE] font-medium">{appt.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span className="text-gray-500 font-medium">{appt.patientName}</span>
                </div>
              </div>
            </div>
            <div className="text-[#46C2DE] bg-[#e7f8fb] px-3 py-2 rounded-lg text-sm font-semibold ml-4">
              🏥
            </div>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-600">
            <span className="font-medium">In-person Consultation</span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
              appt.status === 'Confirmed' || appt.status === 'confirmed' ? 'bg-green-100 text-green-600' :
              appt.status === 'Cancelled' || appt.status === 'cancelled' ? 'bg-red-100 text-red-600' :
              'bg-yellow-100 text-yellow-600'
            }`}>
              {appt.status}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {(appt.status === "Confirmed" || appt.status === "confirmed") && (
          <button 
            onClick={() => handleCancelAppointment(appt.id)}
            className="flex-1 md:flex-none border border-red-500 text-red-500 rounded-lg py-2 px-4 text-sm font-medium hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancel Appointment
          </button>
        )}
        {appt.status === "cancelled" || appt.status === "Cancelled" ? (
          <button className="flex-1 md:flex-none border border-[#46C2DE] text-[#46C2DE] rounded-lg py-2 px-4 text-sm font-medium hover:bg-[#46C2DE] hover:text-white transition-colors">
            Book Again
          </button>
        ) : (
          <button className="flex-1 md:flex-none border border-[#46C2DE] text-[#46C2DE] rounded-lg py-2 px-4 text-sm font-medium hover:bg-[#46C2DE] hover:text-white transition-colors">
            View Details
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 lg:py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">My Appointments</h1>
        {showNotificationIcon && (
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
            <Bell className="w-6 h-6 text-gray-600" />
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">5</div>
          </button>
        )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex justify-around md:justify-start md:space-x-8">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
                className={`text-sm md:text-base py-3 md:py-4 font-medium transition-colors ${
              selectedTab === tab
                ? "border-b-2 border-[#46C2DE] text-[#46C2DE]"
                    : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
          </div>
        </div>
      </div>

      {/* Appointment Cards */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 lg:py-8">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-500">You don't have any {selectedTab} appointments.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {filteredAppointments.map((appt) => (
              <AppointmentCard key={appt.id} appt={appt} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
