import type { QuestionnaireResponse } from "@/types/questionnaire/form";
import type { Question } from "@/types/questionnaire/question";

import { QuestionInput } from "./QuestionInput";

interface QuestionGroupProps {
  question: Question;
  questionnaireResponses: QuestionnaireResponse[];
  updateQuestionnaireResponseCB: (
    questionnaireResponse: QuestionnaireResponse,
  ) => void;
  depth?: number;
}

export function QuestionGroup({
  question,
  questionnaireResponses,
  updateQuestionnaireResponseCB,
  depth = 0,
}: QuestionGroupProps) {
  const isGroup = question.type === "group";

  return (
    <div className="space-y-4">
      {isGroup && question.text && <h3>{question.text}</h3>}
      {!isGroup && (
        <QuestionInput
          question={question}
          questionnaireResponses={questionnaireResponses}
          updateQuestionnaireResponseCB={updateQuestionnaireResponseCB}
        />
      )}

      {isGroup &&
        question.questions?.map((subQuestion) => (
          <QuestionGroup
            key={subQuestion.id}
            question={subQuestion}
            questionnaireResponses={questionnaireResponses}
            updateQuestionnaireResponseCB={updateQuestionnaireResponseCB}
            depth={depth + 1}
          />
        ))}
    </div>
  );
}
