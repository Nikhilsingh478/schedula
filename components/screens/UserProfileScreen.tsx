"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Edit2, Save, X, User, Mail, Phone, Calendar, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserProfileScreen() {
  const router = useRouter();

  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [originalUser, setOriginalUser] = useState(user);

  // Load user data from localStorage on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setOriginalUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem("currentUser", JSON.stringify(user));
    setOriginalUser(user);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setUser(originalUser);
    setIsEditing(false);
  };

  const getFieldIcon = (field: string) => {
    switch (field) {
      case "fullName": return <User className="h-4 w-4" />;
      case "email": return <Mail className="h-4 w-4" />;
      case "phone": return <Phone className="h-4 w-4" />;
      case "age": return <Calendar className="h-4 w-4" />;
      case "gender": return <UserCheck className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getFieldType = (field: string) => {
    switch (field) {
      case "email": return "email";
      case "phone": return "tel";
      case "age": return "number";
      default: return "text";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-[#46C2DE] to-[#3BA8C4] text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-semibold">My Profile</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
                             <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#46C2DE] to-[#3BA8C4] rounded-full flex items-center justify-center">
                                   <span className="text-white text-xl md:text-2xl font-bold">
                    {(user.fullName || "U").charAt(0).toUpperCase()}
                  </span>
               </div>
               <div>
                                   <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    {user.fullName || "User"}
                  </h2>
                <p className="text-gray-600 text-sm md:text-base">Patient</p>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#46C2DE] text-white rounded-lg hover:bg-[#3BA8C4] transition-colors duration-200 shadow-md"
              >
                <Edit2 className="h-4 w-4" />
                <span className="hidden sm:inline">Edit Profile</span>
                <span className="sm:hidden">Edit</span>
              </button>
            )}
          </div>
        </div>

        {/* Profile Details Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900">
              Personal Information
            </h3>
            {isEditing && (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline">Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-md"
                >
                  <Save className="h-4 w-4" />
                  <span className="hidden sm:inline">Save Changes</span>
                  <span className="sm:hidden">Save</span>
                </button>
              </div>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {["fullName", "email", "phone", "age", "gender"].map((field) => (
              <div key={field} className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  {getFieldIcon(field)}
                  {field === "fullName" ? "Full Name" : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <div className="relative">
                  <input
                    type={getFieldType(field)}
                    name={field}
                    value={(user as any)[field]}
                    disabled={!isEditing}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 text-sm md:text-base rounded-xl border-2 transition-all duration-200 ${
                      isEditing 
                        ? "border-[#46C2DE] bg-white focus:border-[#3BA8C4] focus:ring-4 focus:ring-[#46C2DE]/20" 
                        : "border-gray-200 bg-gray-50 text-gray-600"
                    } focus:outline-none`}
                    placeholder={`Enter your ${field === "fullName" ? "full name" : field}`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="text-base font-medium text-gray-900">August 2024</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600">Account Status</p>
                <p className="text-base font-medium text-green-600">Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {!isEditing && (
          <div className="mt-6 space-y-3">
            <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200">
              Change Password
            </button>
            <button className="w-full bg-red-50 text-red-600 py-3 rounded-xl font-medium hover:bg-red-100 transition-colors duration-200">
              Delete Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
