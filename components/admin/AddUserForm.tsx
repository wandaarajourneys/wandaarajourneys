"use client";

import { useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { addUser } from "@/app/admin/(protected)/users/actions";

export function AddUserForm({ onClose }: { onClose: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const res = await addUser(formData);
    
    if (res.success) {
      onClose();
    } else {
      setError(res.error || "Failed to add user");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-card overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-sand-100 shrink-0">
          <h2 className="font-display text-xl text-teal-900">Add New User</h2>
          <button onClick={onClose} className="text-teal-700/50 hover:text-teal-900 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && <p className="text-sm text-terracotta-600 bg-terracotta-50 p-3 rounded-lg">{error}</p>}
          
          <div>
            <label className="block text-sm font-medium text-teal-800 mb-1.5">Full Name</label>
            <input
              type="text"
              name="name"
              required
              className="w-full rounded-lg border-sand-200 bg-sand-50/50 text-sm focus:border-terracotta-400 focus:ring-terracotta-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-teal-800 mb-1.5">Email Address</label>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-lg border-sand-200 bg-sand-50/50 text-sm focus:border-terracotta-400 focus:ring-terracotta-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-teal-800 mb-1.5">Phone Number</label>
            <input
              type="text"
              name="phone"
              required
              className="w-full rounded-lg border-sand-200 bg-sand-50/50 text-sm focus:border-terracotta-400 focus:ring-terracotta-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-teal-800 mb-1.5">Assigned Role</label>
            <select
              name="role"
              required
              className="w-full rounded-lg border-sand-200 bg-sand-50/50 text-sm focus:border-terracotta-400 focus:ring-terracotta-400"
            >
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="TOUR_MANAGER">Tour Manager</option>
              <option value="CONTENT_EDITOR">Content Editor</option>
              <option value="CUSTOMER_SUPPORT">Customer Support</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-teal-800 mb-1.5">Initial Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                className="w-full rounded-lg border-sand-200 bg-sand-50/50 pr-10 text-sm focus:border-terracotta-400 focus:ring-terracotta-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-700/50 hover:text-teal-700"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-3 border-t border-sand-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-teal-700 bg-sand-100 rounded-lg hover:bg-sand-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-terracotta-500 rounded-lg hover:bg-terracotta-600 transition-colors disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
