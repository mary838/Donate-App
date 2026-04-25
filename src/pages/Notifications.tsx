"use client";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { User, Send, Package, Check, X, Phone, ArrowLeft } from "lucide-react";

interface RequestItem {
  id: string;
  donationTitle: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  requesterName?: string;
  requesterPhone?: string;
  donorName?: string;
  donorPhone?: string;
}

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [receivedRequests, setReceivedRequests] = useState<RequestItem[]>([]);
  const [myRequests, setMyRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const token = Cookies.get("token");

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const [rRes, mRes] = await Promise.all([
        fetch("http://localhost:8080/api/v1/requests/received", { headers }),
        fetch("http://localhost:8080/api/v1/requests/my", { headers }),
      ]);

      setReceivedRequests(rRes.ok ? await rRes.json() : []);
      setMyRequests(mRes.ok ? await mRes.json() : []);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: "approve" | "reject") => {
    try {
      const token = Cookies.get("token");

      const url = `http://localhost:8080/api/v1/requests/${id}/${action}`;
      console.log("Calling:", url);

      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Status:", res.status);

      const text = await res.text();
      console.log("Response:", text);

      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error("Action failed:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 font-medium">
        Loading requests...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FDFCFB] py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-10">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-semibold transition-all"
        >
          <ArrowLeft size={20} strokeWidth={2.5} /> Back to Profile
        </button>

        {/* INCOMING REQUESTS */}
        <div className="bg-white p-10 rounded-[32px] shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <User size={24} className="text-orange-500" /> Manage Incoming Requests
          </h2>

          <div className="space-y-6">
            {receivedRequests.map((req) => (
              <div key={req.id} className="p-8 bg-[#F9FAFB] rounded-[24px] border border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">

                <div className="flex-1 w-full space-y-3">
                  <div className="inline-flex items-center gap-2 bg-[#E0E7FF] text-[#3730A3] px-4 py-1.5 rounded-full border border-[#C7D2FE]">
                    <Package size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Item: {req.donationTitle}
                    </span>
                  </div>

                  <h4 className="text-xl font-bold text-gray-900">
                    Requested by: {req.requesterName}
                  </h4>

                  {req.status === "APPROVED" && (
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                      <span>Contact:</span>
                      <a
                        href={`tel:${req.requesterPhone}`}
                        className="flex items-center gap-1.5 text-green-600 font-bold hover:underline"
                      >
                        <Phone size={16} /> {req.requesterPhone}
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                  {req.status === "PENDING" ? (
                    <>
                      <button
                        onClick={() => handleAction(req.id, "approve")}
                        className="bg-green-600 text-white px-6 py-2 rounded-full font-bold"
                      >
                        <Check size={18} /> Approve
                      </button>

                      <button
                        onClick={() => handleAction(req.id, "reject")}
                        className="bg-white text-red-500 border border-red-500 px-6 py-2 rounded-full font-bold"
                      >
                        <X size={18} /> Reject
                      </button>
                    </>
                  ) : (
                    <span className="px-6 py-2 rounded-full font-bold">
                      {req.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MY REQUESTS */}
        <div className="bg-white p-10 rounded-[32px] shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <Send size={24} className="text-blue-500" /> My Requests Status
          </h2>

          <div className="space-y-6">
            {myRequests.map((req) => (
              <div key={req.id} className="p-8 bg-[#F9FAFB] rounded-[24px] border border-gray-50 flex justify-between items-center">

                <h4 className="font-bold">{req.donationTitle}</h4>

                <span className="font-bold">{req.status}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default NotificationsPage;