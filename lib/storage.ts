// Storage utility to manage localStorage efficiently and prevent quota issues

export const storageUtils = {
  // Clear all localStorage data
  clearAll: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.warn("Could not clear localStorage:", error);
    }
  },

  // Clear specific keys
  clearKeys: (keys: string[]) => {
    try {
      keys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.warn("Could not clear localStorage keys:", error);
    }
  },

  // Set item with error handling
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn(`Could not set localStorage item ${key}:`, error);
      // If quota exceeded, try to clear some data and retry
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        try {
          // Clear old data and retry
          const keysToKeep = ['currentUser', 'currentDoctor', 'userRole'];
          const allKeys = Object.keys(localStorage);
          const keysToRemove = allKeys.filter(key => !keysToKeep.includes(key));
          keysToRemove.forEach(key => localStorage.removeItem(key));
          localStorage.setItem(key, value);
        } catch (retryError) {
          console.error("Failed to set item even after clearing:", retryError);
        }
      }
    }
  },

  // Get item with error handling
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn(`Could not get localStorage item ${key}:`, error);
      return null;
    }
  },

  // Store user data efficiently
  storeUser: (user: any) => {
    const essentialUserData = {
      id: user.id,
      name: user.fullName || user.name, // Handle both fullName and name
      phone: user.mobile || user.phone, // Handle both mobile and phone
      email: user.email,
      age: user.age,
      gender: user.gender,
      role: user.role || "patient"
    };
    storageUtils.setItem("currentUser", JSON.stringify(essentialUserData));
  },

  // Store doctor data efficiently
  storeDoctor: (doctor: any) => {
    const essentialDoctorData = {
      id: doctor.id,
      name: doctor.name,
      phone: doctor.phone,
      email: doctor.email,
      specialization: doctor.specialization,
      qualification: doctor.qualification,
      experience: doctor.experience,
      image: doctor.image
    };
    storageUtils.setItem("currentDoctor", JSON.stringify(essentialDoctorData));
  },

  // Store appointments efficiently (limit to last 50)
  storeAppointments: (appointments: any[]) => {
    const limitedAppointments = appointments.slice(-50); // Keep only last 50
    storageUtils.setItem("appointments", JSON.stringify(limitedAppointments));
  },

  // Store doctors efficiently (limit to last 20)
  storeDoctors: (doctors: any[]) => {
    const limitedDoctors = doctors.slice(-20); // Keep only last 20
    storageUtils.setItem("doctors", JSON.stringify(limitedDoctors));
  }
};

// User storage utilities
export const userStorage = {
  // Add a new user to localStorage
  addUser: (user: any): boolean => {
    try {
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const updatedUsers = [...existingUsers, user];
      storageUtils.setItem("users", JSON.stringify(updatedUsers));
      return true;
    } catch (error) {
      console.error("Failed to add user:", error);
      return false;
    }
  },

  // Get all users from localStorage
  getUsers: (): any[] => {
    try {
      return JSON.parse(localStorage.getItem("users") || "[]");
    } catch (error) {
      console.error("Failed to get users:", error);
      return [];
    }
  },

  // Find user by mobile number
  findUserByMobile: (mobile: string): any => {
    try {
      const users = userStorage.getUsers();
      return users.find((user: any) => user.mobile === mobile);
    } catch (error) {
      console.error("Failed to find user:", error);
      return null;
    }
  },

  // Update user data
  updateUser: (userId: string, updatedData: any): boolean => {
    try {
      const users = userStorage.getUsers();
      const userIndex = users.findIndex((user: any) => user.id === userId);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedData };
        storageUtils.setItem("users", JSON.stringify(users));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to update user:", error);
      return false;
    }
  },

  // Delete user
  deleteUser: (userId: string): boolean => {
    try {
      const users = userStorage.getUsers();
      const filteredUsers = users.filter((user: any) => user.id !== userId);
      storageUtils.setItem("users", JSON.stringify(filteredUsers));
      return true;
    } catch (error) {
      console.error("Failed to delete user:", error);
      return false;
    }
  }
};

// Notification utilities
export const notificationUtils = {
  // Add a notification for a patient
  addNotification: (patientName: string, notification: any): boolean => {
    try {
      const existingNotifications = JSON.parse(localStorage.getItem(`notifications_${patientName}`) || "[]");
      const updatedNotifications = [...existingNotifications, {
        ...notification,
        id: `notif_${Date.now()}`,
        timestamp: new Date().toISOString(),
        read: false
      }];
      storageUtils.setItem(`notifications_${patientName}`, JSON.stringify(updatedNotifications));
      return true;
    } catch (error) {
      console.error("Failed to add notification:", error);
      return false;
    }
  },

  // Get notifications for a patient
  getNotifications: (patientName: string): any[] => {
    try {
      return JSON.parse(localStorage.getItem(`notifications_${patientName}`) || "[]");
    } catch (error) {
      console.error("Failed to get notifications:", error);
      return [];
    }
  },

  // Mark notification as read
  markAsRead: (patientName: string, notificationId: string): boolean => {
    try {
      const notifications = notificationUtils.getNotifications(patientName);
      const updatedNotifications = notifications.map((notif: any) => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      );
      storageUtils.setItem(`notifications_${patientName}`, JSON.stringify(updatedNotifications));
      return true;
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      return false;
    }
  },

  // Get unread notification count
  getUnreadCount: (patientName: string): number => {
    try {
      const notifications = notificationUtils.getNotifications(patientName);
      return notifications.filter((notif: any) => !notif.read).length;
    } catch (error) {
      console.error("Failed to get unread count:", error);
      return 0;
    }
  },

  // Clear all notifications for a patient
  clearNotifications: (patientName: string): boolean => {
    try {
      localStorage.removeItem(`notifications_${patientName}`);
      return true;
    } catch (error) {
      console.error("Failed to clear notifications:", error);
      return false;
    }
  }
}; 