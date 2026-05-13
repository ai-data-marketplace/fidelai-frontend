import dynamic from "next/dynamic";

const AnnotatorWorkspace = dynamic(
  () => import("@/features/annotator").then((mod) => ({ default: mod.AnnotatorWorkspace })),
  {
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-background text-sm text-muted-foreground">
        Loading workspace...
      </div>
    ),
  }
);

interface PageProps {
  params: Promise<{
    taskId: string;
  }>;
  searchParams: Promise<{
    assignmentId?: string;
  }>;
}

export default async function AnnotatorWorkspacePage({ params, searchParams }: PageProps) {
  const { taskId } = await params;
  const { assignmentId } = await searchParams;

  return (
    <div className="w-full h-full flex flex-col">
      <AnnotatorWorkspace taskId={taskId} assignmentId={assignmentId} />
    </div>
  );
}
