"use client";

import { useRole } from "@/context/role-context";
import { Select } from "@/components/ui/select";
import { ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

const roles = [
  { value: "contributor", label: "Contributor" },
  { value: "annotator", label: "Annotator" },
  { value: "expert", label: "Expert" },
  { value: "buyer", label: "Buyer" },
  { value: "admin", label: "Admin" },
];

export function RoleToggle() {
  const { role, setRole } = useRole();
  const router = useRouter();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as any;
    setRole(newRole);

    router.push(`/${newRole}`);
  };

  return (
    <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-lg border shadow-sm">
      <ShieldCheck className="w-4 h-4 text-primary" />
      <span className="text-xs font-semibold text-muted-foreground hidden sm:inline">
        Role:
      </span>
      <select
        value={role || "contributor"}
        onChange={handleRoleChange}
        className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer"
      >
        {roles.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>
    </div>
  );
}
