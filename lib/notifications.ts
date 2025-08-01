import { toast } from 'sonner';

export const showNotification = {
  // Success notifications
  success: (message: string) => {
    toast.success(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#10b981',
        color: 'white',
        border: 'none',
      },
    });
  },

  // Error notifications
  error: (message: string) => {
    toast.error(message, {
      duration: 5000,
      position: 'top-right',
      style: {
        background: '#ef4444',
        color: 'white',
        border: 'none',
      },
    });
  },

  // Warning notifications
  warning: (message: string) => {
    toast.warning(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#f59e0b',
        color: 'white',
        border: 'none',
      },
    });
  },

  // Info notifications
  info: (message: string) => {
    toast.info(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#3b82f6',
        color: 'white',
        border: 'none',
      },
    });
  },

  // Loading notifications
  loading: (message: string) => {
    return toast.loading(message, {
      position: 'top-right',
      style: {
        background: '#6b7280',
        color: 'white',
        border: 'none',
      },
    });
  },

  // Dismiss a specific toast
  dismiss: (toastId: string | number) => {
    toast.dismiss(toastId);
  },
};

// Specific notification functions for common use cases
export const notifications = {
  // Authentication related
  loginSuccess: () => showNotification.success('Login successful!'),
  loginError: (message: string) => showNotification.error(message),
  signupSuccess: () => showNotification.success('Account created successfully! Please login.'),
  signupError: (message: string) => showNotification.error(message),
  userNotFound: () => showNotification.error('User not found! Please sign up first.'),
  doctorNotFound: () => showNotification.error('Doctor not found! Please sign up first.'),
  invalidPassword: () => showNotification.error('Invalid password!'),
  passwordMismatch: () => showNotification.error('Passwords do not match!'),
  userExists: () => showNotification.error('User with this mobile number already exists!'),
  doctorExists: () => showNotification.error('Doctor with this mobile number already exists!'),

  // File upload related
  fileSizeError: () => showNotification.error('File size should be less than 5MB'),
  fileTypeError: () => showNotification.error('Please select a valid image file'),
  fileUploadSuccess: () => showNotification.success('File uploaded successfully!'),

  // Appointment related
  bookingSuccess: () => showNotification.success('Appointment booked successfully!'),
  bookingError: (message: string) => showNotification.error(message),
  cancelSuccess: () => showNotification.success('Appointment cancelled successfully!'),
  cancelError: () => showNotification.error('Failed to cancel appointment. Please try again.'),
  slotRequired: () => showNotification.warning('Please select a slot before booking.'),
  loginRequired: () => showNotification.warning('Please login to book an appointment.'),

  // Profile related
  profileUpdateSuccess: () => showNotification.success('Profile updated successfully!'),
  profileUpdateError: () => showNotification.error('Failed to update profile. Please try again.'),
  accountDeleteSuccess: () => showNotification.success('Account deleted successfully.'),
  accountDeleteError: () => showNotification.error('Failed to delete account. Please try again.'),

  // OTP related
  invalidOtp: () => showNotification.error('Please enter a valid 4-digit OTP.'),

  // General
  operationSuccess: (message: string) => showNotification.success(message),
  operationError: (message: string) => showNotification.error(message),
  info: (message: string) => showNotification.info(message),
  warning: (message: string) => showNotification.warning(message),
}; 