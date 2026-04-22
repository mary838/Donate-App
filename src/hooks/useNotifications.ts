// import { useState, useEffect } from "react";
// import type { Notification } from "../types/notification"; 
// import { fetchNotifications } from "../api/notifications";

// export const useNotifications = (userId: string) => {
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//  const loadNotifications = async () => {
//   const token = localStorage.getItem("token") || "";
//   if (!token) return setError("Token not found");
//   try {
//     setLoading(true);
//     setError(null);
//     const data = await fetchNotifications(userId, token); // <-- This waits for server
//     setNotifications(data);
//   } catch (err: any) {
//     setError(err.message || "Failed to load notifications.");
//   } finally {
//     setLoading(false);
//   }
// };

//   useEffect(() => {
//     if (userId) loadNotifications();
//   }, [userId]);

//   return { notifications, loading, error, loadNotifications, setNotifications };
// };
import { useState, useEffect, useCallback } from "react";
import { fetchUserNotifications, markAllRead } from "../api/notifications";

export const useNotifications = (userId: string) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const data = await fetchUserNotifications(userId);
      setNotifications(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const handleMarkAllRead = async () => {
    try {
      await markAllRead(userId);
      // Update local state to reflect all are read
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Error marking all as read", err);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  return { 
    notifications, 
    loading, 
    error, 
    loadNotifications, 
    setNotifications, 
    handleMarkAllRead 
  };
};