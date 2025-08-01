// Utility functions for managing localStorage quota

export const clearOldData = () => {
  try {
    // Clear old doctor data
    localStorage.removeItem("currentDoctor");
    localStorage.removeItem("doctorPhone");
    localStorage.removeItem("userRole");
    localStorage.removeItem("doctorVerified");
    
    // Clear old user data if exists
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userVerified");
    
    // Clear old appointments data if it's too large
    const appointments = localStorage.getItem("appointments");
    if (appointments && appointments.length > 10000) {
      localStorage.removeItem("appointments");
    }
  } catch (error) {
    console.error("Failed to clear old data:", error);
  }
};

export const safeSetItem = (key: string, value: string): boolean => {
  try {
    // Check if we're approaching quota limit
    const currentSize = JSON.stringify(localStorage).length;
    const newItemSize = key.length + value.length;
    
    // If adding this item would exceed 4MB (typical localStorage limit), clear old data
    if (currentSize + newItemSize > 4000000) {
      clearOldData();
    }
    
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Failed to set localStorage item ${key}:`, error);
    return false;
  }
};

export const getStorageUsage = (): number => {
  try {
    return JSON.stringify(localStorage).length;
  } catch (error) {
    console.error("Failed to get storage usage:", error);
    return 0;
  }
};

export const isStorageAvailable = (): boolean => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
}; 