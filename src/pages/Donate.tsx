"use client";

import React, { useState, useEffect } from "react";
import { Camera, MapPin, Loader2, CheckCircle2, AlertCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Donate() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{type: 'success'|'error', text: string}|null>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    condition: "LIKE_NEW",
    address: "", 
    quantity: 1,
  });

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { "Authorization": `Bearer ${token}` } : {};
  };

  useEffect(() => {
    fetch("https://material-donation-backend-3.onrender.com/api/categories", { 
      headers: getAuthHeader() as any
    })
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : (data.content || [])))
      .catch(err => console.error("Category Load Error:", err));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) return setStatus({ type: 'error', text: "Select a category" });

    setIsSubmitting(true);
    setStatus(null);

    try {
      // 1. Create the Donation
      const res = await fetch("https://material-donation-backend-3.onrender.com/api/v1/donations", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...getAuthHeader() as any 
        },
        body: JSON.stringify({
          ...formData,
          quantity: Number(formData.quantity)
        }),
      });

      if (!res.ok) throw new Error("Failed to create donation info");
      const donation = await res.json();

      // 2. Upload Image (Using your provided endpoint structure)
      if (selectedFile && donation.id) {
        const imageData = new FormData();
        imageData.append("file", selectedFile);

        const imgRes = await fetch(`https://material-donation-backend-3.onrender.com/api/v1/donations/${donation.id}/images`, {
          method: "POST",
          headers: { ...getAuthHeader() as any },
          body: imageData,
        });

        if (!imgRes.ok) console.error("Image upload failed, but donation was created.");
      }

      setStatus({ type: 'success', text: "Success! Item listed." });
      setTimeout(() => navigate("/browse"), 2000);
    } catch (err: any) {
      setStatus({ type: 'error', text: err.message });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 text-black">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white border rounded-xl p-8 space-y-6 shadow-sm">
        <h1 className="text-2xl font-bold">List an Item</h1>

        {status && (
          <div className={`p-4 rounded-lg flex items-center gap-2 ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{status.text}</span>
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-semibold">Item Image</label>
          {previewUrl ? (
            <div className="relative w-full h-48">
              <img src={previewUrl} className="w-full h-full object-cover rounded-lg" alt="Preview" />
              <button type="button" onClick={() => {setSelectedFile(null); setPreviewUrl(null);}} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"><X size={16}/></button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <Camera className="text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Upload Image</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Title" className="p-3 border rounded-lg" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          <select className="p-3 border rounded-lg" value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})}>
            <option value="">Category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <MapPin className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input placeholder="Address" className="w-full p-3 pl-10 border rounded-lg" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
          </div>
          <select className="p-3 border rounded-lg" value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})}>
            <option value="NEW">New</option>
            <option value="LIKE_NEW">Like New</option>
            <option value="GOOD">Good</option>
          </select>
        </div>

        <textarea placeholder="Description" className="w-full p-3 border rounded-lg" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />

        <button type="submit" disabled={isSubmitting} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors">
          {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : "Submit Donation"}
        </button>
      </form>
    </div>
  );
}