import { QuestionValidationError } from "@/types/questionnaire/batch";
import type { QuestionnaireResponse } from "@/types/questionnaire/form";
import type { Question } from "@/types/questionnaire/question";

import { QuestionInput } from "./QuestionInput";

interface QuestionGroupProps {
  question: Question;
  questionnaireResponses: QuestionnaireResponse[];
  updateQuestionnaireResponseCB: (response: QuestionnaireResponse) => void;
  errors: QuestionValidationError[];
  clearError?: () => void;
}

export function QuestionGroup({
  question,
  questionnaireResponses,
  updateQuestionnaireResponseCB,
  errors,
  clearError,
}: QuestionGroupProps) {
  const isGroup = question.type === "group";
  return (
    <div className="space-y-2">
      {!isGroup && (
        <QuestionInput
          question={question}
          questionnaireResponses={questionnaireResponses}
          updateQuestionnaireResponseCB={updateQuestionnaireResponseCB}
          errors={errors}
        />
      )}
      {isGroup &&
        question.questions?.map((subQuestion) => (
          <QuestionGroup
            key={subQuestion.id}
            question={subQuestion}
            questionnaireResponses={questionnaireResponses}
            updateQuestionnaireResponseCB={updateQuestionnaireResponseCB}
            errors={errors}
            clearError={clearError}
          />
        ))}
    </div>
  );
}
