"use client";

import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import DonationGrid from '../components/DonationGrid';
import { Loader2, X, ChevronLeft, ChevronRight } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const Browse: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("All"); 
  const [donations, setDonations] = useState<any[]>([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Modal & API States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDonationId, setSelectedDonationId] = useState<string | null>(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset to page 1 when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategoryId]);

  // 1. Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/categories`);
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : data.content || []);
      } catch (err: any) {
        console.error("Category Load Error:", err);
      }
    };
    fetchCategories();
  }, []);

  // 2. Fetch Donations
  useEffect(() => {
    const fetchDonations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let url = `${BASE_URL}/api/v1/donations`;
        if (selectedCategoryId !== "All") {
          url += `?categoryId=${selectedCategoryId}`;
        }
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Error ${res.status}: Failed to fetch items`);
        
        const data = await res.json();
        const items = Array.isArray(data) ? data : data.content || [];

        const mappedItems = items.map((item: any) => ({
          id: item.id,
          title: item.title,
          location: item.address || "No Location",
          timeAgo: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recently",
          category: item.category?.name || "General",
          imageUrl: item.imageUrls?.[0] || "https://via.placeholder.com/400x300?text=No+Image",
          condition: item.condition || "New" 
        }));
        setDonations(mappedItems);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDonations();
  }, [selectedCategoryId]);

  // 3. Request Logic
  const handleSendRequest = async () => {
    if (!selectedDonationId || !requestMessage.trim()) return;
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token"); 
      const response = await fetch(`${BASE_URL}/api/v1/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ donationId: selectedDonationId, message: requestMessage }),
      });
      if (response.status === 403) throw new Error("Please log in to request items.");
      if (!response.ok) throw new Error("Failed to send request");

      alert("Request sent successfully!");
      setIsModalOpen(false);
      setRequestMessage('');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Pagination Logic ---
  const filteredDonations = donations.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDonations.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight mb-2">Browse Donations</h1>
        <p className="text-gray-500">Find items available for donation in your area.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <CategoryFilter categories={categories} selected={selectedCategoryId} onSelect={setSelectedCategoryId} />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-green-600" size={40} /></div>
      ) : error ? (
        <div className="text-center py-20 text-red-500 font-medium">{error}</div>
      ) : (
        <>
          <DonationGrid 
            items={currentItems} 
            onItemClick={(id) => { setSelectedDonationId(id); setIsModalOpen(true); }}
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border rounded-full disabled:opacity-30 hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              
              <span className="font-bold text-gray-700">
                Page {currentPage} of {totalPages}
              </span>

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border rounded-full disabled:opacity-30 hover:bg-gray-100 transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal UI */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-black text-gray-900 uppercase">Request Item</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={24} className="text-gray-400" /></button>
            </div>
            <textarea
              className="w-full h-32 p-4 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all resize-none mb-4"
              placeholder="Write your message here..."
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
            />
            <div className="flex gap-3">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 border-2 border-gray-100 rounded-xl font-bold uppercase text-xs">Cancel</button>
              <button 
                onClick={handleSendRequest}
                disabled={isSubmitting || !requestMessage.trim()}
                className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold uppercase text-xs disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={18} /> : "Send Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Browse;