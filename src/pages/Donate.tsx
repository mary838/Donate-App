"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MapPin, Loader2, CheckCircle2, AlertCircle, Camera, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Cloudinary configuration
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dml6kygxk/image/upload";
const UPLOAD_PRESET = "Mary_default";

// 1. Define Interfaces to avoid TypeScript 'never' errors
interface Category {
  id: string;
  name: string;
}

interface FormData {
  title: string;
  description: string;
  categoryId: string;
  condition: string;
  address: string;
  quantity: number;
}

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function Donate() {
  const navigate = useNavigate();
  
  // 2. Properly typed state hooks
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    categoryId: "",
    condition: "",
    address: "",
    quantity: 1,
  });

  // 3. Memoized header helper to ensure tokens are sent
  const getHeaders = useCallback(() => {
    const token = localStorage.getItem("token");
    return token ? { "Authorization": `Bearer ${token}` } : {};
  }, []);

  // 4. Fetch categories on component mount
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/categories`, { headers: getHeaders() })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load categories");
        return res.json();
      })
      .then((data) => setCategories(Array.isArray(data) ? data : data.content || []))
      .catch((err) => console.error("Category Load Error:", err));
  }, [getHeaders]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations
    if (!formData.categoryId) return setStatus({ type: "error", text: "Please select a category" });
    if (!imageFile) return setStatus({ type: "error", text: "Please upload an image" });

    setIsSubmitting(true);
    setStatus(null);

    try {
      // Step 1: Upload to Cloudinary
      const imageFormData = new FormData();
      imageFormData.append("file", imageFile);
      imageFormData.append("upload_preset", UPLOAD_PRESET);
      
      const cloudRes = await fetch(CLOUDINARY_URL, { method: "POST", body: imageFormData });
      const cloudData = await cloudRes.json();
      if (!cloudRes.ok) throw new Error("Image upload failed");

      // Step 2: Create Donation in Spring Boot
      const res = await fetch(`${BACKEND_URL}/api/v1/donations`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          ...getHeaders() 
        },
        body: JSON.stringify({ ...formData, quantity: Number(formData.quantity) }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create donation. Check login status.");
      }
      
      const donation = await res.json();

      // Step 3: Attach Image URL to the new Donation
      // Matches: @PostMapping("/{id}/images") with @RequestParam String imageUrl
      if (cloudData.secure_url && donation.id) {
        const imageAttachRes = await fetch(
          `${BACKEND_URL}/api/v1/donations/${donation.id}/images?imageUrl=${encodeURIComponent(cloudData.secure_url)}`, 
          {
            method: "POST",
            headers: getHeaders(),
          }
        );
        if (!imageAttachRes.ok) throw new Error("Donation created, but image attachment failed.");
      }

      setStatus({ type: "success", text: "Donation successful! Redirecting..." });
      setTimeout(() => navigate("/browse"), 2000);
    } catch (err: any) {
      setStatus({ type: "error", text: err.message });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-12 px-4 text-black font-sans">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg border border-gray-100 space-y-6">
        <h1 className="text-3xl font-black uppercase tracking-tight">List an Item</h1>

        {status && (
          <div className={`p-4 rounded-lg flex items-center gap-2 ${status.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {status.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm font-semibold">{status.text}</span>
          </div>
        )}

        {/* Image Picker */}
        <div className="space-y-2">
          {!preview ? (
            <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
              <Camera className="w-12 h-12 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 font-bold">Upload an image of the item</p>
              <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) { setImageFile(file); setPreview(URL.createObjectURL(file)); }
              }} />
            </label>
          ) : (
            <div className="relative h-56 w-full">
              <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-xl border" />
              <button 
                type="button" 
                onClick={() => {setPreview(""); setImageFile(null);}} 
                className="absolute top-3 right-3 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 shadow-md"
              >
                <X size={18}/>
              </button>
            </div>
          )}
        </div>

        {/* Form Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Title</label>
            <input 
              placeholder="e.g., Warm Winter Coat" 
              className="w-full p-3 border-2 border-gray-100 rounded-lg outline-none focus:border-green-500 transition-colors" 
              required 
              value={formData.title} 
              onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Category</label>
            <select 
              className="w-full p-3 border-2 border-gray-100 rounded-lg bg-white outline-none focus:border-green-500 transition-colors" 
              required 
              value={formData.categoryId} 
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            >
              <option value="">Select Category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Condition</label>
            <select 
              className="w-full p-3 border-2 border-gray-100 rounded-lg bg-white outline-none focus:border-green-500 transition-colors" 
              required 
              value={formData.condition} 
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
            >
              <option value="">Select Condition</option>
              <option value="NEW">New</option>
              <option value="LIKE_NEW">Like New</option>
              <option value="GOOD">Good</option>
              <option value="FAIR">Fair</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Quantity</label>
            <input 
              type="number" 
              min={1} 
              className="w-full p-3 border-2 border-gray-100 rounded-lg outline-none focus:border-green-500 transition-colors" 
              required 
              value={formData.quantity} 
              onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })} 
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">Pickup Address</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input 
              placeholder="123 Street Name, City" 
              className="w-full p-3 pl-10 border-2 border-gray-100 rounded-lg outline-none focus:border-green-500 transition-colors" 
              required 
              value={formData.address} 
              onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">Description</label>
          <textarea 
            placeholder="Tell us more about the item..." 
            className="w-full p-3 border-2 border-gray-100 rounded-lg h-32 outline-none focus:border-green-500 transition-colors resize-none" 
            required 
            value={formData.description} 
            onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full bg-green-600 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-green-700 disabled:bg-gray-300 transition-all flex justify-center items-center gap-2 shadow-lg active:scale-[0.98]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={20} /> Processing...
            </>
          ) : (
            "List Item Now"
          )}
        </button>
      </form>
    </div>
  );
}