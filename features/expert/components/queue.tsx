"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, ChevronRight, Filter, Inbox } from "lucide-react";
import { useExpertTasks, useAcceptExpertTask, useDeclineExpertTask } from "@/lib/hooks";
import { PAGINATION } from "@/lib/constants";
import Link from "next/link";
import { useState } from "react";

const EXPERT_PAGE_SIZE = PAGINATION.DEFAULT_PAGE_SIZE;

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
        <Inbox className="w-8 h-8 text-muted-foreground" />
      </div>
      <div>
        <p className="text-lg font-black tracking-tight">No tasks available</p>
        <p className="text-sm text-muted-foreground mt-1">
          Check back soon — new tasks are assigned regularly.
        </p>
      </div>
    </div>
  );
}

export function ExpertQueueList() {
  const [status, setStatus] = useState<'assigned' | 'in_progress' | 'submitted'>('assigned');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useExpertTasks({ page, page_size: EXPERT_PAGE_SIZE, status });
  
  const acceptMutation = useAcceptExpertTask();
  const declineMutation = useDeclineExpertTask();

  const tasks = data?.results || [];
  const totalCount = data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / EXPERT_PAGE_SIZE));
  const hasPrevious = Boolean(data?.previous) && page > 1;
  const hasNext = Boolean(data?.next) && page < totalPages;

  const handleAccept = async (taskId: string) => {
    await acceptMutation.mutateAsync(taskId);
  };

  const handleDecline = async (taskId: string) => {
    await declineMutation.mutateAsync(taskId);
  };

  const handleStatusChange = (newStatus: 'assigned' | 'in_progress' | 'submitted') => {
    setStatus(newStatus);
    setPage(1);
  };

  return (
    <div className="space-y-4">
      
      {/* Status Filters */}
      <div className="flex items-center gap-2 flex-wrap pb-2 border-b border-border/50">
        {[
          { value: 'assigned' as const, label: 'Assigned' },
          { value: 'in_progress' as const, label: 'In Progress' },
          { value: 'submitted' as const, label: 'Submitted' },
        ].map((f) => (
          <Button
            key={f.value}
            size="sm"
            variant={status === f.value ? "default" : "outline"}
            onClick={() => handleStatusChange(f.value)}
            className="font-semibold"
          >
            {f.label}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-5 text-sm text-muted-foreground">Loading tasks...</CardContent>
        </Card>
      ) : tasks.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {tasks.map((task) => (
            <Card key={task.id} className="group border-border/50 bg-card/60 backdrop-blur-sm shadow-sm transition-all hover:bg-muted/10 hover:border-primary/30">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row items-stretch">
                  
                  {/* Left: Info */}
                  <div className="flex-1 p-6 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-black tracking-tight">{task.id}</h3>
                      <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted/30">
                        {task.domain}
                      </Badge>
                      <Badge className={`text-[10px] uppercase font-bold tracking-widest ${
                        task.status === 'assigned' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                        task.status === 'in_progress' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                        'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                      }`}>
                        {task.status === 'assigned' ? 'Assigned' : task.status === 'in_progress' ? 'In Progress' : 'Completed'}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-6 mt-4">
                      <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                        {task.name}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground font-semibold">
                        {task.total_chunks} Chunks
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground font-semibold">
                        Assigned {task.assigned_at}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="border-t lg:border-t-0 lg:border-l border-border/50 p-6 flex flex-row lg:flex-col items-center justify-center gap-3 bg-muted/10">
                    {task.status === 'assigned' && (
                      <>
                        <Link href={`/expert/workspace/${task.id}`} className="w-full">
                          <Button className="w-full text-sm font-black gap-2 h-12 shadow-lg shadow-primary/20">
                            <Check className="w-4 h-4" /> Resolve <ChevronRight className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          className="w-full text-xs font-bold text-muted-foreground"
                          onClick={() => handleDecline(task.id)}
                          disabled={declineMutation.isPending}
                        >
                          <X className="w-4 h-4 mr-2" /> Decline
                        </Button>
                      </>
                    )}
                    {task.status === 'in_progress' && (
                      <Link href={`/expert/workspace/${task.id}`} className="w-full">
                        <Button className="w-full text-sm font-black gap-2 h-12 shadow-lg shadow-primary/20">
                          Continue <ChevronRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    )}
                    {task.status === 'submitted' && (
                      <div className="w-full text-center">
                        <p className="text-sm font-semibold text-emerald-600">Completed</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState />
      )}

      {tasks.length > 0 && (
        <div className="flex items-center justify-between gap-3 pt-2">
          <p className="text-xs font-semibold text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={!hasPrevious}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={!hasNext}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
