"use client";

import { useState, useEffect, useCallback } from "react";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import DonationGrid from "../components/DonationGrid";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import type { DonationItem } from "../components/DonationCard";

// Unified to backend-6 based on your provided links
const BASE_URL = "https://material-donation-backend-6.onrender.com";
const ITEMS_PER_PAGE = 10;

export default function Browse() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All"); 
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null); 
  const [donations, setDonations] = useState<DonationItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { "Authorization": `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/categories`, { headers: getAuthHeader() as any });
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : data.content || []);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  const fetchDonations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let url = `${BASE_URL}/api/v1/donations`;
      // Use URLSearchParams for cleaner URL building
      if (selectedCategoryId) {
        url += `?categoryId=${selectedCategoryId}`;
      }

      const res = await fetch(url, { headers: getAuthHeader() as any });
      if (!res.ok) throw new Error("Failed to fetch donations");
      
      const donData = await res.json();
      const items = Array.isArray(donData) ? donData : donData.content || [];

      const mappedItems = items.map((item: any) => ({
        id: item.id,
        title: item.title,
        location: item.address || "No Location", 
        time: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recently",
        category: item.categoryName || item.category?.name || "General",
        condition: item.condition ? item.condition.replace(/_/g, " ") : "Good",
        image: item.imageUrls && item.imageUrls.length > 0
          ? item.imageUrls[0]
          : "https://via.placeholder.com/400?text=No+Image",
      }));

      setDonations(mappedItems);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategoryId]);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  const handleCategoryChange = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setCurrentPage(1);
    
    if (categoryName === "All") {
      setSelectedCategoryId(null);
    } else {
      const found = categories.find(c => c.name === categoryName);
      setSelectedCategoryId(found ? found.id : null);
    }
  };

  const filteredItems = donations.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-4 mb-12 max-w-4xl mx-auto">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <CategoryFilter
            categories={categories}
            value={selectedCategory}
            onChange={handleCategoryChange}
            isLoading={isLoading}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-green-600" size={40} />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 font-medium">{error}</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 text-gray-500 font-medium">No items found.</div>
        ) : (
          <>
            <DonationGrid items={currentItems} />
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border rounded hover:bg-gray-100 disabled:opacity-30"
                >
                  <ChevronLeft />
                </button>
                <span className="font-bold text-sm">Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border rounded hover:bg-gray-100 disabled:opacity-30"
                >
                  <ChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}