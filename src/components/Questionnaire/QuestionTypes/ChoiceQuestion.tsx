import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { QuestionnaireResponse } from "@/types/questionnaire/form";
import type { AnswerOption } from "@/types/questionnaire/question";
import type { Question } from "@/types/questionnaire/question";

interface ChoiceQuestionProps {
  question: Question;
  questionnaireResponse: QuestionnaireResponse;
  updateQuestionnaireResponseCB: (
    questionnaireResponse: QuestionnaireResponse,
  ) => void;
  disabled?: boolean;
}

export function ChoiceQuestion({
  question,
  questionnaireResponse,
  updateQuestionnaireResponseCB,
  disabled = false,
}: ChoiceQuestionProps) {
  const options: AnswerOption[] = question.answer_option || [];

  const handleValueChange = (newValue: string) => {
    updateQuestionnaireResponseCB({
      ...questionnaireResponse,
      values: [newValue],
    });
  };

  return (
    <Select
      value={questionnaireResponse.values[0]?.toString()}
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
