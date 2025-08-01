// Script to clear localStorage and remove hardcoded data
if (typeof window !== 'undefined') {
  // Clear all appointment data
  localStorage.removeItem("appointments");
  
  // Clear any hardcoded user data
  localStorage.removeItem("currentUser");
  localStorage.removeItem("currentDoctor");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userVerified");
  localStorage.removeItem("doctorVerified");
  localStorage.removeItem("doctorPhone");
  localStorage.removeItem("returnFromBooking");
  
  console.log("LocalStorage cleared successfully!");
  console.log("All hardcoded data has been removed.");
  console.log("Only real patient bookings will now appear in the doctor's dashboard.");
} 