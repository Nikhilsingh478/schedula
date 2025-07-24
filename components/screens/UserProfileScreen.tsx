'use client';

import { useState } from 'react';
import { ArrowLeft, Edit2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UserProfileScreen() {
  const router = useRouter();

  const [user, setUser] = useState({
    fullName: 'Nikhil Singh',
    email: 'nikhil@example.com',
    phone: '9876543210',
    age: '22',
    gender: 'Male',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Save logic (could integrate with localStorage / backend later)
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-white max-w-sm mx-auto font-sans">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#46C2DE] text-white py-4 px-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="p-1 rounded-full hover:bg-[#ffffff33]">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-medium">My Profile</h1>
      </div>

      {/* Profile Card */}
      <div className="mt-6 mx-4 p-4 border rounded-xl shadow-sm border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-semibold text-gray-800">User Details</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-[#46C2DE] font-medium flex items-center gap-1"
            >
              <Edit2 className="h-4 w-4" />
              Edit
            </button>
          )}
        </div>

        <div className="grid gap-3">
          {['fullName', 'email', 'phone', 'age', 'gender'].map((field) => (
            <div key={field}>
              <label className="text-xs text-gray-500 capitalize block mb-1">
                {field === 'fullName' ? 'Full Name' : field}
              </label>
              <input
                type="text"
                name={field}
                value={(user as any)[field]}
                disabled={!isEditing}
                onChange={handleChange}
                className={`w-full px-3 py-2 text-sm rounded-lg border ${
                  isEditing ? 'border-[#46C2DE]' : 'border-gray-300 bg-gray-100'
                } focus:outline-none`}
              />
            </div>
          ))}
        </div>

        {isEditing && (
          <button
            onClick={handleSave}
            className="mt-6 w-full bg-[#46C2DE] text-white py-2 rounded-lg font-medium text-sm"
          >
            Save Profile
          </button>
        )}
      </div>
    </div>
  );
}
