"use client";

import { FC } from "react";

interface BookingSuccessModalProps {
  token: string;
  onClose: () => void;
}

const BookingSuccessModal: FC<BookingSuccessModalProps> = ({
  token,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6 text-center relative">
        {/* Inline SVG Illustration */}
        <div className="mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto h-24 w-24"
            fill="none"
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="48" fill="#46C2DE" opacity="0.2" />
            <path
              d="M40 50l8 8 16-16"
              stroke="#46C2DE"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="50" cy="50" r="48" stroke="#46C2DE" strokeWidth="2" />
          </svg>
        </div>

        {/* Heading */}
        <h2 className="text-lg font-semibold text-black mb-1">
          Appointment Booked Successfully !
        </h2>

        {/* Token Number */}
        <p className="text-sm font-medium text-black">
          Token No <span className="text-[#46C2DE]">{token}</span>
        </p>

        {/* Subtext */}
        <p className="text-xs text-gray-500 mt-2">
          You will receive a Notification of Before half hour for as reminder
          thank you...
        </p>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-6 w-full bg-[#46C2DE] text-white py-2 rounded-lg font-medium text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default BookingSuccessModal;
