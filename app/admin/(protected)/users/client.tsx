"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { UserTable } from "@/components/admin/UserTable";
import { AddUserForm } from "@/components/admin/AddUserForm";

export function UserManagementClient({ initialUsers }: { initialUsers: any[] }) {
  const [showAddModal, setShowAddModal] = useState(false);
  // Assume current user is SUPER_ADMIN for demonstration
  const isSuperAdmin = true;

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display text-teal-900">User Management</h1>
          <p className="mt-1 text-sm text-teal-700/70">Manage admin users and their access roles.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-lg bg-terracotta-500 px-4 py-2 text-sm font-medium text-white hover:bg-terracotta-600 transition-colors"
        >
          <Plus size={18} /> Add New User
        </button>
      </div>

      <UserTable initialUsers={initialUsers} isSuperAdmin={isSuperAdmin} />

      {showAddModal && <AddUserForm onClose={() => setShowAddModal(false)} />}
    </>
  );
}
