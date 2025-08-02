"use client";

import { useNotification } from '@/context/NotificationContext';
import Toast from '@/components/ui/Toast';

const NotificationContainer = () => {
  const { toasts, removeToast } = useNotification();

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 space-y-3 w-full max-w-sm px-4">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            transform: `translateY(${index * 90}px)`,
            zIndex: 1000 - index
          }}
        >
          <Toast
            type={toast.type}
            title={toast.title}
            message={toast.message}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer; 