import { UsersTable } from "@/features/admin/components/users-table";
import { RoleApprovals } from "@/features/admin/components/role-approvals";
import { Users as UsersIcon } from "lucide-react";
import { Tabs } from "@/components/ui/tabs";

export default function AdminUsersPage() {
  const adminUserTabs = [
    {
      id: "all-users",
      label: "Platform Users",
      content: (
        <div className="space-y-6 pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div className="space-y-1">
                <h2 className="text-2xl font-black flex items-center gap-2">
                   <UsersIcon className="h-6 w-6 text-primary" />
                   Internal Directory
                </h2>
                <p className="text-sm text-muted-foreground font-medium">Manage user identities, access levels, and security statuses.</p>
             </div>
          </div>
          <UsersTable />
        </div>
      )
    },
    {
      id: "approvals",
      label: "Role Applications",
      content: (
        <div className="space-y-6 pt-6">
           <RoleApprovals />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-4xl font-black tracking-tighter">User Management</h1>
        <p className="text-muted-foreground text-lg">Control access and verify identities across the platform ecosystem.</p>
      </header>

      <Tabs tabs={adminUserTabs} />
    </div>
  );
}
