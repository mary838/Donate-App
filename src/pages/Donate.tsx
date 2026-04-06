"use client";

import React, { useState } from "react";
import { Camera, MapPin, Upload, ChevronDown, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom"; // FIX: Use useNavigate for Vite/React

interface FormData {
  title: string;
  categoryId: string;
  description: string;
  location: string;
  condition: string;
  quantity: number;
}

export default function DonatePage() {
  const navigate = useNavigate(); // FIX: Navigation hook

  const [formData, setFormData] = useState<FormData>({
    title: "",
    categoryId: "5a1af0ba-8ace-4198-931e-b29387e9ff5d", // Example UUID from your JSON
    description: "",
    location: "",
    condition: "LIKE_NEW",
    quantity: 1,
  });
  
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === "quantity" ? parseInt(value) || 1 : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    const token = localStorage.getItem("token");

    if (!token) {
      setStatusMessage({ type: 'error', text: "Please log in first." });
      setIsSubmitting(false);
      return;
    }

    try {
      // STEP 1: Create Donation Listing
      const response = await fetch("https://material-donation-backend-3.onrender.com/api/v1/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create donation.");
      }

      const result = await response.json();
      const donationId = result.id; 

      // STEP 2: Upload Images (Sequential)
      if (selectedImages.length > 0 && donationId) {
        for (const file of selectedImages) {
          const imageData = new FormData();
          imageData.append("file", file); // Backend expects "file"

          try {
            const imgRes = await fetch(`https://material-donation-backend-3.onrender.com/api/v1/donations/${donationId}/images`, {
              method: "POST",
              headers: { "Authorization": `Bearer ${token}` },
              body: imageData,
            });
            if (!imgRes.ok) console.error("Image upload failed for one file");
          } catch (err) {
            console.error("Image upload error:", err);
          }
        }
      }

      // STEP 3: Success and Redirect
      setStatusMessage({ type: 'success', text: "Donation posted! Redirecting to browse..." });
      
      setTimeout(() => {
        navigate("/browse"); // FIX: Standard React redirect
      }, 2000);

    } catch (error: any) {
      console.error("Submission Error:", error);
      setStatusMessage({ type: 'error', text: error.message || "An error occurred." });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 font-sans">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white border border-gray-200 rounded-xl p-8 space-y-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">List an Item</h1>

        {statusMessage && (
          <div className={`p-4 rounded-lg flex items-center gap-3 ${
            statusMessage.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {statusMessage.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            {statusMessage.text}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Condition</label>
              <select name="condition" value={formData.condition} onChange={handleInputChange} className="w-full p-3 border rounded-lg bg-white">
                <option value="NEW">New</option>
                <option value="LIKE_NEW">Like New</option>
                <option value="GOOD">Good</option>
                <option value="FAIR">Fair</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Quantity</label>
              <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} className="w-full p-3 border rounded-lg" min="1" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Category ID</label>
            <input 
              type="text" 
              name="categoryId" 
              value={formData.categoryId} 
              onChange={handleInputChange} 
              placeholder="Enter UUID"
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" required />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Photos</label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-all">
              <Camera className="text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">
                {selectedImages.length > 0 ? `${selectedImages.length} images selected` : "Click to upload"}
              </span>
              <input type="file" multiple accept="image/*" onChange={(e) => e.target.files && setSelectedImages(Array.from(e.target.files))} className="hidden" />
            </label>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full pl-10 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" required />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-all active:scale-[0.98]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin mr-2" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="mr-2" size={18} />
              Submit Donation
            </>
          )}
        </button>
      </form>
    </div>
  );
}