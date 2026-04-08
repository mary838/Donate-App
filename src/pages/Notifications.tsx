"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Check, X, Clock, Bell, Loader2, AlertCircle, RefreshCw } from "lucide-react";

interface Notification {
  id: string;
  message: string;
  senderId: string;
  createdAt: string;
  type?: "request" | "approval" | "rejection" | string;
}

interface NotificationsPageProps {
  userId: string;
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ userId }) => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const BASE_URL = "https://material-donation-backend-4.onrender.com/api/v1/notifications";

  const fetchNotifications = async () => {
    if (!userId) return;
    const token = localStorage.getItem("token");
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${BASE_URL}/user/${userId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();
      setNotifications(Array.isArray(data) ? data : []); 
    } catch (err: any) {
      setError(err.message || "Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  const handleAction = async (notificationId: string, targetUserId: string, actionType: string) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${BASE_URL}/send/${targetUserId}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          message: `Update: Your request has been ${actionType}.`,
          type: actionType,
          senderId: userId
        }),
      });

      if (response.ok) {
        // Remove the notification locally so it disappears after action
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        alert(`Success: Request ${actionType}`);
      }
    } catch (err) {
      console.error("Error sending notification:", err);
      alert("Failed to process action.");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-[#2DBB74]" size={40} />
      <p className="text-gray-500 font-medium">Loading notifications...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <AlertCircle className="text-red-500 mb-2" size={48} />
      <h2 className="text-xl font-bold">Connection Error</h2>
      <p className="text-gray-500 mb-6">{error}</p>
      <button onClick={fetchNotifications} className="flex items-center gap-2 bg-[#2DBB74] text-white px-6 py-2 rounded-xl">
        <RefreshCw size={18} /> Retry
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="bg-green-100 text-green-600 text-xs font-bold px-3 py-1 rounded-full">
              {notifications.length} Active
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center bg-white border border-dashed border-gray-300 rounded-2xl py-12">
              <p className="text-gray-400 italic">No new notifications.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div key={notif.id} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-5 shadow-sm">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center shrink-0">
                  <Bell className="text-green-500" size={20} />
                </div>
                
                <div className="flex-grow">
                  <p className="text-sm text-gray-800 font-medium">{notif.message}</p>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">
                    {notif.createdAt ? new Date(notif.createdAt).toLocaleTimeString() : "Recent"}
                  </p>
                </div>

                {/* Only show buttons if this is a "request" type notification */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleAction(notif.id, notif.senderId, "approved")}
                    className="bg-[#2DBB74] text-white p-2 rounded-lg hover:bg-[#259e62] transition"
                    title="Approve"
                  >
                    <Check size={18} />
                  </button>
                  <button 
                    onClick={() => handleAction(notif.id, notif.senderId, "rejected")}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
                    title="Reject"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;