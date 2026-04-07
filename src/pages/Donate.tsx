"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Loader2, CheckCircle2, AlertCircle, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Cloudinary upload utility
async function uploadImageToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "YOUR_UPLOAD_PRESET"); // <-- replace with your preset

  const res = await fetch("https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to upload image to Cloudinary");
  const data = await res.json();
  return data.secure_url; // Cloudinary image URL
}

export default function Donate() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

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
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    fetch("https://material-donation-backend-4.onrender.com/api/categories", {
      headers: getAuthHeader() as any,
    })
      .then((res) => res.json())
      .then((data) => setCategories(Array.isArray(data) ? data : data.content || []))
      .catch((err) => console.error("Category Load Error:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) return setStatus({ type: "error", text: "Please select a category" });

    setIsSubmitting(true);
    setStatus(null);

    try {
      // 1️⃣ Upload image to Cloudinary
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
      }

      // 2️⃣ Create donation
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      const token = localStorage.getItem("token");
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch("https://material-donation-backend-4.onrender.com/api/v1/donations", {
        method: "POST",
        headers,
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          categoryId: formData.categoryId,
          condition: formData.condition,
          address: formData.address,
          quantity: Number(formData.quantity),
        }),
      });

      if (!res.ok) throw new Error("Failed to create donation");
      const donation = await res.json();

      // 3️⃣ Link image to donation
      if (imageUrl && donation.id) {
        const imageHeaders: Record<string, string> = {};
        if (token) imageHeaders.Authorization = `Bearer ${token}`;

        await fetch(
          `https://material-donation-backend-4.onrender.com/api/v1/donations/${donation.id}/images?imageUrl=${encodeURIComponent(
            imageUrl
          )}`,
          {
            method: "POST",
            headers: imageHeaders,
          }
        );
      }

      setStatus({ type: "success", text: "Donation successful!" });
      setTimeout(() => navigate("/browse"), 2000);
    } catch (err: any) {
      setStatus({ type: "error", text: err.message });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-12 px-4 text-black">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white p-8 rounded-xl shadow space-y-6">
        <h1 className="text-2xl font-bold">List an Item</h1>

        {/* STATUS */}
        {status && (
          <div
            className={`p-3 rounded ${
              status.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {status.text}
          </div>
        )}

        {/* IMAGE UPLOAD */}
        <div>
          <label
            htmlFor="fileUpload"
            className="cursor-pointer block border-2 border-dashed p-6 rounded-lg text-center hover:bg-gray-50"
          >
            <Camera className="mx-auto mb-2 text-gray-400" />
            <input
              type="file"
              className="hidden"
              id="fileUpload"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImageFile(file);
                  setPreview(URL.createObjectURL(file));
                }
              }}
            />
            Click to upload image
          </label>

          {preview && (
            <img
              src={preview}
              alt="Preview of uploaded item"
              className="mt-3 w-full h-40 object-cover rounded"
            />
          )}
        </div>

        {/* FORM */}
        <input
          placeholder="Title"
          className="p-3 border rounded w-full"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        <select
          className="p-3 border rounded w-full"
          value={formData.categoryId}
          onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
        >
          <option value="">Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          placeholder="Address"
          className="p-3 border rounded w-full"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />

        <textarea
          placeholder="Description"
          className="p-3 border rounded w-full"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded flex justify-center items-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Submit"}
        </button>
      </form>
    </div>
  );
}