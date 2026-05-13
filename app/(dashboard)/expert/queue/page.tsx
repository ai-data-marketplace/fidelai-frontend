import { ExpertQueueList } from "@/features/expert/components/queue";
import { ListTodo } from "lucide-react";

export default function ExpertQueuePage() {
  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <section className="border-b pb-8">
        <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-[0.2em] mb-2">
          <ListTodo className="w-3.5 h-3.5" />
          Escalation Management
        </div>
        <h1 className="text-4xl font-black tracking-tighter">Review Queue</h1>
        <p className="text-muted-foreground text-lg leading-relaxed mt-1 max-w-3xl">
          Tasks waiting for final resolution. Prioritize tasks related to your domain.
        </p>
      </section>

      <ExpertQueueList />
    </div>
  );
}
