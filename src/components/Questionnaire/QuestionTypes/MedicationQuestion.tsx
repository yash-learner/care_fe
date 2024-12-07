import { Label } from "@/components/ui/label";

import { QuestionnaireResponse } from "@/types/questionnaire/form";
import { Question } from "@/types/questionnaire/question";

interface MedicationQuestionProps {
  question: Question;
  questionnaireResponse: QuestionnaireResponse;
  updateQuestionnaireResponseCB: (response: QuestionnaireResponse) => void;
  disabled?: boolean;
}

export function MedicationQuestion({ question }: MedicationQuestionProps) {
  return (
    <div className="space-y-4">
      <Label>{question.text}</Label>
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-center text-sm text-gray-500">
        Medication component to be implemented
      </div>
    </div>
  );
}
