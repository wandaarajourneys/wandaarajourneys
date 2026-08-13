import { Metadata } from "next";
import { Plus } from "lucide-react";
import { getUsers } from "./actions";
import { UserTable } from "@/components/admin/UserTable";
import { AddUserForm } from "@/components/admin/AddUserForm";


export const metadata: Metadata = {
  title: "User Management | Admin Portal",
};

// Client component wrapper for state
import { UserManagementClient } from "./client";

export default async function UsersPage() {
  const { users = [], success } = await getUsers();

  return (
    <div className="space-y-6">
      <UserManagementClient initialUsers={users} />
    </div>
  );
}
