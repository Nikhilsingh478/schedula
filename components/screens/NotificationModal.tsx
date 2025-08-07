"use client";

import { useState, useEffect } from "react";
import { Bell, X, Clock, User, Calendar } from "lucide-react";
import { notificationUtils } from "@/lib/storage";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  appointmentId?: number;
  oldDateTime?: string;
  newDateTime?: string;
  doctorName?: string;
  timestamp: string;
  read: boolean;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
}

export default function NotificationModal({ isOpen, onClose, patientName }: NotificationModalProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && patientName) {
      loadNotifications();
    }
  }, [isOpen, patientName]);

  const loadNotifications = () => {
    setLoading(true);
    try {
      const patientNotifications = notificationUtils.getNotifications(patientName);
      // Sort by timestamp (newest first)
      const sortedNotifications = patientNotifications.sort((a: Notification, b: Notification) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setNotifications(sortedNotifications);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (notificationId: string) => {
    try {
      notificationUtils.markAsRead(patientName, notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "appointment_rescheduled":
        return <Calendar className="w-5 h-5 text-orange-500" />;
      case "appointment_cancelled":
        return <X className="w-5 h-5 text-red-500" />;
      case "appointment_reminder":
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#46C2DE]" />
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#46C2DE] mx-auto mb-4"></div>
              <p className="text-gray-500">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No notifications</p>
              <p className="text-gray-400 text-sm mt-1">You're all caught up!</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                    notification.read 
                      ? "bg-gray-50 border-gray-200" 
                      : "bg-blue-50 border-blue-200"
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium text-gray-900 text-sm">
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2"></div>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mt-1">
                        {notification.message}
                      </p>
                      {notification.type === "appointment_rescheduled" && (
                        <div className="mt-2 p-2 bg-orange-50 rounded border border-orange-200">
                          <div className="text-xs text-orange-700">
                            <div className="flex items-center gap-1 mb-1">
                              <User className="w-3 h-3" />
                              <span className="font-medium">{notification.doctorName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>Changed from {notification.oldDateTime} to {notification.newDateTime}</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        {formatTimestamp(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => {
                notificationUtils.clearNotifications(patientName);
                setNotifications([]);
              }}
              className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Clear all notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 