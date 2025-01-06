import { memo } from "react";

import { cn } from "@/lib/utils";

import { Label } from "@/components/ui/label";

import { QuestionValidationError } from "@/types/questionnaire/batch";
import type { QuestionnaireResponse } from "@/types/questionnaire/form";
import type { EnableWhen, Question } from "@/types/questionnaire/question";

import { QuestionInput } from "./QuestionInput";

interface QuestionGroupProps {
  question: Question;
  encounterId?: string;
  questionnaireResponses: QuestionnaireResponse[];
  updateQuestionnaireResponseCB: (response: QuestionnaireResponse) => void;
  errors: QuestionValidationError[];
  clearError: (questionId: string) => void;
  disabled?: boolean;
  activeGroupId?: string;
  facilityId: string;
}

function isQuestionEnabled(
  question: Question,
  questionnaireResponses: QuestionnaireResponse[],
) {
  if (!question.enable_when?.length) return true;

  const checkCondition = (enableWhen: EnableWhen) => {
    const dependentValue = questionnaireResponses.find(
      (v) => v.link_id === enableWhen.question,
    )?.values[0];

    // Early return if no dependent value exists
    if (!dependentValue?.value) return false;

    switch (enableWhen.operator) {
      case "exists":
        return dependentValue !== undefined && dependentValue !== null;
      case "equals":
        return dependentValue.value === enableWhen.answer;
      case "not_equals":
        return dependentValue.value !== enableWhen.answer;
      case "greater":
        return (
          typeof dependentValue.value === "number" &&
          dependentValue.value > enableWhen.answer
        );
      case "less":
        return (
          typeof dependentValue.value === "number" &&
          dependentValue.value < enableWhen.answer
        );
      case "greater_or_equals":
        return (
          typeof dependentValue.value === "number" &&
          dependentValue.value >= enableWhen.answer
        );
      case "less_or_equals":
        return (
          typeof dependentValue.value === "number" &&
          dependentValue.value <= enableWhen.answer
        );
      default:
        return true;
    }
  };

  return question.enable_behavior === "any"
    ? question.enable_when.some(checkCondition)
    : question.enable_when.every(checkCondition);
}

export const QuestionGroup = memo(function QuestionGroup({
  question,
  encounterId,
  questionnaireResponses,
  updateQuestionnaireResponseCB,
  errors,
  clearError,
  disabled,
  activeGroupId,
  facilityId,
}: QuestionGroupProps) {
  const isEnabled = isQuestionEnabled(question, questionnaireResponses);

  if (!isEnabled) {
    return null;
  }

  if (question.type !== "group") {
    return (
      <QuestionInput
        question={question}
        questionnaireResponses={questionnaireResponses}
        encounterId={encounterId}
        updateQuestionnaireResponseCB={updateQuestionnaireResponseCB}
        errors={errors}
        clearError={() => clearError(question.id)}
        disabled={disabled}
        facilityId={facilityId}
      />
    );
  }

  const isActive = activeGroupId === question.id;

  return (
    <div className="pt-4">
      <div
        className={cn(
          "space-y-4 rounded-lg border p-4",
          isActive && "ring-2 ring-primary",
        )}
      >
        {question.text && (
          <div className="space-y-1">
            <Label className="text-lg font-semibold text-green-600">
              {question.text}
            </Label>
            {question.description && (
              <p className="text-sm text-muted-foreground">
                {question.description}
              </p>
            )}
          </div>
        )}
        <div
          className={cn(
            "gap-2",
            question.styling_metadata?.classes &&
              question.styling_metadata.classes,
          )}
        >
          {question.questions?.map((subQuestion) => (
            <QuestionGroup
              facilityId={facilityId}
              key={subQuestion.id}
              question={subQuestion}
              questionnaireResponses={questionnaireResponses}
              updateQuestionnaireResponseCB={updateQuestionnaireResponseCB}
              errors={errors}
              clearError={clearError}
              disabled={disabled}
              activeGroupId={activeGroupId}
            />
          ))}
        </div>
      </div>
    </div>
  );
});
