"use client";

import { useState, useMemo, useEffect } from "react";
import { Clock, Bell, Check, CheckCircle2, X, Loader2 } from "lucide-react";

/* -------------------- TYPES -------------------- */
// Updated to match your API response structure
interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string; // API usually returns ISO strings or formatted dates
  read: boolean;
  // If your API returns these specifically for donor requests:
  type?: string; 
  role?: string;
}

// Configuration from your .env
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const CURRENT_USER_ID = "replace-with-actual-user-id"; // Get this from your Auth context/store

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  /* -------------------- API CALLS -------------------- */

  // 1. Fetch User Notifications
  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/notifications/user/${CURRENT_USER_ID}`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // 2. Mark Single Notification as Read
  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/notifications/${id}/read`, {
        method: "PATCH",
      });
      if (response.ok) {
        // Optimistic UI update: update locally without waiting for refetch
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
      }
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  // 3. Mark All as Read
  const handleMarkAllRead = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/notifications/user/${CURRENT_USER_ID}/read-all`, {
        method: "PATCH",
      });
      if (response.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      }
    } catch (error) {
      console.error("Error marking all read:", error);
    }
  };

  /* -------------------- COMPUTED -------------------- */
  
  // Pending requests (Unread items)
  const pendingRequests = useMemo(
    () => notifications.filter((n) => !n.read),
    [notifications]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#1F2937] mb-1">Notifications</h1>
          <div className="flex items-center justify-center gap-2">
            <p className="text-gray-500 text-sm font-medium">Manage donation requests.</p>
            {pendingRequests.length > 0 && (
              <span className="bg-red-100 text-red-500 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                {pendingRequests.length} unread
              </span>
            )}
          </div>
        </div>

        {/* Pending Requests Section */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="text-[#EAB308] w-5 h-5" />
            <h2 className="text-lg font-bold text-gray-800">Pending Requests</h2>
          </div>

          <div className="space-y-4">
            {pendingRequests.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No new requests.</p>
            ) : (
              pendingRequests.map((notif) => (
                <div key={notif.id} className="bg-[#FFF9EE] border border-[#FDE68A]/30 rounded-3xl p-5 shadow-sm">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 font-bold">{notif.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                      <p className="text-[10px] text-gray-400 mt-2">{notif.createdAt}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="bg-[#10B981] hover:bg-[#059669] text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-colors"
                      >
                        <Check className="w-3 h-3" /> Approve
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* All Notifications Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell className="text-[#10B981] w-5 h-5" />
              <h2 className="text-lg font-bold text-gray-800">All Notifications</h2>
            </div>
            <button 
              onClick={handleMarkAllRead}
              className="text-[#10B981] text-xs font-bold flex items-center gap-1 hover:underline transition-all"
            >
              <CheckCircle2 className="w-3 h-3" /> Mark all read
            </button>
          </div>

          <div className="space-y-2">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => !notif.read && handleMarkAsRead(notif.id)}
                className={`border rounded-xl p-3 flex items-center justify-between transition-colors ${
                  notif.read ? "bg-white border-gray-100" : "bg-[#F0FDF4] border-[#DCFCE7] cursor-pointer"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                    <Bell className={`w-4 h-4 ${notif.read ? "text-gray-300" : "text-[#10B981]"}`} />
                  </div>
                  <div>
                    <p className={`text-xs ${notif.read ? "text-gray-500" : "text-gray-800 font-medium"}`}>
                      {notif.message}
                    </p>
                    <p className="text-[9px] text-gray-400 uppercase mt-0.5">{notif.createdAt}</p>
                  </div>
                </div>
                {!notif.read && <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}