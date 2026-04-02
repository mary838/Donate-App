import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Added
import { Camera, ArrowLeft, Check } from "lucide-react";

const EditProfile: React.FC = () => {
  const { t } = useTranslation(); // Initialize translation hook
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "Sophaline Hong",
    phone: "+855 12 345 678",
    location: "Phnom Penh, Cambodia",
    bio: "I love sharing and helping the community. Looking forward to donating more!",
    profilePic:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      navigate("/profile");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header / Back Link */}
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-6 group"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="font-semibold text-sm">
            {t("editProfile.backToProfile")}
          </span>
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              {t("editProfile.title")}
            </h1>
            <p className="text-gray-500 text-sm mb-10">
              {t("editProfile.subtitle")}
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Profile Photo Upload Section */}
              <div className="flex flex-col items-center sm:flex-row gap-6 pb-8 border-b border-gray-50">
                <div className="relative">
                  <img
                    src={formData.profilePic}
                    alt="Profile"
                    className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-xl"
                  />
                  <button
                    type="button"
                    className="absolute -bottom-2 -right-2 bg-green-600 text-white p-2.5 rounded-xl shadow-lg hover:bg-green-700 transition-all hover:scale-110 active:scale-95"
                  >
                    <Camera size={18} />
                  </button>
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="font-bold text-gray-800 text-lg">
                    {t("editProfile.profilePicture")}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-widest">
                    {t("editProfile.photoSpecs")}
                  </p>
                </div>
              </div>

              {/* Form Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">
                    {t("editProfile.fullName")}
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-green-500/5 focus:border-green-500 focus:bg-white outline-none transition-all font-medium text-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">
                    {t("editProfile.phoneNumber")}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-green-500/5 focus:border-green-500 focus:bg-white outline-none transition-all font-medium text-gray-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">
                  {t("editProfile.location")}
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-green-500/5 focus:border-green-500 focus:bg-white outline-none transition-all font-medium text-gray-700"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">
                  {t("editProfile.bio")}
                </label>
                <textarea
                  name="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder={t("editProfile.bioPlaceholder")}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-green-500/5 focus:border-green-500 focus:bg-white outline-none transition-all resize-none font-medium text-gray-700 leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-[2] bg-green-600 text-white font-bold py-4 rounded-2xl hover:bg-green-700 shadow-lg shadow-green-200 transition-all active:scale-[0.98]"
                >
                  {t("editProfile.saveChanges")}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  className="flex-1 bg-gray-100 text-gray-600 font-bold py-4 rounded-2xl hover:bg-gray-200 transition-all active:scale-[0.98]"
                >
                  {t("editProfile.cancel")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Success Toast Notification */}
      {showSuccess && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="bg-green-500 rounded-full p-1">
            <Check size={18} strokeWidth={3} />
          </div>
          <p className="font-bold text-sm">{t("editProfile.success")}</p>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
