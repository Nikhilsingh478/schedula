import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatDateFull(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function generateToken(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export function getNextDays(count: number): string[] {
  const days = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push(date.toISOString().split("T")[0]);
  }

  return days;
}

// Convert display date format (e.g., "14 TUE") to ISO date format (e.g., "2025-01-14")
export function convertDisplayDateToISO(displayDate: string): string {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  
  // Extract day from display date (e.g., "14" from "14 TUE")
  const day = parseInt(displayDate.split(" ")[0]);
  
  // Create a date object for the current year and month
  const date = new Date(currentYear, currentMonth, day);
  
  // If the date is in the past, assume it's for next month
  if (date < new Date()) {
    date.setMonth(date.getMonth() + 1);
  }
  
  // Format as YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const dayStr = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${dayStr}`;
}

// Convert ISO date format to display format
export function convertISOToDisplayDate(isoDate: string): string {
  const date = new Date(isoDate);
  const day = date.getDate();
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
  return `${day} ${weekday}`;
}
