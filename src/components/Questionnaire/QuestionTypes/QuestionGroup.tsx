import type { QuestionValue } from "@/types/questionnaire/form";
import type { Question } from "@/types/questionnaire/question";

import { QuestionInput } from "./QuestionInput";

interface QuestionGroupProps {
  question: Question;
  values: QuestionValue[];
  onChange: (value: QuestionValue) => void;
  depth?: number;
}

export function QuestionGroup({
  question,
  values,
  onChange,
  depth = 0,
}: QuestionGroupProps) {
  const isGroup = question.type === "group";

  return (
    <div className="space-y-4">
      {isGroup && question.text && <h3>{question.text}</h3>}
      {!isGroup && (
        <QuestionInput
          question={question}
          values={values}
          onChange={(newValue: QuestionValue) => onChange(newValue)}
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
