"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  phone: z
    .string()
    .min(10, "Phone number must be 10 digits")
    .max(10, "Phone number must be 10 digits")
    .regex(/^[6-9]\d{9}$/, "Enter a valid Indian phone number"),
});

type FormData = z.infer<typeof schema>;

export default function DoctorLoginScreen() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    document.body.classList.add("font-poppins");

    // 🛡 Redirect if doctor is already logged in
    const doctorPhone =
      typeof window !== "undefined" && localStorage.getItem("doctorPhone");
    if (doctorPhone) {
      router.replace("/doctor/main");
    }
  }, [router]);

  const onSubmit = (data: FormData) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("doctorPhone", data.phone);
      router.push("/doctor/verify-otp");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white">
      <h1 className="text-2xl sm:text-3xl font-semibold text-[#1A1A1A] mb-2">
        Doctor Login
      </h1>
      <p className="text-sm text-gray-500 mb-8 text-center">
        Enter your phone number to receive an OTP
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-6"
      >
        <div>
          <label
            htmlFor="phone"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            placeholder="Enter 10-digit phone number"
            {...register("phone")}
            className={`w-full border ${
              errors.phone ? "border-red-500" : "border-gray-300"
            } rounded-xl px-4 py-2 outline-none focus:border-[#46C2DE]`}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#46C2DE] text-white py-2 px-4 rounded-xl hover:bg-[#3bb0ca] transition disabled:opacity-50"
        >
          {isSubmitting ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>
    </div>
  );
}
