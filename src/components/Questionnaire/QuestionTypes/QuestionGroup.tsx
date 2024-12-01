import type { QuestionValue } from "@/types/questionnaire/form";
import type { Question } from "@/types/questionnaire/question";

import { QuestionInput } from "./QuestionInput";

interface QuestionGroupProps {
  question: Question;
  values: Record<string, QuestionValue>;
  onChange: (id: string, value: QuestionValue) => void;
  depth?: number;
}

export function QuestionGroup({
  question,
  values,
  onChange,
  depth = 0,
}: QuestionGroupProps) {
  const value = values[question.id] || {
    id: question.id,
    value: "",
  };

  const isGroup = question.type === "group";

  return (
    <div className={`space-y-4 ${depth > 0 ? "ml-4 border-l pl-4" : ""}`}>
      {!isGroup && (
        <QuestionInput
          question={question}
          value={value}
          onChange={(newValue: QuestionValue) =>
            onChange(question.id, newValue)
          }
        />
      )}

      {isGroup &&
        question.questions?.map((subQuestion) => (
          <QuestionGroup
            key={subQuestion.id}
            question={subQuestion}
            values={values}
            onChange={onChange}
            depth={depth + 1}
          />
        ))}
    </div>
  );
}
