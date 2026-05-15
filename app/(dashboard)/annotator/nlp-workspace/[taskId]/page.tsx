import { NlpWorkspace } from "@/features/annotator/components/nlp-workspace";

export default async function NlpWorkspacePage({ params }: { params: any }) {
  const resolved = await params;
  const taskId = resolved?.taskId;

  return (
    <div className="w-full h-full flex flex-col">
      <NlpWorkspace taskId={taskId} />
    </div>
  );
}
