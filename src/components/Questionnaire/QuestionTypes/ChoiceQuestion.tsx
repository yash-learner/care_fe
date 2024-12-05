import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { AnswerOption } from "@/types/questionnaire/base";
import type { QuestionValue } from "@/types/questionnaire/form";
import type { Question } from "@/types/questionnaire/question";

interface ChoiceQuestionProps {
  question: Question;
  value: QuestionValue;
  onChange: (value: QuestionValue) => void;
  disabled?: boolean;
}

export function ChoiceQuestion({
  question,
  value,
  onChange,
  disabled = false,
}: ChoiceQuestionProps) {
  const options: AnswerOption[] = question.answer_option || [];

  const handleValueChange = (newValue: string) => {
    onChange({
      ...value,
      value: newValue,
    });
  };

  return (
    <Select
      value={value.value?.toString()}
      onValueChange={handleValueChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option: AnswerOption) => (
          <SelectItem
            key={option.value.toString()}
            value={option.value.toString()}
          >
            {option.value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
