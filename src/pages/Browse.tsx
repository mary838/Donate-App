"use client";

import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import DonationGrid from "../components/DonationGrid";
import { AlertCircle, Loader2 } from "lucide-react";
import type { DonationItem } from "../components/DonationCard";
import type { Category } from "../components/CategoryFilter";

export default function Browse() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [donations, setDonations] = useState<DonationItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper to get token
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { "Authorization": `Bearer ${token}` } : {};
  };

  // 1. Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://material-donation-backend-3.onrender.com/api/categories", {
          headers: getAuthHeader() // Added auth check
        });
        
        if (!res.ok) throw new Error("Failed to load categories");
        
        const data = await res.json();
        // Handle nested 'data' or 'content' keys
        const categoryList = Array.isArray(data) ? data : (data.data || data.content || []);
        setCategories(categoryList);
      } catch (err) {
        console.error("Categories fetch error:", err);
      }
    };
    fetchCategories();
  }, []);

  // 2. Fetch Actual Donations from Backend
  useEffect(() => {
    const fetchDonations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("https://material-donation-backend-3.onrender.com/api/v1/donations", {
          headers: getAuthHeader() // FIX: Added Auth header to resolve 403 Forbidden
        });
        
        if (!res.ok) {
           if (res.status === 403) throw new Error("Please log in to view donations.");
           throw new Error("Could not fetch donations from server.");
        }
        
        const responseData = await res.json();
        
        // FIX: Extract items based on common Spring Boot/Render backend patterns
        const items = Array.isArray(responseData) 
          ? responseData 
          : (responseData.data || responseData.content || []);
        
        const mappedItems = items.map((item: any) => ({
          id: item.id,
          title: item.title,
          location: item.location || "Unknown",
          time: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recently",
          category: item.category?.name || item.categoryName || "General",
          condition: item.condition ? item.condition.replace(/_/g, " ") : "Good",
          image: item.images && item.images.length > 0 
            ? item.images[0].url 
            : "https://images.unsplash.com/photo-1532622722190-68a516930ee0?auto=format&fit=crop&w=400&q=80",
        }));

        setDonations(mappedItems);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonations();
  }, []);

  // Filter logic
  const filteredItems = donations.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Browse Donations</h1>
          <p className="text-gray-600">Discover items available for donation in your community.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-12 max-w-4xl mx-auto">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <CategoryFilter
            categories={categories}
            value={selectedCategory}
            onChange={setSelectedCategory}
            isLoading={isLoading}
          />
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-green-600 mb-4" />
            <p className="text-gray-500 font-medium">Loading items...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm max-w-md mx-auto">
            <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
            <p className="text-red-600 font-semibold px-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No items found matching your criteria.</p>
          </div>
        ) : (
          <DonationGrid items={filteredItems} />
        )}
      </main>
    </div>
  );
}