import { ScoreConfiguration } from "@/features/admin/components/score-configuration";
import { PayoutRules } from "@/features/admin/components/payout-rules";
import { Wallet } from "lucide-react";
import { Tabs } from "@/components/ui/tabs";

export default function AdminSystemPage() {
  const adminSystemTabs = [
    {
      id: "score-config",
      label: "Score Configuration",
      content: (
        <ScoreConfiguration />
      )
    },
    {
      id: "payout-rules",
      label: "Payout Rules",
      content: (
        <PayoutRules />
      )
    },
  ];

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-4xl font-black tracking-tighter">System Administration</h1>
        <p className="text-muted-foreground text-lg">Platform configuration, quality assurance, and financial governance.</p>
      </header>

      <Tabs tabs={adminSystemTabs} />
    </div>
  );
}
