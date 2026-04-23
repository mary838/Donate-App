// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import Cookies from "js-cookie";
// import { MapPin, Calendar, Box, Phone, Mail } from "lucide-react";

// import StatCard from "../components/StatCard";
// import ProfileField from "../components/ProfileField";
// import ProfileHeader from "../components/ProfileHeader";

// interface UserData {
//   fullName: string;
//   email: string | null;
//   phone: string;
//   avatarUrl?: string;
//   dob?: string;
//   createdAt: string;
//   donationCount?: number;
// }

// const ProfilePage = () => {
//   const { t } = useTranslation();
//   const navigate = useNavigate();
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = Cookies.get("token");
//         if (!token) throw new Error("No auth token found.");

//         const res = await fetch("http://localhost:8080/api/v1/auth/profile", {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!res.ok) throw new Error("Failed to fetch profile data");

//         const data = await res.json();

//         setUserData({
//           fullName: data.fullName || "",
//           email: data.email,
//           phone: data.phone || "",
//           avatarUrl: data.avatarUrl,
//           dob: data.dob,
//           createdAt: data.createdAt,
//           donationCount: data.donationCount || 0,
//         });
//       } catch (err) {
//         console.error(err);
//         navigate("/signup");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [navigate]);

//   const handleLogout = () => {
//     Cookies.remove("token");
//     navigate("/signup");
//   };

//   if (loading)
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Loading...
//       </div>
//     );

//   if (!userData) return null;

//   const joinedDate = new Date(userData.createdAt).toLocaleString("en-US", {
//     month: "short",
//     year: "numeric",
//   });

//   return (
//     <div className="min-h-screen bg-[#FDFCFB] py-12 px-6">
//       <div className="max-w-3xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-10">
//           <h1 className="text-3xl font-bold text-gray-900 mb-1">
//             {t("profile.title")}
//           </h1>
//           <p className="text-gray-500 text-sm">{t("profile.subtitle")}</p>
//         </div>

//         {/* Profile Card */}
//         <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
//           <div className="p-8">
//             <ProfileHeader
//               fullName={userData.fullName}
//               avatarUrl={userData.avatarUrl}
//               joinedDate={joinedDate}
//               editLink="/edit-profile"
//             />

//             {/* Stats */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
//               <StatCard
//                 icon={<Box size={22} />}
//                 value={userData.donationCount || 0}
//                 label={t("profile.stats.donations")}
//               />
//               <StatCard
//                 icon={<MapPin size={22} />}
//                 value={userData.dob || "—"}
//                 label={t("profile.stats.dob")}
//               />
//               <StatCard
//                 icon={<Calendar size={22} />}
//                 value={joinedDate}
//                 label={t("profile.stats.joined")}
//               />
//             </div>

//             {/* Info Fields */}
//             <div className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <ProfileField
//                   label={t("profile.labels.fullName")}
//                   value={userData.fullName}
//                 />
//                 <ProfileField
//                   label={t("profile.labels.phone")}
//                   value={userData.phone}
//                 />
//               </div>

//               <ProfileField
//                 label={t("profile.labels.email")}
//                 value={userData.email || "—"}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Logout */}
//         <div className="mt-8 text-center">
//           <p className="text-gray-500 text-sm">
//             {t("profile.logoutPrompt") || "Want to switch accounts?"}{" "}
//             <button
//               onClick={handleLogout}
//               className="text-red-500 font-bold hover:text-red-600 hover:underline transition-all bg-transparent border-none p-0 cursor-pointer"
//             >
//               {t("profile.logoutLink") || "Log out"}
//             </button>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;
"use client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { MapPin, Calendar, Box, Package, User, Check, X, Clock, Send } from "lucide-react";

import StatCard from "../components/StatCard";
import ProfileField from "../components/ProfileField";
import ProfileHeader from "../components/ProfileHeader";

interface Donation {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  imageUrl?: string;
}

interface RequestItem {
  id: string;
  requesterName?: string; // Present for Received Requests
  donationTitle: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

interface UserData {
  fullName: string;
  email: string | null;
  phone: string;
  avatarUrl?: string;
  dob?: string;
  createdAt: string;
}

const ProfilePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<RequestItem[]>([]);
  const [myRequests, setMyRequests] = useState<RequestItem[]>([]); // New state for Requester view
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("No auth token found.");

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      // 1. Fetch Profile
      const profileRes = await fetch("http://localhost:8080/api/v1/auth/profile", { headers });
      const profileData = await profileRes.json();

      // 2. Fetch My Donations (Donor view)
      const donationsRes = await fetch("http://localhost:8080/api/v1/donations/my", { headers });
      const donationsData = donationsRes.ok ? await donationsRes.json() : [];

      // 3. Fetch Received Requests (Donor view - people wanting your items)
      const receivedRes = await fetch("http://localhost:8080/api/v1/requests/received", { headers });
      const receivedData = receivedRes.ok ? await receivedRes.json() : [];

      // 4. Fetch My Sent Requests (Requester view - items you asked for)
      const myRequestsRes = await fetch("http://localhost:8080/api/v1/requests/my", { headers });
      const myRequestsData = myRequestsRes.ok ? await myRequestsRes.json() : [];

      setUserData(profileData);
      setDonations(donationsData);
      setReceivedRequests(receivedData);
      setMyRequests(myRequestsData);
    } catch (err) {
      console.error("Fetch Error:", err);
      navigate("/signup");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [navigate]);

  const handleRequestAction = async (requestId: string, action: "approve" | "reject") => {
    try {
      const token = Cookies.get("token");
      const res = await fetch(`http://localhost:8080/api/v1/requests/${requestId}/${action}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        fetchAllData(); // Refresh UI to show the updated status for everyone
      } else {
        alert(`Failed to ${action} request`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!userData) return null;

  return (
    <div className="min-h-screen bg-[#FDFCFB] py-12 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* --- Profile Card --- */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <ProfileHeader fullName={userData.fullName} avatarUrl={userData.avatarUrl} joinedDate={userData.createdAt} editLink="/edit-profile" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <StatCard icon={<Box size={22} />} value={donations.length} label="My Items" />
            <StatCard icon={<Send size={22} />} value={myRequests.length} label="My Requests" />
            <StatCard icon={<Clock size={22} />} value={receivedRequests.filter(r => r.status === 'PENDING').length} label="Pending For Me" />
          </div>
        </div>

        {/* --- SECTION 1: MY SENT REQUESTS (For Requester to see status) --- */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Send size={20} className="text-blue-500" />
            Status of My Requests
          </h2>
          
          {myRequests.length === 0 ? (
            <p className="text-gray-400 text-center py-4">You haven't requested any items yet.</p>
          ) : (
            <div className="space-y-4">
              {myRequests.map((req) => (
                <div key={req.id} className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100">
                  <div>
                    <h4 className="font-bold text-gray-800">{req.donationTitle}</h4>
                    <p className="text-xs text-gray-500">Requested on {new Date(req.createdAt).toLocaleDateString()}</p>
                  </div>
                  
                  {/* Status Indicator */}
                  <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                    req.status === "APPROVED" ? "bg-green-100 text-green-700" : 
                    req.status === "REJECTED" ? "bg-red-100 text-red-700" : 
                    "bg-blue-100 text-blue-700"
                  }`}>
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- SECTION 2: INCOMING REQUESTS (For Donor to Approve/Reject) --- */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <User size={20} className="text-orange-500" />
            Incoming Requests (Manage)
          </h2>
          
          {receivedRequests.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No incoming requests to manage.</p>
          ) : (
            <div className="space-y-4">
              {receivedRequests.map((req) => (
                <div key={req.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100 gap-4">
                  <div>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{req.donationTitle}</p>
                    <h4 className="font-bold text-gray-800">From: {req.requesterName}</h4>
                  </div>

                  <div className="flex items-center gap-2">
                    {req.status === "PENDING" ? (
                      <>
                        <button 
                          onClick={() => handleRequestAction(req.id, "approve")}
                          className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-700 shadow-sm"
                        >
                          <Check size={16} /> Approve
                        </button>
                        <button 
                          onClick={() => handleRequestAction(req.id, "reject")}
                          className="flex items-center gap-1 bg-white text-red-600 border border-red-100 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-50"
                        >
                          <X size={16} /> Reject
                        </button>
                      </>
                    ) : (
                      <span className={`px-4 py-2 rounded-xl text-sm font-black uppercase ${
                        req.status === "APPROVED" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {req.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;