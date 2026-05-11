import { AnnotatorWorkspace } from "@/features/annotator";

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
