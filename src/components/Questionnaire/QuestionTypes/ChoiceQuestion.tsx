import { Button } from "@/components/ui/button";

import type { AnswerOption } from "@/types/questionnaire/base";
import type { QuestionValue } from "@/types/questionnaire/form";
import type { Question } from "@/types/questionnaire/question";

interface ChoiceQuestionProps {
  question: Question;
  value: QuestionValue;
  onChange: (value: QuestionValue) => void;
}

export function ChoiceQuestion({
  question,
  value,
  onChange,
}: ChoiceQuestionProps) {
  const options: AnswerOption[] = question.answer_option || [];

  const handleValueChange = (newValue: string) => {
    onChange({
      ...value,
      value: newValue,
    });
  };

  return (
    <div className="flex flex-col gap-2">
      {options.map((option: AnswerOption, index: number) => (
        <Button
          key={index}
          type="button"
          variant={value.value === option.value ? "default" : "outline"}
          onClick={() => handleValueChange(option.value.toString())}
          className="justify-start"
        >
          {option.value}
        </Button>
      ))}
    </div>
  );
}
