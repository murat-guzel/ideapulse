import { getEvaluationProgress } from "@/lib/actions/evaluate";
import { EVAL_REQUIRED } from "@/lib/constants";
import { SubmissionGate } from "@/components/submit/submission-gate";
import { IdeaForm } from "@/components/submit/idea-form";

export default async function SubmitPage() {
  const { completed } = await getEvaluationProgress();
  const canSubmit = completed >= EVAL_REQUIRED;

  return canSubmit ? (
    <IdeaForm />
  ) : (
    <div className="mx-auto max-w-lg py-12">
      <SubmissionGate completed={completed} />
    </div>
  );
}
