import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { QuestionnaireResponse } from "@/types/questionnaire/form";
import type { Question } from "@/types/questionnaire/question";

interface NumberQuestionProps {
  question: Question;
  questionnaireResponse: QuestionnaireResponse;
  updateQuestionnaireResponseCB: (response: QuestionnaireResponse) => void;
  disabled?: boolean;
}

export function NumberQuestion({
  question,
  questionnaireResponse,
  updateQuestionnaireResponseCB,
  disabled,
}: NumberQuestionProps) {
  const handleChange = (value: string) => {
    const numericValue =
      question.type === "decimal" ? parseFloat(value) : parseInt(value);

    updateQuestionnaireResponseCB({
      ...questionnaireResponse,
      values: [
        {
          type: "number",
          value: numericValue,
        },
      ],
    });
  };

  return (
    <div className="space-y-2">
      <Label className="text-base font-medium">
        {question.link_id} - {question.text}
        {question.required && <span className="ml-1 text-red-500">*</span>}
      </Label>
      <Input
        type="number"
        value={questionnaireResponse.values[0]?.value?.toString() || ""}
        onChange={(e) => handleChange(e.target.value)}
        step={question.type === "decimal" ? "0.01" : "1"}
        disabled={disabled}
      />
    </div>
  );
}
