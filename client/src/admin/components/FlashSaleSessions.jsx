import React, { useState, useEffect } from "react";
import { useAdminFlashSales } from "../hooks/useAdminFlashSales";
import {
  Calendar,
  Clock,
  Plus,
  Image as ImageIcon,
  Upload,
  X,
} from "lucide-react";

const FlashSaleSessions = () => {
  const { sessions, loading, fetchSessions, createSession } =
    useAdminFlashSales();
  const [showForm, setShowForm] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // State for new form
  const [formData, setFormData] = useState({
    title: "",
    startTime: "",
    endTime: "",
    image: null,
  });

  // 1. Clean up memory leaks from object URLs when component unmounts or preview changes
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image is too large. Please choose an image under 2MB.");
        return;
      }
      // Clean up old preview before creating a new one
      if (imagePreview) URL.revokeObjectURL(imagePreview);

      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    // Clean up memory
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setFormData({ ...formData, image: null });
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(formData.startTime) >= new Date(formData.endTime)) {
      alert("Start time must be before end time!");
      return;
    }

    // Pass data to hook (Hook handles FormData conversion)
    const success = await createSession(formData);

    if (success) {
      setShowForm(false);
      setFormData({ title: "", startTime: "", endTime: "", image: null });
      // Clean up memory
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition-all shadow-sm ${
            showForm
              ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {showForm ? (
            "Cancel"
          ) : (
            <>
              <Plus size={18} /> Create New Session
            </>
          )}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-lg animate-in fade-in slide-in-from-top-4">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Calendar className="text-blue-600" size={20} /> Setup New Campaign
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">
                  Campaign Title
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="e.g. Flash Sale 12.12"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-blue-700">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  className="w-full border border-gray-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-red-700">
                  End Time
                </label>
                <input
                  type="datetime-local"
                  className="w-full border border-gray-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  required
                />
              </div>

              {/* Upload Banner */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">
                  Event Banner (Horizontal)
                </label>
                {!imagePreview ? (
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-blue-200 rounded-xl cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-blue-500" />
                      <p className="text-sm text-blue-700 font-medium">
                        Click to upload Banner
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG (Max 2MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                ) : (
                  <div className="relative group">
                    <img
                      src={imagePreview}
                      className="w-full h-48 object-cover rounded-xl border shadow-inner"
                      alt="Preview"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-300 shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? "Saving..." : "Save & Activate Session"}
            </button>
          </form>
        </div>
      )}

      {/* Sessions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((s) => {
          const isEnded = new Date(s.endTime) < new Date();
          return (
            <div
              key={s._id}
              className={`group bg-white rounded-2xl border shadow-sm transition-all hover:shadow-md ${
                isEnded
                  ? "opacity-60 grayscale"
                  : "border-gray-100 hover:border-blue-300"
              }`}
            >
              <div className="relative h-32 overflow-hidden rounded-t-2xl bg-gray-100">
                {s.image ? (
                  <img
                    src={s.image}
                    alt={s.title}
                    className="w-full h-full object-cover"
                    loading="lazy" // 2. Lazy loading for performance
                    onError={(e) => {
                      // 3. Fallback if image fails to load
                      e.target.src =
                        "https://placehold.co/600x200?text=No+Banner";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ImageIcon size={32} />
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <span
                    className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                      isEnded
                        ? "bg-gray-800 text-white"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {isEnded ? "Ended" : "Active"}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h4 className="font-bold text-gray-900 mb-3 line-clamp-1">
                  {s.title}
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock size={14} className="text-blue-500" />
                    <span>
                      Start: {new Date(s.startTime).toLocaleString("vi-VN")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock size={14} className="text-red-500" />
                    <span>
                      End: {new Date(s.endTime).toLocaleString("vi-VN")}
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {s.products?.length || 0} Products
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FlashSaleSessions;
