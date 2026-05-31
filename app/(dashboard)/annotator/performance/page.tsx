"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Info } from "lucide-react";

export type ConsensusStatus =
  | "Agreed"
  | "Partially Agreed"
  | "Disputed (Escalated)";

export interface CompletedTaskRecord {
  id: string;
  domain: string;
  chunksCompleted: number;
  accuracy: number;
  date: string;
  consensusStatus: ConsensusStatus;
}

const completedTasksRecords: CompletedTaskRecord[] = [
  {
    id: "TASK-1082",
    domain: "Health",
    chunksCompleted: 12,
    accuracy: 94.2,
    date: "2026-04-14",
    consensusStatus: "Agreed",
  },
  {
    id: "TASK-1079",
    domain: "Legal",
    chunksCompleted: 8,
    accuracy: 78.5,
    date: "2026-04-14",
    consensusStatus: "Disputed (Escalated)",
  },
  {
    id: "TASK-1071",
    domain: "Finance",
    chunksCompleted: 15,
    accuracy: 96.0,
    date: "2026-04-13",
    consensusStatus: "Agreed",
  },
  {
    id: "TASK-1065",
    domain: "Tech",
    chunksCompleted: 10,
    accuracy: 88.3,
    date: "2026-04-13",
    consensusStatus: "Partially Agreed",
  },
  {
    id: "TASK-1058",
    domain: "Health",
    chunksCompleted: 9,
    accuracy: 91.7,
    date: "2026-04-12",
    consensusStatus: "Agreed",
  },
  {
    id: "TASK-1050",
    domain: "Agriculture",
    chunksCompleted: 20,
    accuracy: 85.0,
    date: "2026-04-11",
    consensusStatus: "Agreed",
  },
  {
    id: "TASK-1044",
    domain: "Legal",
    chunksCompleted: 6,
    accuracy: 72.0,
    date: "2026-04-10",
    consensusStatus: "Disputed (Escalated)",
  },
];

function StatusBadge({ status }: { status: ConsensusStatus }) {
  if (status === "Agreed") {
    return (
      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 font-bold hover:bg-emerald-500/20">
        Agreed
      </Badge>
    );
  }
  if (status === "Partially Agreed") {
    return (
      <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30 font-bold hover:bg-amber-500/20">
        Partially Agreed
      </Badge>
    );
  }
  return (
    <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/30 font-bold hover:bg-rose-500/20">
      Disputed
    </Badge>
  );
}

function AccuracyBadge({ value }: { value: number }) {
  let colorClass = "text-emerald-600 bg-emerald-500/10 border-emerald-500/30";
  if (value < 90)
    colorClass = "text-amber-600 bg-amber-500/10 border-amber-500/30";
  if (value < 80)
    colorClass = "text-rose-600 bg-rose-500/10 border-rose-500/30";

  return (
    <div
      className={`inline-flex px-2 py-0.5 rounded-md border font-black text-xs ${colorClass}`}
    >
      {value.toFixed(1)}%
    </div>
  );
}

export default function AnnotatorPerformancePage() {
  return (
    <div className="space-y-12 pb-20">
      <section className="border-b pb-8">
        <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-[0.2em] mb-2">
          <FileText className="w-3.5 h-3.5" />
          Performance Records
        </div>
        <h1 className="text-4xl font-black tracking-tighter">
          Completed Tasks
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed mt-1">
          Review factual records of your completed task batches and outcomes.
        </p>
      </section>

      <section>
        <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20 max-w-3xl">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-primary/80 font-medium leading-relaxed">
            Each task is reviewed by multiple annotators. Final outcomes are
            determined using consensus. Disputed tasks are escalated to Expert
            Reviewers for final arbitration.
          </p>
        </div>
      </section>

      <section>
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden">
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">
                    Task ID
                  </th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">
                    Domain
                  </th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground text-center">
                    Chunks
                  </th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground text-center">
                    Your Accuracy
                  </th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">
                    Consensus Status
                  </th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground text-right">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {completedTasksRecords.map((task) => (
                  <tr
                    key={task.id}
                    className="hover:bg-muted/20 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <span className="font-black text-sm">{task.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full border bg-muted/50 text-muted-foreground uppercase tracking-wider">
                        {task.domain}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-bold text-sm text-muted-foreground">
                        {task.chunksCompleted}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <AccuracyBadge value={task.accuracy} />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={task.consensusStatus} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-medium text-muted-foreground">
                        {new Date(task.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
