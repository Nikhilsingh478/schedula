"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserIcon, Stethoscope } from "lucide-react";

export default function RoleSelectionScreen() {
  const router = useRouter();

  const handleSelectRole = (role: "patient" | "doctor") => {
    if (typeof window !== "undefined") {
      localStorage.setItem("userRole", role);
      router.push(`/${role}/login`);
    }
  };

  useEffect(() => {
    document.body.classList.add("font-poppins");

    if (typeof window !== "undefined") {
      const doctorPhone = localStorage.getItem("doctorPhone");
      const tempDoctorPhone = localStorage.getItem("tempDoctorPhone");
      const patientPhone = localStorage.getItem("patientPhone");
      const role = localStorage.getItem("userRole");

      // 🔁 Role-based redirection logic
      if (role === "doctor") {
        if (doctorPhone) {
          router.replace("/doctor/main");
        } else if (tempDoctorPhone && !doctorPhone) {
          router.replace("/doctor/verify-otp");
        }
      } else if (role === "patient" && patientPhone) {
        router.replace("/patient/main");
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl sm:text-3xl font-semibold text-[#1A1A1A] mb-2">
        Select Your Role
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Choose how you want to continue
      </p>

      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
        <div
          onClick={() => handleSelectRole("patient")}
          className="flex-1 border border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center hover:border-[#46C2DE] hover:shadow-md transition cursor-pointer"
        >
          <UserIcon className="w-8 h-8 text-[#46C2DE] mb-3" />
          <span className="text-lg font-medium text-[#1A1A1A]">Patient</span>
        </div>

        <div
          onClick={() => handleSelectRole("doctor")}
          className="flex-1 border border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center hover:border-[#46C2DE] hover:shadow-md transition cursor-pointer"
        >
          <Stethoscope className="w-8 h-8 text-[#46C2DE] mb-3" />
          <span className="text-lg font-medium text-[#1A1A1A]">Doctor</span>
        </div>
      </div>
    </div>
  );
}
