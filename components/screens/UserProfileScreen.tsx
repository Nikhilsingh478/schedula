"use client";

import { useState } from "react";
import { ArrowLeft, Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useNotification } from "@/context/NotificationContext";

export default function UserProfileScreen() {
  const router = useRouter();
  const { success, error: showError } = useNotification();

  const [user, setUser] = useState({
    fullName: "Nikhil Singh",
    email: "nikhil@example.com",
    phone: "9876543210",
    age: "22",
    gender: "Male",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Validate required fields
    if (!user.fullName.trim()) {
      showError("Validation Error", "Full name is required.");
      return;
    }
    
    if (!user.email.trim()) {
      showError("Validation Error", "Email is required.");
      return;
    }
    
    if (!user.phone.trim()) {
      showError("Validation Error", "Phone number is required.");
      return;
    }

    // Save logic (could integrate with localStorage / backend later)
    setIsEditing(false);
    success("Profile Updated", "Your profile has been updated successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#46C2DE] text-white py-4 px-4 md:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-1 rounded-full hover:bg-[#ffffff33] transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg md:text-xl font-medium">My Profile</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-12 py-6 md:py-8">
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {/* Profile Card */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                  Personal Information
                </h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-sm text-[#46C2DE] font-medium flex items-center gap-2 hover:bg-[#46C2DE]/10 px-3 py-2 rounded-lg transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit Profile
                  </button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                {["fullName", "email", "phone", "age", "gender"].map((field) => (
                  <div key={field} className={field === "fullName" || field === "email" ? "md:col-span-2" : ""}>
                    <label className="text-sm font-medium text-gray-700 capitalize block mb-2">
                      {field === "fullName" ? "Full Name" : field === "phone" ? "Phone Number" : field}
                    </label>
                    <input
                      type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                      name={field}
                      value={(user as any)[field]}
                      disabled={!isEditing}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 text-sm md:text-base rounded-lg border transition-colors ${
                        isEditing 
                          ? "border-[#46C2DE] focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20" 
                          : "border-gray-300 bg-gray-50 text-gray-600"
                      } focus:outline-none`}
                      placeholder={`Enter your ${field === "fullName" ? "full name" : field}`}
                    />
                  </div>
                ))}
              </div>

              {isEditing && (
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleSave}
                    className="bg-[#46C2DE] text-white py-3 px-6 rounded-lg font-medium text-sm md:text-base hover:bg-[#3bb0ca] transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium text-sm md:text-base hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#46C2DE] rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.fullName}</p>
                    <p className="text-sm text-gray-500">Patient</p>
                  </div>
                </div>
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Age:</span>
                    <span className="font-medium">{user.age} years</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Gender:</span>
                    <span className="font-medium">{user.gender}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Phone:</span>
                    <span className="font-medium">{user.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
