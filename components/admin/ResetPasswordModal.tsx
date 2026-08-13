"use client";

import { useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { resetUserPassword } from "@/app/admin/(protected)/users/actions";

export function ResetPasswordModal({
  user,
  onClose,
}: {
  user: { id: string; name: string };
  onClose: () => void;
}) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await resetUserPassword(user.id, password);
    if (res.success) {
      onClose();
    } else {
      setError(res.error || "Failed to reset password");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-sand-100">
          <h2 className="font-display text-xl text-teal-900">Reset Password for {user.name}</h2>
          <button onClick={onClose} className="text-teal-700/50 hover:text-teal-900 transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <p className="text-sm text-terracotta-600 bg-terracotta-50 p-3 rounded-lg">{error}</p>}
          
          <div>
            <label className="block text-sm font-medium text-teal-800 mb-1.5">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <div className="pt-4 flex justify-end gap-3">
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
              {loading ? "Saving..." : "Reset Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
