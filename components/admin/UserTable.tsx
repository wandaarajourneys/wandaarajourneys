"use client";

import { useState } from "react";
import { Eye, EyeOff, MoreVertical } from "lucide-react";
import type { AdminRole } from "@prisma/client";
import { ResetPasswordModal } from "./ResetPasswordModal";
import { updateUserRole, toggleUserStatus } from "@/app/admin/(protected)/users/actions";

type User = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
};

export function UserTable({ initialUsers, isSuperAdmin }: { initialUsers: User[], isSuperAdmin: boolean }) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [resettingUser, setResettingUser] = useState<User | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const togglePassword = (id: string) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRoleChange = async (userId: string, newRole: AdminRole) => {
    if (!isSuperAdmin) return;
    const res = await updateUserRole(userId, newRole);
    if (res.success) {
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    }
  };

  const handleStatusToggle = async (userId: string, currentStatus: boolean) => {
    if (!isSuperAdmin) return;
    const res = await toggleUserStatus(userId, !currentStatus);
    if (res.success) {
      setUsers(users.map(u => u.id === userId ? { ...u, isActive: !currentStatus } : u));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-sand-50/50 text-xs uppercase tracking-wider text-teal-800/70 border-b border-sand-100">
              <th className="px-6 py-4 font-semibold">Name & Email</th>
              <th className="px-6 py-4 font-semibold">Role</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Password</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-sand-50/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-teal-900">{user.name}</div>
                  <div className="text-sm text-teal-700/60">{user.email}</div>
                </td>
                <td className="px-6 py-4">
                  {isSuperAdmin ? (
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as AdminRole)}
                      className="text-sm border-sand-200 rounded-lg bg-transparent focus:ring-terracotta-400 focus:border-terracotta-400"
                    >
                      <option value="SUPER_ADMIN">Super Admin</option>
                      <option value="TOUR_MANAGER">Tour Manager</option>
                      <option value="CONTENT_EDITOR">Content Editor</option>
                      <option value="CUSTOMER_SUPPORT">Customer Support</option>
                    </select>
                  ) : (
                    <span className="text-sm text-teal-800 bg-sand-100 px-2.5 py-1 rounded-full">
                      {user.role}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                    user.isActive ? "bg-green-100 text-green-800" : "bg-sand-100 text-teal-800/60"
                  }`}>
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <input
                      type={showPasswords[user.id] ? "text" : "password"}
                      value="********"
                      readOnly
                      className="bg-transparent border-none p-0 text-sm w-20 text-teal-800/70 focus:ring-0"
                    />
                    <button
                      onClick={() => togglePassword(user.id)}
                      className="text-teal-700/50 hover:text-teal-700 transition-colors"
                      title={showPasswords[user.id] ? "Hide password" : "Show password"}
                    >
                      {showPasswords[user.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-right relative">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                    className="p-1.5 text-teal-700/50 hover:bg-sand-100 rounded-md transition-colors"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {openMenuId === user.id && (
                    <div className="absolute right-6 mt-1 w-40 bg-white rounded-lg shadow-card border border-sand-100 z-10 py-1 text-sm text-teal-800">
                      <button
                        onClick={() => {
                          setOpenMenuId(null);
                          if (isSuperAdmin) setResettingUser(user);
                        }}
                        disabled={!isSuperAdmin}
                        className="w-full text-left px-4 py-2 hover:bg-sand-50 transition-colors disabled:opacity-50"
                      >
                        Reset Password
                      </button>
                      <button
                        onClick={() => {
                          setOpenMenuId(null);
                          handleStatusToggle(user.id, user.isActive);
                        }}
                        disabled={!isSuperAdmin}
                        className="w-full text-left px-4 py-2 hover:bg-sand-50 transition-colors text-terracotta-600 disabled:opacity-50"
                      >
                        {user.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {resettingUser && (
        <ResetPasswordModal
          user={resettingUser}
          onClose={() => setResettingUser(null)}
        />
      )}
    </div>
  );
}
