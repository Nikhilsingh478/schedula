"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, ArrowLeft, Upload, X } from "lucide-react";
import { API_ENDPOINTS } from "@/lib/config";

interface DoctorSignUpFormData {
  fullName: string;
  mobile: string;
  email: string;
  specialization: string;
  qualification: string;
  experience: string;
  password: string;
  confirmPassword: string;
}

export default function DoctorSignUpScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<DoctorSignUpFormData>();

  const password = watch("password");

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

  const onSubmit = async (data: DoctorSignUpFormData) => {
    // Validate passwords match
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Get existing doctors from localStorage
    const existingDoctors = JSON.parse(localStorage.getItem("doctors") || "[]");
    
    // Check if doctor already exists
    const doctorExists = existingDoctors.find((doctor: any) => doctor.phone === data.mobile);
    if (doctorExists) {
      alert("Doctor with this mobile number already exists!");
      return;
    }

    // Create new doctor in JSON server format
    const newDoctor = {
      id: `dr${existingDoctors.length + 7}`, // Start from dr7 since dr1-dr6 exist in JSON server
      name: data.fullName,
      phone: data.mobile,
      specialization: data.specialization,
      qualification: data.qualification,
      location: "Mumbai, India", // Default location
      patients: 0, // New doctor starts with 0 patients
      experience: parseInt(data.experience) || 0,
      rating: 4.5, // Default rating for new doctors
      about: `Dr. ${data.fullName} is a ${data.specialization} with ${data.experience} years of experience. ${data.qualification} qualified professional dedicated to providing excellent patient care.`,
      services: `${data.specialization}, Consultation, Assessment`,
      slots: [
        "09:00 AM",
        "10:00 AM", 
        "11:00 AM",
        "02:00 PM",
        "03:00 PM",
        "04:00 PM"
      ],
      image: profileImage || "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop", // Use uploaded image or default
      workingHours: "Mon-Fri: 9:00 AM - 6:00 PM",
      availability: "Available Today",
      bio: `Experienced ${data.specialization} with ${data.experience} years of practice. Committed to providing personalized care and treatment plans for all patients.`,
      password: data.password, // In real app, this should be hashed
      role: "doctor",
      createdAt: new Date().toISOString(),
    };

    try {
      // Save to JSON server first
      const response = await fetch(API_ENDPOINTS.doctors, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDoctor),
      });

      if (!response.ok) {
        throw new Error('Failed to save to server');
      }

      // Also save to localStorage as backup
      const updatedDoctors = [...existingDoctors, newDoctor];
      localStorage.setItem("doctors", JSON.stringify(updatedDoctors));

      // Show success message and redirect to login
      alert("Account created successfully! Please login.");
      router.push("/doctor/login");
    } catch (error) {
      console.error("Error saving doctor:", error);
      // Fallback to localStorage only
      const updatedDoctors = [...existingDoctors, newDoctor];
      localStorage.setItem("doctors", JSON.stringify(updatedDoctors));
      alert("Account created successfully! (Saved locally) Please login.");
      router.push("/doctor/login");
    }
  };

  const handleBackToLogin = () => {
    router.push("/doctor/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 md:px-8">
      {/* Mobile Layout */}
      <div className="w-full max-w-md md:hidden bg-white rounded-xl p-6 shadow-sm">
        <button
          onClick={handleBackToLogin}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </button>
        
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#1A1A1A] mb-2 text-center">
          Doctor Registration
        </h1>
        <p className="text-sm text-gray-500 mb-8 text-center">
          Create your doctor account
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
          {/* Full Name */}
          <div>
            <Label htmlFor="fullName" className="block mb-2 text-sm font-medium text-gray-700">
              Full Name *
            </Label>
            <Input
              type="text"
              id="fullName"
              placeholder="Dr. John Doe"
              {...register("fullName", {
                required: "Full name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
              className={`h-12 rounded-lg ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              } focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
            )}
          </div>

          {/* Profile Image Upload */}
          <div>
            <Label className="block mb-2 text-sm font-medium text-gray-700">
              Profile Picture (Optional)
            </Label>
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
                  <img src={profileImage} alt="Profile Preview" className="w-12 h-12 rounded-full object-cover border-2 border-[#46C2DE]" />
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
            <p className="text-xs text-gray-400 mt-1">Max size: 5MB. Supported formats: JPG, PNG, GIF</p>
          </div>

          {/* Mobile Number */}
          <div>
            <Label htmlFor="mobile" className="block mb-2 text-sm font-medium text-gray-700">
              Mobile Number *
            </Label>
            <Input
              type="tel"
              id="mobile"
              placeholder="Enter 10-digit phone number"
              {...register("mobile", {
                required: "Mobile number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Please enter a valid 10-digit mobile number",
                },
              })}
              className={`h-12 rounded-lg ${
                errors.mobile ? "border-red-500" : "border-gray-300"
              } focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20`}
            />
            {errors.mobile && (
              <p className="text-red-500 text-sm mt-1">{errors.mobile.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
              Email Address *
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="doctor@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Please enter a valid email address",
                },
              })}
              className={`h-12 rounded-lg ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Specialization */}
          <div>
            <Label htmlFor="specialization" className="block mb-2 text-sm font-medium text-gray-700">
              Specialization *
            </Label>
            <Input
              type="text"
              id="specialization"
              placeholder="e.g., Cardiologist, Dermatologist"
              {...register("specialization", {
                required: "Specialization is required",
              })}
              className={`h-12 rounded-lg ${
                errors.specialization ? "border-red-500" : "border-gray-300"
              } focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20`}
            />
            {errors.specialization && (
              <p className="text-red-500 text-sm mt-1">{errors.specialization.message}</p>
            )}
          </div>

          {/* Qualification */}
          <div>
            <Label htmlFor="qualification" className="block mb-2 text-sm font-medium text-gray-700">
              Qualification *
            </Label>
            <Input
              type="text"
              id="qualification"
              placeholder="e.g., MBBS, MD (Cardiology)"
              {...register("qualification", {
                required: "Qualification is required",
              })}
              className={`h-12 rounded-lg ${
                errors.qualification ? "border-red-500" : "border-gray-300"
              } focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20`}
            />
            {errors.qualification && (
              <p className="text-red-500 text-sm mt-1">{errors.qualification.message}</p>
            )}
          </div>

          {/* Experience */}
          <div>
            <Label htmlFor="experience" className="block mb-2 text-sm font-medium text-gray-700">
              Years of Experience *
            </Label>
            <Input
              type="number"
              id="experience"
              placeholder="e.g., 5"
              {...register("experience", {
                required: "Experience is required",
                min: {
                  value: 0,
                  message: "Experience cannot be negative",
                },
              })}
              className={`h-12 rounded-lg ${
                errors.experience ? "border-red-500" : "border-gray-300"
              } focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20`}
            />
            {errors.experience && (
              <p className="text-red-500 text-sm mt-1">{errors.experience.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
              Password *
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Create a password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className={`h-12 rounded-lg ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20 pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <Label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">
              Confirm Password *
            </Label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="Confirm your password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === password || "Passwords do not match",
                })}
                className={`h-12 rounded-lg ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                } focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20 pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-[#46C2DE] hover:bg-[#3bb0ca] text-white rounded-lg transition-all duration-200"
          >
            Create Account
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
              Sign In
            </button>
          </p>
        </div>
      </div>

      {/* Desktop Layout - Card Centered */}
      <Card className="hidden md:block w-full max-w-md shadow-xl border-0">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <button
              onClick={handleBackToLogin}
              className="flex items-center text-gray-600 hover:text-gray-800 mb-4 mx-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </button>
            <h1 className="text-3xl font-semibold text-[#1A1A1A] mb-2">
              Doctor Registration
            </h1>
            <p className="text-gray-500">
              Create your doctor account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
            {/* Full Name */}
            <div>
              <Label htmlFor="fullName-desktop" className="block mb-2 text-sm font-medium text-gray-700">
                Full Name *
              </Label>
              <Input
                type="text"
                id="fullName-desktop"
                placeholder="Dr. John Doe"
                {...register("fullName", {
                  required: "Full name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                className={`h-12 rounded-lg ${
                  errors.fullName ? "border-red-500" : "border-gray-300"
                } focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20`}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
              )}
            </div>

            {/* Profile Image Upload */}
            <div>
              <Label className="block mb-2 text-sm font-medium text-gray-700">
                Profile Picture (Optional)
              </Label>
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
                    <img src={profileImage} alt="Profile Preview" className="w-12 h-12 rounded-full object-cover border-2 border-[#46C2DE]" />
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
              <p className="text-xs text-gray-400 mt-1">Max size: 5MB. Supported formats: JPG, PNG, GIF</p>
            </div>

            {/* Mobile Number */}
            <div>
              <Label htmlFor="mobile-desktop" className="block mb-2 text-sm font-medium text-gray-700">
                Mobile Number *
              </Label>
              <Input
                type="tel"
                id="mobile-desktop"
                placeholder="Enter 10-digit phone number"
                {...register("mobile", {
                  required: "Mobile number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Please enter a valid 10-digit mobile number",
                  },
                })}
                className={`h-12 rounded-lg ${
                  errors.mobile ? "border-red-500" : "border-gray-300"
                } focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20`}
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm mt-1">{errors.mobile.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email-desktop" className="block mb-2 text-sm font-medium text-gray-700">
                Email Address *
              </Label>
              <Input
                type="email"
                id="email-desktop"
                placeholder="doctor@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Please enter a valid email address",
                  },
                })}
                className={`h-12 rounded-lg ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Specialization */}
            <div>
              <Label htmlFor="specialization-desktop" className="block mb-2 text-sm font-medium text-gray-700">
                Specialization *
              </Label>
              <Input
                type="text"
                id="specialization-desktop"
                placeholder="e.g., Cardiologist, Dermatologist"
                {...register("specialization", {
                  required: "Specialization is required",
                })}
                className={`h-12 rounded-lg ${
                  errors.specialization ? "border-red-500" : "border-gray-300"
                } focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20`}
              />
              {errors.specialization && (
                <p className="text-red-500 text-sm mt-1">{errors.specialization.message}</p>
              )}
            </div>

            {/* Qualification */}
            <div>
              <Label htmlFor="qualification-desktop" className="block mb-2 text-sm font-medium text-gray-700">
                Qualification *
              </Label>
              <Input
                type="text"
                id="qualification-desktop"
                placeholder="e.g., MBBS, MD (Cardiology)"
                {...register("qualification", {
                  required: "Qualification is required",
                })}
                className={`h-12 rounded-lg ${
                  errors.qualification ? "border-red-500" : "border-gray-300"
                } focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20`}
              />
              {errors.qualification && (
                <p className="text-red-500 text-sm mt-1">{errors.qualification.message}</p>
              )}
            </div>

            {/* Experience */}
            <div>
              <Label htmlFor="experience-desktop" className="block mb-2 text-sm font-medium text-gray-700">
                Years of Experience *
              </Label>
              <Input
                type="number"
                id="experience-desktop"
                placeholder="e.g., 5"
                {...register("experience", {
                  required: "Experience is required",
                  min: {
                    value: 0,
                    message: "Experience cannot be negative",
                  },
                })}
                className={`h-12 rounded-lg ${
                  errors.experience ? "border-red-500" : "border-gray-300"
                } focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20`}
              />
              {errors.experience && (
                <p className="text-red-500 text-sm mt-1">{errors.experience.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password-desktop" className="block mb-2 text-sm font-medium text-gray-700">
                Password *
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password-desktop"
                  placeholder="Create a password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className={`h-12 rounded-lg ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20 pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirmPassword-desktop" className="block mb-2 text-sm font-medium text-gray-700">
                Confirm Password *
              </Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword-desktop"
                  placeholder="Confirm your password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) => value === password || "Passwords do not match",
                  })}
                  className={`h-12 rounded-lg ${
                    errors.confirmPassword ? "border-red-500" : "border-gray-300"
                  } focus:border-[#46C2DE] focus:ring-2 focus:ring-[#46C2DE]/20 pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Profile Image Upload */}
            <div className="flex items-center justify-center w-full mb-6">
              <label htmlFor="profileImage-desktop" className="cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-full p-3">
                <Upload className="w-6 h-6 text-gray-500" />
              </label>
              <input
                type="file"
                id="profileImage-desktop"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {profileImage && (
                <div className="ml-4 flex items-center">
                  <img src={profileImage} alt="Profile Preview" className="w-10 h-10 rounded-full object-cover" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#46C2DE] hover:bg-[#3bb0ca] text-white rounded-lg transition-all duration-200"
            >
              Create Account
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
                Sign In
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 