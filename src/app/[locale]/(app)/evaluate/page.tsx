import { getNextIdea, getEvaluationProgress } from "@/lib/actions/evaluate";
import { EvaluateClient } from "@/components/evaluate/evaluate-client";

export default async function EvaluatePage() {
  const [ideaResult, progressResult] = await Promise.all([
    getNextIdea(),
    getEvaluationProgress(),
  ]);

  return (
    <EvaluateClient
      initialIdea={ideaResult.idea}
      initialProgress={progressResult.completed}
    />
  );
}
