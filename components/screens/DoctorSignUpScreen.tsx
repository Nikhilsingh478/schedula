"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, ArrowLeft, Upload, X } from "lucide-react";
import { API_ENDPOINTS } from "@/lib/config";

export default function DoctorSignUpScreen() {
  const router = useRouter();
  
  // Form state
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [qualification, setQualification] = useState("");
  const [experience, setExperience] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert("Please select a valid image file");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setImageFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("=== DOCTOR SIGNUP ATTEMPT ===");
    console.log("Form values:", { fullName, mobile, email, specialization, qualification, experience });

    // Validate required fields
    if (!fullName || !mobile || !email || !specialization || !qualification || !experience || !password || !confirmPassword) {
      alert("Please fill in all required fields!");
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    // Validate mobile number
    if (mobile.length !== 10) {
      alert("Mobile number must be 10 digits!");
      return;
    }

    try {
      // Get existing doctors from localStorage
      const existingDoctors = JSON.parse(localStorage.getItem("doctors") || "[]");
      console.log("Existing doctors:", existingDoctors.length);
      
      // Check if doctor already exists
      const doctorExists = existingDoctors.find((doctor: any) => doctor.phone === mobile);
      if (doctorExists) {
        alert("Doctor with this mobile number already exists!");
        return;
      }

      // Create new doctor in JSON server format
      const newDoctor = {
        id: `dr${existingDoctors.length + 7}`, // Start from dr7 since dr1-dr6 exist in JSON server
        name: fullName,
        phone: mobile,
        email: email,
        specialization: specialization,
        qualification: qualification,
        location: "Mumbai, India", // Default location
        patients: 0, // New doctor starts with 0 patients
        experience: parseInt(experience) || 0,
        rating: 4.5, // Default rating for new doctors
        about: `Dr. ${fullName} is a ${specialization} with ${experience} years of experience. ${qualification} qualified professional dedicated to providing excellent patient care.`,
        services: `${specialization}, Consultation, Assessment`,
        slots: [
          "09:00 AM",
          "10:00 AM", 
          "11:00 AM",
          "12:00 PM",
          "02:00 PM",
          "03:00 PM",
          "04:00 PM",
          "05:00 PM"
        ],
        image: profileImage || "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
        password: password
      };

      console.log("New doctor data:", newDoctor);

      // Add to localStorage
      const updatedDoctors = [...existingDoctors, newDoctor];
      localStorage.setItem("doctors", JSON.stringify(updatedDoctors));
      console.log("Doctor added to localStorage");

      // Try to add to JSON server
      try {
        const response = await fetch(API_ENDPOINTS.doctors, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newDoctor),
        });

        if (response.ok) {
          console.log("Doctor added to JSON server successfully");
        } else {
          console.log("Failed to add to JSON server, but stored locally");
        }
      } catch (serverError) {
        console.log("Server error, but doctor stored locally:", serverError);
      }

      alert("Doctor registered successfully! You can now login.");
      // Stay on the same page (login screen) after signup
      window.location.reload();

    } catch (error) {
      console.error("Signup error:", error);
      alert("Registration failed. Please try again.");
    }
  };

  const handleBackToLogin = () => {
    router.push("/doctor");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 md:px-8">
      {/* Mobile Layout */}
      <div className="w-full max-w-md md:hidden bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center mb-6">
          <button
            onClick={handleBackToLogin}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-semibold text-[#1A1A1A]">
            Doctor Sign Up
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          {/* Profile Image Upload */}
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
            ) : (
              <span className="text-sm text-gray-500">Click to upload profile picture</span>
            )}
          </div>

          {/* Full Name */}
          <div>
            <Label htmlFor="fullName" className="block mb-2 text-sm font-medium text-gray-700">
              Full Name *
            </Label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="h-12 rounded-lg w-full px-3 py-2 text-sm border border-gray-300 focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20 focus:outline-none"
              required
            />
          </div>

          {/* Mobile */}
          <div>
            <Label htmlFor="mobile" className="block mb-2 text-sm font-medium text-gray-700">
              Mobile Number *
            </Label>
            <input
              type="tel"
              id="mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter 10-digit mobile number"
              className="h-12 rounded-lg w-full px-3 py-2 text-sm border border-gray-300 focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20 focus:outline-none"
              required
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
              Email *
            </Label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="h-12 rounded-lg w-full px-3 py-2 text-sm border border-gray-300 focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20 focus:outline-none"
              required
            />
          </div>

          {/* Specialization */}
          <div>
            <Label htmlFor="specialization" className="block mb-2 text-sm font-medium text-gray-700">
              Specialization *
            </Label>
            <input
              type="text"
              id="specialization"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              placeholder="e.g., Cardiologist, Dermatologist"
              className="h-12 rounded-lg w-full px-3 py-2 text-sm border border-gray-300 focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20 focus:outline-none"
              required
            />
          </div>

          {/* Qualification */}
          <div>
            <Label htmlFor="qualification" className="block mb-2 text-sm font-medium text-gray-700">
              Qualification *
            </Label>
            <input
              type="text"
              id="qualification"
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
              placeholder="e.g., MBBS, MD, MS"
              className="h-12 rounded-lg w-full px-3 py-2 text-sm border border-gray-300 focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20 focus:outline-none"
              required
            />
          </div>

          {/* Experience */}
          <div>
            <Label htmlFor="experience" className="block mb-2 text-sm font-medium text-gray-700">
              Years of Experience *
            </Label>
            <input
              type="number"
              id="experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Enter years of experience"
              className="h-12 rounded-lg w-full px-3 py-2 text-sm border border-gray-300 focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20 focus:outline-none"
              required
            />
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
              Password *
            </Label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (min 6 characters)"
                className="h-12 rounded-lg w-full px-3 py-2 text-sm border border-gray-300 focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20 focus:outline-none pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <Label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">
              Confirm Password *
            </Label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="h-12 rounded-lg w-full px-3 py-2 text-sm border border-gray-300 focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20 focus:outline-none pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-[#46C2DE] hover:bg-[#3bb0ca] text-white rounded-lg transition-all duration-200"
          >
            Sign Up
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Already have an account?{" "}
            <button 
              onClick={handleBackToLogin}
              className="text-[#46c2de] font-semibold hover:text-[#3bb5d1] transition-colors"
            >
              Login
            </button>
          </p>
        </div>
      </div>

      {/* Desktop Layout */}
      <Card className="hidden md:block w-full max-w-2xl shadow-xl border-0">
        <CardContent className="p-8">
          <div className="flex items-center mb-6">
            <button
              onClick={handleBackToLogin}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-3xl font-semibold text-[#1A1A1A]">
              Doctor Sign Up
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            {/* Profile Image Upload */}
            <div className="flex items-center gap-4">
              <label htmlFor="profileImage-desktop" className="cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-full p-3 transition-colors">
                <Upload className="w-6 h-6 text-gray-500" />
              </label>
              <input
                type="file"
                id="profileImage-desktop"
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
              ) : (
                <span className="text-sm text-gray-500">Click to upload profile picture</span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <Label htmlFor="fullName-desktop" className="block mb-2 text-sm font-medium text-gray-700">
                  Full Name *
                </Label>
                <input
                  type="text"
                  id="fullName-desktop"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="h-12 rounded-lg w-full px-3 py-2 text-sm border border-gray-300 focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20 focus:outline-none"
                  required
                />
              </div>

              {/* Mobile */}
              <div>
                <Label htmlFor="mobile-desktop" className="block mb-2 text-sm font-medium text-gray-700">
                  Mobile Number *
                </Label>
                <input
                  type="tel"
                  id="mobile-desktop"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Enter 10-digit mobile number"
                  className="h-12 rounded-lg w-full px-3 py-2 text-sm border border-gray-300 focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20 focus:outline-none"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email-desktop" className="block mb-2 text-sm font-medium text-gray-700">
                  Email *
                </Label>
                <input
                  type="email"
                  id="email-desktop"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="h-12 rounded-lg w-full px-3 py-2 text-sm border border-gray-300 focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20 focus:outline-none"
                  required
                />
              </div>

              {/* Specialization */}
              <div>
                <Label htmlFor="specialization-desktop" className="block mb-2 text-sm font-medium text-gray-700">
                  Specialization *
                </Label>
                <input
                  type="text"
                  id="specialization-desktop"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="e.g., Cardiologist, Dermatologist"
                  className="h-12 rounded-lg w-full px-3 py-2 text-sm border border-gray-300 focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20 focus:outline-none"
                  required
                />
              </div>

              {/* Qualification */}
              <div>
                <Label htmlFor="qualification-desktop" className="block mb-2 text-sm font-medium text-gray-700">
                  Qualification *
                </Label>
                <input
                  type="text"
                  id="qualification-desktop"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  placeholder="e.g., MBBS, MD, MS"
                  className="h-12 rounded-lg w-full px-3 py-2 text-sm border border-gray-300 focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20 focus:outline-none"
                  required
                />
              </div>

              {/* Experience */}
              <div>
                <Label htmlFor="experience-desktop" className="block mb-2 text-sm font-medium text-gray-700">
                  Years of Experience *
                </Label>
                <input
                  type="number"
                  id="experience-desktop"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="Enter years of experience"
                  className="h-12 rounded-lg w-full px-3 py-2 text-sm border border-gray-300 focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password */}
              <div>
                <Label htmlFor="password-desktop" className="block mb-2 text-sm font-medium text-gray-700">
                  Password *
                </Label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password-desktop"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password (min 6 characters)"
                    className="h-12 rounded-lg w-full px-3 py-2 text-sm border border-gray-300 focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20 focus:outline-none pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <Label htmlFor="confirmPassword-desktop" className="block mb-2 text-sm font-medium text-gray-700">
                  Confirm Password *
                </Label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword-desktop"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="h-12 rounded-lg w-full px-3 py-2 text-sm border border-gray-300 focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20 focus:outline-none pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#46C2DE] hover:bg-[#3bb0ca] text-white rounded-lg transition-all duration-200"
            >
              Sign Up
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Already have an account?{" "}
              <button 
                onClick={handleBackToLogin}
                className="text-[#46c2de] font-semibold hover:text-[#3bb5d1] transition-colors"
              >
                Login
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 